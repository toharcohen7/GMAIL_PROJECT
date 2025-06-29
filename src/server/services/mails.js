const BlacklistService = require('./blacklist.js');
const LabelsService = require('./labels.js');
const Mail = require('../models/mails.js'); // Import the Mongoose model for Mail

/**
 * Returns the last 50 mails sent or received by a specific user,
 * sorted from newest to oldest based on timestamp.
 */
const get50Mails = async (userId, offset = 0, labelName = null) => {
  let mails = await Mail.find({ userId: userId }).lean(); // Fetch all mails for the user

  if (labelName !== null && labelName !== 'Starred') {
    mails = mails.filter(mail => mail.labelName === labelName);
  }

  if( labelName === 'Starred') {
    mails = mails.filter(mail => mail.starred === true);
  }
  
  return mails.sort((a, b) => b.timestamp - a.timestamp).slice(offset, offset + 50);
};

/**
 * Creates a new draft mail for a sender.
 * Initializes with empty subject, content, no receivers, and labelName as Draft.
 */
const createMail = async (senderId) => {


  const newMailForSender = new Mail({
    userId: senderId,
    mailStatus: 'Draft',
    senderId: senderId,
    receiversNames: [],
    subject: '',
    content: '',
    labelName: 'Draft',
    timestamp: new Date().getTime(),
    formattedTime: new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jerusalem'
    }),
    starred: false,
    onRead: true // Initially marked as read for the sender
  });

  await newMailForSender.save(); // Save the new mail to the database
  await LabelsService.addLabelCountBadgeByOne(senderId, 'Draft'); // Increment Draft label count
  return newMailForSender;
};

/**
 * Retrieves a specific mail by its ID from a user's mail list.
 */
const getMailById = (userId, mailId) => {
  return Mail.findOne({ userId: userId, _id: mailId }).lean();
};

/**
 * Deletes a specific mail (by ID) from a user's mail list.
 * Only affects that user's view of the mail.
 */
const deleteMail = async (userId, mailId) => {
  const mail = await getMailById(userId, mailId);
  if (!mail) return undefined; // Mail not found for that user

  // If the mail was unread, decrement the label count
  if (mail.onRead === false) {
    await LabelsService.decreaseLabelCountBadgeByOne(userId, mail.labelName);
  }

  // Remove the mail from the user's mailbox
  await Mail.deleteOne({ _id: mailId });
};

/**
 * Updates fields (subject, content, receivers, label) of a mail.
 * Only allowed for the sender. Updates apply to sender's mail,
 * and may create copies for receivers if the mail is sent.
 */
const updateMail = async (userId, mailId, updates) => {
  const mail = await Mail.findOne({ userId: userId, _id: mailId });
  if (!mail) return undefined;

  // Update subject/content if provided
  if (updates.subject !== undefined) {
    mail.subject = updates.subject;
  }
  if (updates.content !== undefined) {
    mail.content = updates.content;
  }

  // Update receivers list if provided
  if (updates.receiversNames !== undefined) {
    mail.receiversNames = updates.receiversNames;
  }

  if (updates.starred !== undefined) {
    mail.starred = updates.starred;
  }

  if (updates.labelName !== undefined && mail.onRead === false) {

    // If the mail is unread, update label count for the old label and new label
    await LabelsService.decreaseLabelCountBadgeByOne(userId, mail.labelName);
    await LabelsService.addLabelCountBadgeByOne(userId, updates.labelName);
  }

  // Update onRead status if provided
  if (updates.onRead !== undefined && mail.onRead !== updates.onRead) {
    mail.onRead = updates.onRead;
    // If mail is marked as read, update label count
    if (mail.onRead === true) {
      await LabelsService.decreaseLabelCountBadgeByOne(userId, mail.labelName);
    } else {
      await LabelsService.addLabelCountBadgeByOne(userId, mail.labelName);
    }
  }

  // Update timestamp to reflect the update
  if( mail.mailStatus === 'Draft') {
    mail.timestamp = new Date().getTime();
    mail.formattedTime = new Date(mail.timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jerusalem'
    });
  }

  // If label is being changed (e.g., sending), process accordingly
  if (updates.labelName !== undefined) {
    // If changing from draft to sent, create mail copies for receivers
    if (mail.labelName === 'Draft' && updates.labelName === 'Sent') {
      await sendMail(mail.receiversNames, mail);
    } else {
      // If changing label to something else, just update the label
      mail.labelName = updates.labelName; // Update mail status to new label 
    }
  }

  await mail.save();
  return mail;
};

/**
 * Searches for a given query string in both subject and content fields
 * for all mails of a given user.
 */

const searchQueryInMails = async (userId, query) => {
  const Users = require('./users.js');
  const allMails = await Mail.find({ userId: userId }).lean();

  const results = await Promise.all(allMails.map(async (mail) => {
    const sender = await Users.getUser(mail.senderId);
    const senderName = sender ? `${sender.firstName} ${sender.lastName}` : '';

    const isMatch =
      mail.subject.includes(query) ||
      mail.content.includes(query) ||
      senderName.includes(query);

    return isMatch ? mail : null;
  }));

  return results.filter(Boolean); // Remove nulls
};


