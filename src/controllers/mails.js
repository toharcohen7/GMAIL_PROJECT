const Mails = require('../models/mails')
const Users = require('../models/users');
const Labels = require('../models/labels');

/**
 * Returns the all mails of the current user.
 * Sorted by timestamp descending. Only relevant fields are returned.
 */
exports.getUserMails = (req, res) => {

  if (isThereExtraFields(req, [])) {
    return res.status(400).json({ error: 'No extra fields allowed' });
  }

  const userId = getUserIdFromHeaders(req, res);
  if (userId === undefined) {
    return res; // Error response already sent in helper function
  }

  // Retrieve all mails of the user
  const mails = Mails.getUserMails(userId);

  // Map each mail to return only necessary fields
  const filtered = mails.map(mail => {
    const { id,
            mailStatus, 
            labelName,
            senderId, 
            receiversNames, 
            subject, 
            content, 
            onRead,
            formattedTime, 
            timestamp } = mail;

    return { id, 
             mailStatus, 
             labelName, 
             senderId, 
             receiversNames, 
             subject, 
             content, 
             onRead,
             time: formattedTime,
             timestamp };
  });

  res.json(filtered);
}

/**
 * Creates a new mail.
 * Validates fields, checks for blacklisted links, and stores the mail for sender and receiver.
 */
exports.createMail = (req, res) => {

  if (isThereExtraFields(req, [])) {
    return res.status(400).json({ error: 'No extra fields allowed' });
  }

  const userId = getUserIdFromHeaders(req, res);
  if (userId === undefined) {
    return res; // Error response already sent in helper function
  }

  // Create new draft mail for the user
  const newMail = Mails.createMail(userId);  

  res.status(201).json(newMail).end();
}

/**
 * Retrieves a specific mail by its ID for the current user.
 * Only returns relevant fields.
 */
exports.getMailById = (req, res) => {

  if (isThereExtraFields(req, [])) {
    return res.status(400).json({ error: 'No extra fields allowed' });
  }

  const userId = getUserIdFromHeaders(req, res);
  if (userId === undefined) {
    return res; // Error response already sent in helper function
  }

  const mailId = getMailIdFromParams(req, res, userId);
  if (mailId === undefined) {
    return res; // Error response already sent in helper function
  }

  const mail = Mails.getMailById(userId, mailId);
  const { id, mailStatus, senderId, receiversNames, subject, content, onRead, formattedTime } = mail;
  let labelName = Labels.getLabelByName(userId, mail.labelName).name;

  res.json({ id, mailStatus, labelName, senderId, receiversNames, subject, content, onRead, time: formattedTime });
}

/**
 * Deletes a specific mail from the user's sent or received list.
 * Does not affect the other party.
 */
exports.deleteMail = (req, res) => {

  if (isThereExtraFields(req, [])) {
    return res.status(400).json({ error: 'No extra fields allowed' });
  }

  const userId = getUserIdFromHeaders(req, res);
  if (userId === undefined) {
    return res; // Error response already sent in helper function
  }
  
  const mailId = getMailIdFromParams(req, res, userId);
  if (mailId === undefined) {
    return res; // Error response already sent in helper function
  }

  // Perform delete operation
  Mails.deleteMail(userId, mailId);

  return res.status(204).end();
}

/**
 * Updates a mail's subject/content or label.
 * Only allowed if the user is the sender.
 * Checks for blacklisted links before updating.
 * If the mail is a draft, it can be updated freely.
 * If the mail is sent, only the label can be changed.
 * If the label is changed to Sent, it must have receivers.
 */
exports.updateMail = async (req, res) => {
  const updates = req.body;

  const userId = getUserIdFromHeaders(req, res);
  if (userId === undefined) {
    return res; // Error response already sent in helper function
  }

  const mailId = getMailIdFromParams(req, res, userId);
  if (mailId === undefined) {
    return res; // Error response already sent in helper function
  }

  // Check if the mail is still a draft
  if (Mails.getMailStatus(userId, mailId) === 'Draft') {
    return changeDraftMail(userId, mailId, updates, req, res);
  } else {
    return changeUnDraftedMail(userId, mailId, updates, req, res);
  }
};

