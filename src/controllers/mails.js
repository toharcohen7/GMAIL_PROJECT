const Mails = require('../models/mails')
const Blacklist = require('../models/blacklist');
const Users = require('../models/users');
/**
 * Returns the last 50 mails sent or received by the current user.
 * Sorted by timestamp descending. Only relevant fields are returned.
 */
exports.getLast50Mails = (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const mails = Mails.getLast50Mails(userId);
  const filtered = mails.map(mail =>
  {const { id, senderId, receiverId, subject, content, formattedTime } = mail;
  return {id, senderId, receiverId, subject, content, time: formattedTime};
});

res.json(filtered);
}
/**
 * Creates a new mail.
 * Validates fields, checks for blacklisted links, and stores the mail for sender and receiver.
 */
exports.createMail = async (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const requiredFields = ['receiverId', 'subject', 'content'];
  for (const field of requiredFields) { // checking if all required fields exists
      if (!req.body[field]) {
          return res.status(400).json({ error: `${field} is required` });
      }
  }

  if (!isReceiverIdUser(req.body.receiverId)) {
    return res.status(400).json({ error: 'the receiver does not exists'});
  }

  const {receiverId, subject, content } = req.body;

  const blacklistedLink = await checkForBlacklistedLinks(subject, content);
  if (blacklistedLink) {
    return res.status(400).json({ error: `Message contains blacklisted link: ${blacklistedLink}` });
  }

    // Create and store the new mail
    const newMail = Mails.createMail(userId, receiverId, subject, content);
    
    res.status(201).location(`/api/mails/${newMail.id}`).end();
}
/**
 * Retrieves a specific mail by its ID for the current user.
 * Only returns relevant fields.
 */
exports.getMailById = (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const mailId = requireMailId(req, res);
  if (!mailId) return;

  const mail = requireMail(res, userId, mailId);
  if (!mail) return;

  const { id, senderId, receiverId, subject, content, formattedTime } = mail;
  res.json({ id, senderId, receiverId, subject, content, time: formattedTime });
}
/**
 * Deletes a specific mail from the user's sent or received list.
 * Does not affect the other party.
 */
exports.deleteMail = (req,res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;
  
  const mailId = requireMailId(req, res);
  if (!mailId) return;
  
  const mail = requireMail(res, userId, mailId);
  if (!mail) return;
  
  Mails.deleteMail(userId, mailId);
  return res.status(204).end();
}
/**
 * Updates a mail's subject/content.
 * Only allowed if the user is the sender.
 * Checks for blacklisted links before updating.
 */
exports.updateMail = async (req, res) => {
  const updates = req.body;

  const userId = requireUserId(req, res);
  if (!userId) return;


  const mailId = requireMailId(req, res);
  if (!mailId) return;

  if (!updates.subject && !updates.content) {
    return res.status(400).json({ error: 'At least one field (subject or content) must be provided' });
  }

const blacklistedLink = await checkForBlacklistedLinks(updates.subject, updates.content);
if (blacklistedLink) {
  return res.status(400).json({ error: `Update blocked due to blacklisted link: ${blacklistedLink}` });
}

const mail = Mails.updateMail(userId, mailId, updates);
if (mail === undefined) {
  return res.status(404).json({ error: 'Mail not found' });
}

return res.status(204).end();
};
/**
 * Searches for a query string in both subject and content
 * of all sent and received mails of the current user.
 */
exports.searchQueryInMails = (req, res) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const query = req.params.query;
  if(!query){
      return res.status(400).json({ error: 'query is required' });
  }
  
  const results = Mails.searchQueryInMails(userId, query); 
  res.json(results);
}
//
// ─── Helper Functions ───────────────────────────────────────────────────────────
//
/**
 * Extracts and validates userId from the request header.
 * Sends 401 if missing.
 */
const requireUserId = (req, res) => {
  const userId = parseInt(req.headers['user-id']);
  if (!userId) {
    res.status(401).json({ error: 'Missing user-id header' });
    return null;
  }
  return userId;
};
/**
 * Extracts and validates mailId from the request parameters.
 * Sends 400 if missing or invalid.
 */
const requireMailId = (req, res) => {
  const mailId = parseInt(req.params.id);
  if (!mailId) {
    res.status(400).json({ error: 'mail-id must be provided' });
    return null;
  }
  return mailId;
};
/**
 * Fetches a mail by user and ID.
 * Sends 404 if not found.
 */
const requireMail = (res, userId, labelId) => {
  const mail = Mails.getMailById(userId, labelId);
  if (!mail) {
    res.status(404).json({ error: 'Mail not found' });
    return null;
  }
  return mail;
};
/**
 * Scans one or more text fields for suspicious links.
 * Checks each link against the blacklist server.
 * Returns the first blacklisted link found, or null if safe.
 */
async function checkForBlacklistedLinks(...texts) {
  const suspiciousUrlRegex = /(?:^|\s)(?:(?:file:\/\/\/?|(?:[a-zA-Z][a-zA-Z0-9+.-]*):\/\/)?(?:localhost|(?:\d{1,3}\.){3}\d{1,3}|(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(?::\d+)?(?:\/\S*)?)(?=\s|$)/gi;
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

function isReceiverIdUser(receiverId) {
  const id = Number(receiverId);
  return Users.getUser(id);
}