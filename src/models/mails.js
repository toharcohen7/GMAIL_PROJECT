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
 * Initializes with empty subject, content, no receivers, and labelId 0 (Draft).
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
    hour12: false
  });

  // Mail object for the sender
  const newMailForSender = {
    id: ++mailIdCounter,
    mailStatus: 'Draft',
    senderId: senderId,
    receiversId: [],
    subject: '',       // Empty by default
    content: '',       // Empty by default
    labelId: 0,        // Draft
    timestamp: timestamp,
    formattedTime: formattedTime
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

  // Update timestamp to reflect the update
  mail.timestamp = new Date().getTime();
  mail.formattedTime = new Date(mail.timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  // If label is being changed (e.g., sending), process accordingly
  if (updates.labelId !== undefined) {
    // If changing from draft to sent, create mail copies for receivers
    if (mail.labelId === 0 && updates.labelId === 1) {
      sendMail(mail.receiversId, mail);
    }
    mail.labelId = updates.labelId;
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
const sendMail = (receiversId, mail) => {
  mail.mailStatus = 'Sent';     // Mark as sent
  mail.labelId = 1;             // Set label to "Sent"

  // Create a mail copy for the receivers
  const newMailForReceivers = {
    id: ++mailIdCounter,
    mailStatus: 'Received',
    senderId: mail.senderId,
    receiversId: mail.receiversId,
    subject: mail.subject,
    content: mail.content,
    labelId: 2, // Received
    timestamp: mail.timestamp,
    formattedTime: mail.formattedTime
  };

  // Add mail to each receiver's mailbox
  for (const receiverId of receiversId) {
    if (!userMails.has(receiverId)) {
      throw new Error(`Receiver with ID ${receiverId} does not exist`);
    }
    userMails.get(receiverId).push(newMailForReceivers);
  }
};

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
  getRecivers
};