// Update label for a non-draft mail
async function changeUnDraftedMail(userId, mailId, updates, req, res) {

  // Validate no extra fields in request body
  if(isThereExtraFields(req, ['labelName', 'onRead'])) {
    return res.status(400).json({ error: 'Only the label can be changed in already sent mails' });
  } 

  if (updates.labelName === undefined && updates.onRead === undefined) {
    return res.status(400).json({ error: 'labelName or onRead is required' });
  }
  if(updates.labelName !== undefined){

    if (!Labels.getLabelByName(userId, updates.labelName)) {
      return res.status(404).json({ error: 'Label not found' });
    }   
    if ('Draft' === updates.labelName) {
      return res.status(400).json({ error: 'Cannot change label to Draft' });
    }   
    if ('Sent' === updates.labelName && Mails.getMailStatus(userId, mailId) !== 'Sent') {
      return res.status(400).json({ error: 'Cannot change the label of a received mail to Sent' });
    }   
    if ('Received' === updates.labelName && Mails.getMailStatus(userId, mailId) !== 'Received') {
      return res.status(400).json({ error: 'Cannot change the label of a sent mail to Received' });
    }
  }

  await Mails.updateMail(userId, mailId, updates);
  return res.status(204).end();
}

// Updates content of a draft mail
async function changeDraftMail(userId, mailId, updates, req, res) {

  // Validate no extra fields in request body
  if(isThereExtraFields(req, ['subject', 'content', 'receiversNames', 'labelName'])) {
    return res.status(400).json({ error: 'Only subject, content, receiversNames, and labelName can be changed' });
  } 

  if (!updates.subject && !updates.content && !updates.receiversNames && !updates.labelName) {
    return res.status(400).json({ error: 'At least one field must be provided' });
  }

  // Prevent changing label to non-Sent for drafts
  if (updates.labelName !== undefined && updates.labelName !== 'Sent') {
    return res.status(400).json({ error: 'Cannot change the label of an unsent mail' });
  }

  // Validate receiversNames if provided
  if (updates.receiversNames !== undefined) {
    if (!Array.isArray(updates.receiversNames)) {
      return res.status(400).json({ error: 'receiversNames must be an array' });
    }

    if (updates.labelName === 'Sent') {

      // Check if all provided receiversNames are valid users
      let notFoundArr = [];

      for (const receiverName of updates.receiversNames) {
        if (!isReceiversNameUser(receiverName) && !notFoundArr.includes(receiverName)) {
          notFoundArr.push(receiverName);
        }
      }

      if (notFoundArr.length > 0) {
        return res.status(404).json({ error: `Receiver(s) ${notFoundArr.join(", ")} not found` });
      }
    }
  }

  // If sending, validate that there are receivers
  let recivers = (updates.receiversNames !== undefined) ? updates.receiversNames : Mails.getRecivers(userId, mailId);
  if (recivers.length === 0 && updates.labelName === 'Sent') {
    return res.status(400).json({ error: 'Cannot send mail without a receiver' });
  }

  // Update the draft mail
  const updatedMail = await Mails.updateMail(userId, mailId, updates);
  if (updatedMail === undefined) {
    return res.status(404).json({ error: 'Unable to update Mail' });
  }

  return res.status(200).end();
}

/**
 * Searches for a query string in both subject and content
 * of all sent and received mails of the current user.
 */
exports.searchQueryInMails = (req, res) => {

  if(isThereExtraFields(req, [])) {
    return res.status(400).json({ error: 'No extra fields allowed' });
  }

  const userId = getUserIdFromHeaders(req, res);
  if (userId === undefined) {
    return res; // Error response already sent in helper function
  }

  const query = req.params.query;
  if (!query) {
    return res.status(400).json({ error: 'query is required' });
  }

  return res.status(200).json(Mails.searchQueryInMails(userId, query));
}

// ─── Helper Functions ───────────────────────────────────────────────────────────

// Validates if a given receiver ID belongs to a user
function isReceiversNameUser(receiverName) {
  return Users.getIdFromUserName(receiverName) !== undefined;
}

// Extracts and validates the user ID from request headers
function getUserIdFromHeaders(req, res) {
  const userId = parseInt(req.headers['user-id']);
  if (!userId) {
    res.status(400).json({ error: 'Missing user-id header' });
    return undefined;
  }

  if (Users.getUser(userId) === undefined) {
    res.status(404).json({ error: 'User not found' });
    return undefined;
  }

  return userId;
}

// Extracts and validates the mail ID from request parameters
function getMailIdFromParams(req, res, userId) {
  const mailId = parseInt(req.params.id);
  if (!mailId) {
    res.status(400).json({ error: 'mail-id must be provided' });
    return undefined;
  }

  const mail = Mails.getMailById(userId, mailId);
  if (!mail) {
    res.status(404).json({ error: 'Mail not found' });
    return undefined;
  }

  return mailId;
}

// Checks if there are any extra fields in the request body
function isThereExtraFields(req, expectedKeys) {

  if (!req.body || typeof req.body !== 'object') {
    return false; // No body or not an object, no extra fields to check
  }

  const receivedKeys = Object.keys(req.body);
  const extraKeys = receivedKeys.filter(key => !expectedKeys.includes(key));

  return extraKeys.length > 0 ? true : false
}
