const Mails = require('../models/mails')
const Blacklist = require('../models/blacklist');
const Users = require('../models/users');
const Labels = require('../models/labels');

/**
 * Returns the last 50 mails sent or received by the current user.
 * Sorted by timestamp descending. Only relevant fields are returned.
 */
exports.getLast50Mails = (req, res) => {
  const userId = parseInt(req.headers['user-id']);
  if (!userId) 
    return res.status(401).json({ error: 'Missing user-id header' });

  // Retrieve last 50 mails for the user
  const mails = Mails.getLast50Mails(userId);

  // Map each mail to return only necessary fields
  const filtered = mails.map(mail => {
    const { id, mailStatus, senderId, receiversId, subject, content, formattedTime } = mail;
    let labelName = Labels.getLabelById(userId, mail.labelId).name;

    return { id, mailStatus, labelName, senderId, receiversId, subject, content, time: formattedTime };
  });

  res.json(filtered);
}

/**
 * Creates a new mail.
 * Validates fields, checks for blacklisted links, and stores the mail for sender and receiver.
 */
exports.createMail = (req, res) => {
  const userId = parseInt(req.headers['user-id']);
  if (!userId) 
    return res.status(401).json({ error: 'Missing user-id header' });

  // Create new draft mail for the user
  const newMail = Mails.createMail(userId);   

  res.status(201).location(`/api/mails/${newMail.id}`).end();
}

/**
 * Retrieves a specific mail by its ID for the current user.
 * Only returns relevant fields.
 */
exports.getMailById = (req, res) => {
  const userId = parseInt(req.headers['user-id']);
  if (!userId) 
    return res.status(401).json({ error: 'Missing user-id header' });

  const mailId = parseInt(req.params.id);
  if (!mailId) 
    return res.status(400).json({ error: 'mail-id must be provided' });

  const mail = Mails.getMailById(userId, mailId);
  if (!mail) 
    return res.status(404).json({ error: 'Mail not found' });

  const { id, mailStatus, senderId, receiversId, subject, content, formattedTime } = mail;
  let labelName = Labels.getLabelById(userId, mail.labelId).name;

  res.json({ id, mailStatus, labelName, senderId, receiversId, subject, content, time: formattedTime });
}

/**
 * Deletes a specific mail from the user's sent or received list.
 * Does not affect the other party.
 */
exports.deleteMail = (req, res) => {
  const userId = parseInt(req.headers['user-id']);
  if (!userId) 
    return res.status(401).json({ error: 'Missing user-id header' });
  
  const mailId = parseInt(req.params.id);
  if (!mailId) 
    return res.status(400).json({ error: 'mail-id must be provided' });
  
  const mail = Mails.getMailById(userId, mailId);
  if (!mail) 
    return res.status(404).json({ error: 'Mail not found' });

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

  const userId = parseInt(req.headers['user-id']);
  if (!userId) 
    return res.status(401).json({ error: 'Missing user-id header' });

  if (Users.getUser(userId) === undefined) {
    return res.status(404).json({ error: 'User not found' });
  }

  const mailId = parseInt(req.params.id);
  if (!mailId) 
    return res.status(400).json({ error: 'mail-id must be provided' });

  const mail = Mails.getMailById(userId, mailId);
  if (!mail) {
    return res.status(404).json({ error: 'Mail not found' });
  }

  // Check if the mail is still a draft
  if (Mails.getMailStatus(userId, mailId) === 'Draft') {
    return changeDraftMail(userId, mailId, updates, res);
  } else {
    return changeLabel(userId, mailId, updates, res);
  }
};

