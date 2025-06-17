const Blacklist = require('../models/blacklist');
const Labels = require('../models/labels');

let mailIdCounter = 0; // Global counter for unique mail IDs
const userMails = new Map(); // Map that stores each user's mails as an array (sent/received)

/**
 * Returns the last 50 mails sent or received by a specific user,
 * sorted from newest to oldest based on timestamp.
 */
const getLast50Mails = (userId) => {
  const mails = userMails.get(userId).filter(mail => mail.mailStatus !== 'Draft'); // Exclude drafts
  return mails.sort((a, b) => b.timestamp - a.timestamp).slice(0, 50); // Sort and return latest 50
};

/**
 * Creates a new draft mail for a sender.
 * Initializes with empty subject, content, no receivers, and labelName as Draft.
 */
const createMail = (senderId) => {
  const now = new Date();
  const timestamp = now.getTime(); // Used for sorting
  const formattedTime = now.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jerusalem'
  });

  // Mail object for the sender
  const newMailForSender = {
    id: ++mailIdCounter,
    mailStatus: 'Draft',
    senderId: senderId,
    receiversId: [],
    subject: '',       // Empty by default
    content: '',       // Empty by default
    labelName: 'Draft',        // Draft
    timestamp: timestamp,
    formattedTime: formattedTime,
    onRead: true // Sender's draft is considered read
  };

  userMails.get(senderId).push(newMailForSender); // Add to sender's mail list

  return newMailForSender;
};

/**
 * Retrieves a specific mail by its ID from a user's mail list.
 */
const getMailById = (userId, mailId) => {
  return userMails.get(userId).find(mail => mail.id === mailId);
};

/**
 * Deletes a specific mail (by ID) from a user's mail list.
 * Only affects that user's view of the mail.
 */
const deleteMail = (userId, mailId) => {
  const index = userMails.get(userId).findIndex(mail => mail.id === mailId);
  if (index !== -1) {
    userMails.get(userId).splice(index, 1); // Remove mail from array

    // If the mail was unread, decrement the label count
    if (userMails.get(userId)[index].onRead === false) {
      Labels.decreaseLabelCountBadgeByOne(userId, userMails.get(userId)[index].labelName);
    }
  } else {
    return undefined; // Mail not found for that user
  }
};

/**
 * Updates fields (subject, content, receivers, label) of a mail.
 * Only allowed for the sender. Updates apply to sender's mail,
 * and may create copies for receivers if the mail is sent.
 */
const updateMail = (userId, mailId, updates) => {
  const mail = getMailById(userId, mailId);
  if (!mail) return undefined;

  // Update subject/content if provided
  if (updates.subject !== undefined) {
    mail.subject = updates.subject;
  }
  if (updates.content !== undefined) {
    mail.content = updates.content;
  }

  // Update receivers list if provided
  if (updates.receiversId !== undefined) {
    mail.receiversId = updates.receiversId;
  }

  if (updates.onRead !== undefined) {

    if(mail.onRead === false && updates.onRead === true) {
      // If mail was unread and now marked as read, update label count
      Labels.decreaseLabelCountBadgeByOne(userId, mail.labelName);
    }

    // If mail was read and now marked as unread, increment label count
    if(mail.onRead === true && updates.onRead === false) {
      Labels.addLabelCountBadgeByOne(userId, mail.labelName);
    }

    // Update the read status of the mail
    mail.onRead = updates.onRead; // Update read status
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
      sendMail(mail.receiversId, mail);
    }
    mail.labelName = updates.labelName;
  }

  return mail;
};

/**
 * Searches for a given query string in both subject and content fields
 * for all mails of a given user.
 */
const searchQueryInMails = (userId, query) => {
  return userMails.get(userId).filter(mail =>
    mail.subject.includes(query) || mail.content.includes(query)
  );
};

/**
 * Initializes an empty mail array for a user.
 * Should be called when a new user is registered.
 */
const initMailsForUser = (userId) => {
  userMails.set(userId, []);
};

/**
 * Returns the status (Draft/Sent/Received) of a specific mail.
 * Throws an error if the mail doesn't exist for the user.
 */
const getMailStatus = (userId, mailId) => {
  const mail = userMails.get(userId).find(mail => mail.id === mailId);
  if (!mail) {
    throw new Error(`Mail with ID ${mailId} does not exist for user ${userId}`);
  }
  return mail.mailStatus;
};

/**
 * Returns the receivers of a given mail.
 */
const getRecivers = (userId, mailId) => {
  const mail = userMails.get(userId).find(mail => mail.id === mailId);
  return mail.receiversId;
};

/**
 * Marks a mail as "Sent" and creates a copy for each receiver.
 * The original remains with the sender, new instances are added to each receiver.
 */
const sendMail = async (receiversId, mail) => {
  mail.mailStatus = 'Sent';     // Mark as sent
  mail.labelName = 'Sent';     // Set label to "Sent"

  // Check for blacklisted links
  const receiverMailLabel = await isSpamMail(mail.subject, mail.content);

  // Create a mail copy for the receivers
  const newMailForReceivers = {
    id: ++mailIdCounter,
    mailStatus: 'Received',
    senderId: mail.senderId,
    receiversId: mail.receiversId,
    subject: mail.subject,
    content: mail.content,
    labelName: receiverMailLabel, 
    timestamp: mail.timestamp,
    formattedTime: mail.formattedTime,
    onRead: false // New mails are unread by default
  };

  // Add mail to each receiver's mailbox
  for (const receiverId of receiversId) {
    if (!userMails.has(receiverId)) {
      throw new Error(`Receiver with ID ${receiverId} does not exist`);
    }
    userMails.get(receiverId).push(newMailForReceivers);
    Labels.addLabelCountBadgeByOne(receiverId, receiverMailLabel); // Increment Received label count
  }
};

function removeMailsFromLable(userId, labelName) {
  // Remove all mails with the specified labelName from the user's mail list
  const mails = userMails.get(userId);
  
  for ( const mail of mails) {
    if (mail.labelName !== labelName) 
      continue; // Skip mails that do not have the specified label

    mail.labelName = mail.mailStatus; // Reset label to mail status (Draft/Sent/Received)
    if(mail.onRead === false) {
      Labels.decreaseLabelCountBadgeByOne(userId, mail.labelName); // Decrement the count badge for the label
    }
  }
}

// Export all controller functions for external use
module.exports = {
  getLast50Mails,
  createMail,
  getMailById,
  deleteMail,
  updateMail,
  searchQueryInMails,
  initMailsForUser,
  getMailStatus,
  getRecivers,
  removeMailsFromLable
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
  const serverResponse = await Blacklist.operationOnBlacklist('GET', url);

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

