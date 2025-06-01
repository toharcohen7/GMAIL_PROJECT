let mailIdCounter = 0 // Global counter for mail IDs
const userMails = new Map(); // Stores each user's sent and received mails separately


/**
 * Returns the last 50 mails sent or received by a specific user,
 * sorted from newest to oldest based on timestamp.
 */
const getLast50Mails = (userId) => {
  const userData = userMails.get(userId);
  if (!userData) return [];

  return [...userData.sent, ...userData.received]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 50);
};

/**
 * Creates a new mail and adds it to the sender's 'sent' array
 * and the receiver's 'received' array.
 */
const createMail = (senderId, receiverId, subject, content) => {
  const now = new Date();
  receiverId = Number(receiverId);
  
  const timestamp = now.getTime(); // for sorting 
  const formattedTime = now.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  if (!userMails.has(senderId)) {
    userMails.set(senderId, { sent: [], received: [] });
  }

  if (!userMails.has(receiverId)) {
    userMails.set(receiverId, { sent: [], received: [] });
  }

  const mailId = ++mailIdCounter;

  const newMailForSender = {
    id: mailId,
    senderId,
    receiverId,
    subject,
    content,
    labelId: 0, // Sent
    timestamp,
    formattedTime
  };

  const newMailForReceiver = {
    id: mailId,
    senderId,
    receiverId,
    subject,
    content,
    labelId: 1, // Inbox
    timestamp,
    formattedTime
  };

  userMails.get(senderId).sent.push(newMailForSender);
  userMails.get(receiverId).received.push(newMailForReceiver);

  return newMailForSender;
};


/**
 * Retrieves a specific mail by its ID from a user's sent or received mails.
 */
const getMailById = (userId, mailId) => {
  const userData = userMails.get(userId);
  if (!userData) return undefined;

  return (
    userData.sent.find(mail => mail.id === mailId) ||
    userData.received.find(mail => mail.id === mailId)
  );
};


/**
 * Deletes a specific mail (by ID) from a user's sent or received list.
 * Only removes it from the current user's view — not from the other party.
 */
const deleteMail = (userId, mailId) => {
    const index = userMails.get(userId).sent.findIndex(mail => mail.id === mailId);
    if (index !== -1) 
        userMails.get(userId).sent.splice(index, 1);
    else { 
        const index = userMails.get(userId).received.findIndex(mail => mail.id === mailId);
        if(index !== -1)
           userMails.get(userId).received.splice(index, 1);
    }
    
}

/**
 * Allows updating the subject and/or content fields of a mail.
 * Only the sender can update a mail, and updates reflect on both sender and receiver.
 */
const updateMail = (userId, mailId, updates) => {
  const senderMails = userMails.get(userId)?.sent || []; 
  const mailInSent = senderMails.find(mail => mail.id === mailId);

  if (!mailInSent || mailInSent.senderId !== userId) {
       return undefined; // if the user is not the sender or mail doesnt exist
  }

  const receiverId = mailInSent.receiverId;
  const receiverMails = userMails.get(receiverId)?.received || [];
  const mailInReceived = receiverMails.find(mail => mail.id === mailId);

  if (updates.subject !== undefined) {
    mailInSent.subject = updates.subject;
    if (mailInReceived) mailInReceived.subject = updates.subject;
  }

  if (updates.content !== undefined) {
    mailInSent.content = updates.content;
    if (mailInReceived) mailInReceived.content = updates.content;
  }

  return mailInSent;
};

/**
 * Searches for a given query string in the subject or content
 * of both sent and received mails of a user.
 */
const searchQueryInMails = (userId, query) => {
  const userData = userMails.get(userId);
  if (!userData) return [];

  const matchedSent = userData.sent.filter(mail =>
    mail.subject.includes(query) || mail.content.includes(query)
  );

  const matchedRecived = userData.received.filter(mail =>
    mail.subject.includes(query) || mail.content.includes(query)
  );

  return matchedSent.concat(matchedRecived);
};


module.exports = {
    getLast50Mails,
    createMail,
    getMailById,
    deleteMail,
    updateMail,
    searchQueryInMails
}