// Update label for a non-draft mail
function changeLabel(userId, mailId, updates, res) {
  if (updates.labelId === undefined) {
    return res.status(400).json({ error: 'labelId is required' });
  }

  if (!Labels.getLabelById(userId, updates.labelId)) {
    return res.status(404).json({ error: 'Label not found' });
  }

  if (0 === updates.labelId) {
    return res.status(400).json({ error: 'Cannot change label to Draft' });
  }

  if (1 === updates.labelId && Mails.getMailStatus(userId, mailId) !== 'Sent') {
    return res.status(400).json({ error: 'Cannot change the label of a received mail to Sent' });
  }

  if (2 === updates.labelId && Mails.getMailStatus(userId, mailId) !== 'Received') {
    return res.status(400).json({ error: 'Cannot change the label of a sent mail to Received' });
  }

  Mails.updateMail(userId, mailId, { labelId: updates.labelId });
  return res.status(204).end();
}

// Updates content of a draft mail
async function changeDraftMail(userId, mailId, updates, res) {
  if (!updates.subject && !updates.content && !updates.receiversId && !updates.labelId) {
    return res.status(400).json({ error: 'At least one field must be provided' });
  }

  // Prevent changing label to non-Sent for drafts
  if (updates.labelId !== undefined && updates.labelId !== 1) {
    return res.status(400).json({ error: 'Cannot change the label of an unsent mail' });
  }

  // Validate receiversId if provided
  if (updates.receiversId !== undefined) {
    if (!Array.isArray(updates.receiversId)) {
      return res.status(400).json({ error: 'receiversId must be an array' });
    }

    // Check if all provided receiversId are valid users
    for (const receiverId of updates.receiversId) {
      if (!isreceiversIdUser(receiverId)) {
        return res.status(404).json({ error: `Receiver with ID ${receiverId} not found` });
      }
    }
  }

  // If sending, validate that there are receivers
  let recivers = (updates.receiversId !== undefined) ? updates.receiversId : Mails.getRecivers(userId, mailId);
  if (recivers.length === 0 && updates.labelId === 1) {
    return res.status(400).json({ error: 'Cannot send mail without a receiver' });
  }

  // Check for blacklisted links
  const blacklistedLink = await checkForBlacklistedLinks(updates.subject, updates.content);
  if (blacklistedLink) {
    return res.status(400).json({ error: `Update blocked due to blacklisted link: ${blacklistedLink}` });
  }

  // Update the draft mail
  const updatedMail = Mails.updateMail(userId, mailId, updates);
  if (updatedMail === undefined) {
    return res.status(404).json({ error: 'Unable to update Mail' });
  }

  return res.status(204).end();
}

/**
 * Searches for a query string in both subject and content
 * of all sent and received mails of the current user.
 */
exports.searchQueryInMails = (req, res) => {
  const userId = parseInt(req.headers['user-id']);
  if (!userId) 
    return res.status(401).json({ error: 'Missing user-id header' });

  const query = req.params.query;
  if (!query) {
    return res.status(400).json({ error: 'query is required' });
  }

  return res.status(200).json(Mails.searchQueryInMails(userId, query));
}

// ─── Helper Functions ───────────────────────────────────────────────────────────

/**
 * Scans one or more text fields for suspicious links.
 * Checks each link against the blacklist server.
 * Returns the first blacklisted link found, or null if safe.
 */
async function checkForBlacklistedLinks(...texts) {
  const suspiciousUrlRegex = /(?:^|\s)(?:(?:file:\/\/\/?|(?:[a-zA-Z][a-zA-Z0-9+.-]):\/\/)?(?:localhost|(?:\d{1,3}\.){3}\d{1,3}|(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(?::\d+)?(?:\/\S)?)(?=\s|$)/gi;
  const extractLinks = (text) => {
    if (!text) return [];
    return [...text.matchAll(suspiciousUrlRegex)].map(match => match[0]);
  };

  const links = texts.flatMap(extractLinks);

  for (const link of links) {
    const blStatus = await isInBlacklist(link);
    if (blStatus) {
      return link;
    }
  }

  return null;
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

// Validates if a given receiver ID belongs to a user
function isreceiversIdUser(receiversId) {
  const id = Number(receiversId);
  return Users.getUser(id);
}