/**
 * Returns the status (Draft/Sent/Received) of a specific mail.
 * Throws an error if the mail doesn't exist for the user.
 */
const getMailStatus = async (userId, mailId) => {
  const mail = await getMailById(userId, mailId);
  if (!mail) {
    throw new Error(`Mail with ID ${mailId} does not exist for user ${userId}`);
  }
  return mail.mailStatus;
};

/**
 * Returns the receivers of a given mail.
 */
const getRecivers = async (userId, mailId) => {
  const mail = await getMailById(userId, mailId);
  return mail ? mail.receiversNames : [];
};

/**
 * Marks a mail as "Sent" and creates a copy for each receiver.
 * The original remains with the sender, new instances are added to each receiver.
 */
const sendMail = async (receiversNames, mail) => {

  // Import Users model to get user IDs. this is done here to avoid circular dependencies.
  const Users = require('./users.js'); 

  mail.mailStatus = 'Sent';     // Mark as sent
  mail.labelName = 'Sent';     // Set label to "Sent"

  if (false === mail.onRead) {
    await LabelsService.decreaseLabelCountBadgeByOne(mail.senderId, mail.labelName); // Decrement Draft label count
    mail.onRead = true;          // Mark as read for the sender
  }

  // Check for blacklisted links
  const receiverMailLabel = await isSpamMail(mail.subject, mail.content);

  // Add mail to each receiver's mailbox
  for (const receiverName of receiversNames) {

    let receiverId = await Users.getIdFromUserName(receiverName);

    const user = await Users.getUser(receiverId);
    if (!user) {
      throw new Error(`Receiver ${receiverName} does not exist`);
    }

    // Create a new mail instance for the receiver
    const newMailForReceivers = new Mail({
      userId: receiverId,
      mailStatus: 'Received',
      senderId: mail.senderId,
      receiversNames: mail.receiversNames,
      subject: mail.subject,
      content: mail.content,
      labelName: receiverMailLabel, // Set label based on spam check
      timestamp: new Date().getTime(),
      formattedTime: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Jerusalem'
      }),
      starred: false,
      onRead: false // Initially unread for the receiver
    });

    // Save the new mail for the receiver
    await newMailForReceivers.save();
    await LabelsService.addLabelCountBadgeByOne(receiverId, receiverMailLabel); // Increment Received label count
  }
};

async function removeMailsFromLabel(userId, labelName) {
  // Remove all mails with the specified labelName from the user's mail list
  const mails = await Mail.find({ userId: userId, labelName: labelName });
  
  for ( const mail of mails) {
    // If the mail is unread, decrement the label count
    if (mail.onRead === false) {
      await LabelsService.decreaseLabelCountBadgeByOne(userId, mail.labelName);
    }

    // Reset the labelName to mailStatus for the deleted mail
    mail.labelName = mail.mailStatus;

    if(mail.onRead === false) {
      await LabelsService.addLabelCountBadgeByOne(userId, mail.labelName); // Increment count for the new label
    }

    mail.save(); // Save the changes to the mail
  }
}

const UpdateMailsToEditLabel = async (userId, oldLabelName, newLabelName) => {
  await Mail.updateMany(
    { userId: userId, labelName: oldLabelName },
    { $set: { labelName: newLabelName } }
  );
};

// Export all controller functions for external use
module.exports = {
  get50Mails,
  createMail,
  getMailById,
  deleteMail,
  updateMail,
  searchQueryInMails,
  UpdateMailsToEditLabel,
  getMailStatus,
  getRecivers,
  removeMailsFromLabel
};

/************************** BlackList Helper Functions ************************/  

/**
 * Scans one or more text fields for suspicious links.
 * Checks each link against the blacklist server.
 * Returns the label "Spam" if any link is blacklisted,
 * otherwise returns "Received".
 */
async function isSpamMail(...texts) {
  const suspiciousUrlRegex = /(?:^|\s)(?:(?:file:\/\/\/?|(?:[a-zA-Z][a-zA-Z0-9+.-]):\/\/)?(?:localhost|(?:\d{1,3}\.){3}\d{1,3}|(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(?::\d+)?(?:\/\S)?)(?=\s|$)/gi;
  const extractLinks = (text) => {
    if (!text) return [];
    return [...text.matchAll(suspiciousUrlRegex)].map(match => match[0]);
  };

  const links = texts.flatMap(extractLinks);

  for (const link of links) {
    const blStatus = await isInBlacklist(link);
    if (blStatus) {
      return 'Spam'; // Return 'Spam' if any link is blacklisted
    }
  }

  return 'Received'; // Return 'Received' if no links are blacklisted
}

/**
 * Checks a single URL against the blacklist server.
 * Returns true if blacklisted, false if not, undefined if invalid.
 */
async function isInBlacklist(url) {
  const serverResponse = await BlacklistService.operationOnBlacklist('GET', url);

  const resultLine = serverResponse.split('\n\n');
  if (resultLine[0] === "200 Ok") {
    if (resultLine[1] === "true true") {
      return true;
    } else {
      return false;
    }
  } else {
    return undefined; // Invalid URL or request
  }
}

