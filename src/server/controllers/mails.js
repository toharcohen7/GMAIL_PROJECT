const Mails = require('../services/mails')
const Users = require('../services/users');
const Labels = require('../services/labels');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


/**
 * Returns the all mails of the current user.
 * Sorted by timestamp descending. Only relevant fields are returned.
 */
exports.get50Mails = async (req, res) => {

  if (isThereExtraFields(req, [])) {
    return res.status(400).json({ error: 'No extra fields allowed' });
  }

  const userId = await getUserIdFromHeaders(req, res);
  if (userId === undefined) {
    return res; // Error response already sent in helper function
  }

  // Validate and parse query parameters
  let offset = parseInt(req.query.offset) || 0; // Default to 0 if not provided
  if (req.query.offset && isNaN(req.query.offset)) {
    return res.status(400).json({ error: 'offset must be a number' });
  }

  let labelName = req.query.labelName || null; // Default to null if not provided
  if (labelName !== null) {
    labelName = String(labelName);
  }

  if (labelName && labelName !== 'Starred' && !(await Labels.getLabelByName(userId, labelName))) {
    return res.status(404).json({ error: 'Label not found' });
  }

  // Retrieve all mails of the user
  const mails = await Mails.get50Mails(userId, offset, labelName);

  // Map each mail to return only necessary fields
  const filtered = mails.map(mail => {
    const { _id,
            mailStatus, 
            labelName,
            senderId, 
            receiversNames, 
            subject, 
            content, 
            starred,
            onRead,
            formattedTime, 
            timestamp } = mail;

    return { id: _id.toString(), 
             mailStatus, 
             labelName, 
             senderId: senderId.toString(), 
             receiversNames, 
             subject, 
             content, 
             starred,
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
exports.createMail = async (req, res) => {

  if (isThereExtraFields(req, [])) {
    return res.status(400).json({ error: 'No extra fields allowed' });
  }

  const userId = await getUserIdFromHeaders(req, res);
  if (userId === undefined) {
    return res; // Error response already sent in helper function
  }

  // Create new draft mail for the user
  const newMail = await Mails.createMail(userId);  

  res.status(201).json(newMail).end();
}

/**
 * Retrieves a specific mail by its ID for the current user.
 * Only returns relevant fields.
 */
exports.getMailById = async (req, res) => {

  if (isThereExtraFields(req, [])) {
    return res.status(400).json({ error: 'No extra fields allowed' });
  }

  const userId = await getUserIdFromHeaders(req, res);
  if (userId === undefined) {
    return res; // Error response already sent in helper function
  }

  const mailId = await getMailIdFromParams(req, res, userId);
  if (mailId === undefined) {
    return res; // Error response already sent in helper function
  }

  const mail = await Mails.getMailById(userId, mailId);
  const { _id, mailStatus, senderId, receiversNames, subject, content, starred, onRead, formattedTime } = mail;
  const id = _id.toString();
  const senderIdStr = senderId.toString();

  const label = await Labels.getLabelByName(userId, mail.labelName);
  const labelName = label.name;

  res.json({ id, mailStatus, labelName, senderId: senderIdStr, receiversNames, subject, content, starred, onRead, time: formattedTime });
}

/**
 * Deletes a specific mail from the user's sent or received list.
 * Does not affect the other party.
 */
exports.deleteMail = async (req, res) => {

  if (isThereExtraFields(req, [])) {
    return res.status(400).json({ error: 'No extra fields allowed' });
  }

  const userId = await getUserIdFromHeaders(req, res);
  if (userId === undefined) {
    return res; // Error response already sent in helper function
  }
  
  const mailId = await getMailIdFromParams(req, res, userId);
  if (mailId === undefined) {
    return res; // Error response already sent in helper function
  }

  // Perform delete operation
  await Mails.deleteMail(userId, mailId);

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

  const userId = await getUserIdFromHeaders(req, res);
  if (userId === undefined) {
    return res; // Error response already sent in helper function
  }

  const mailId = await getMailIdFromParams(req, res, userId);
  if (mailId === undefined) {
    return res; // Error response already sent in helper function
  }

  // Check if the mail is still a draft
  if (await Mails.getMailStatus(userId, mailId) === 'Draft') {
    return await changeDraftMail(userId, mailId, updates, req, res);
  } else {
    return await changeUnDraftedMail(userId, mailId, updates, req, res);
  }
};

// Update label for a non-draft mail
async function changeUnDraftedMail(userId, mailId, updates, req, res) {

  // Validate no extra fields in request body
  if(isThereExtraFields(req, ['labelName', 'onRead', 'starred'])) {
    return res.status(400).json({ error: 'Only labelName, onRead, or starred can be changed in already sent mails' });
  } 

  if (updates.labelName === undefined && updates.onRead === undefined && updates.starred === undefined) {
    return res.status(400).json({ error: 'labelName, onRead, or starred is required' });
  }

  if(updates.labelName !== undefined){

    if ('Draft' === updates.labelName) {
      return res.status(400).json({ error: 'Cannot change label to Draft' });
    }   

    if (!(await Labels.getLabelByName(userId, updates.labelName))) {
      return res.status(404).json({ error: 'Label not found' });
    }   

    const mailStatus = await Mails.getMailStatus(userId, mailId);

    if ('Sent' === updates.labelName && mailStatus !== 'Sent') {
      return res.status(400).json({ error: 'Cannot change the label of a received mail to Sent' });
    }   
    if ('Received' === updates.labelName && mailStatus !== 'Received') {
      return res.status(400).json({ error: 'Cannot change the label of a sent mail to Received' });
    }

  }

  await Mails.updateMail(userId, mailId, updates);
  return res.status(204).end();
}

// Updates content of a draft mail
async function changeDraftMail(userId, mailId, updates, req, res) {

  // Validate no extra fields in request body
  if(isThereExtraFields(req, ['subject', 'content', 'receiversNames', 'labelName', 'starred'])) {
    return res.status(400).json({ error: 'Only subject, content, receiversNames, labelName, and starred can be changed' });
  }

  if (!updates.subject && !updates.content && !updates.receiversNames && !updates.labelName && updates.starred === undefined) {
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
        if (!await isReceiversNameUser(receiverName) && !notFoundArr.includes(receiverName)) {
          notFoundArr.push(receiverName);
        }
      }

      if (notFoundArr.length > 0) {
        return res.status(404).json({ error: `Receiver(s) ${notFoundArr.join(", ")} not found` });
      }
    }
  }

  // If sending, validate that there are receivers
  let recivers = (updates.receiversNames !== undefined) ? updates.receiversNames : 
                                                          await Mails.getRecivers(userId, mailId);
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
exports.searchQueryInMails = async (req, res) => {

  if(isThereExtraFields(req, [])) {
    return res.status(400).json({ error: 'No extra fields allowed' });
  }

  const userId = await getUserIdFromHeaders(req, res);
  if (userId === undefined) {
    return res; // Error response already sent in helper function
  }

  const query = req.params.query;
  if (!query) {
    return res.status(400).json({ error: 'query is required' });
  }

  return res.status(200).json(await Mails.searchQueryInMails(userId, query));
}

// ─── Helper Functions ───────────────────────────────────────────────────────────

// Validates if a given receiver ID belongs to a user
async function isReceiversNameUser(receiverName) {
  const userId = await Users.getIdFromUserName(receiverName);
  return userId !== undefined;
}

// Extracts and validates the user ID from request headers
async function getUserIdFromHeaders(req, res) {
  const userId = req.headers['user-id'];
  if (!userId) {
    res.status(400).json({ error: 'Missing or invalid user-id header'});
    console.log('Missing or invalid user-edwefwefwefew header:', userId);
    return undefined;
  }

  if (await Users.getUser(userId) === undefined) {
    res.status(404).json({ error: 'User not found' });
    return undefined;
  }

  return userId;
}

// Extracts and validates the mail ID from request parameters
async function getMailIdFromParams(req, res, userId) {
  const mailId = req.params.id;
  if (!mailId || !ObjectId.isValid(mailId)) {
    res.status(400).json({ error: 'mail-id must be provided' });
    return undefined;
  }

  const mail = await Mails.getMailById(userId, mailId);
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
