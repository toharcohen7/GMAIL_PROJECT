const Labels = require('../models/labels')
const Users = require('../models/users');
const Mails = require('../models/mails');

/**
 * Returns all label names for the current user.
 * Requires user-id header for authentication.
 */
exports.getLabels = (req, res) => {

    // Check for extra fields in the request body
    if (isThereExtraFields(req, [])) {
        return res.status(400).json({ error: 'No extra fields allowed' });
    }

    const userId = getUserIdFromHeaders(req, res);
    if (userId === undefined) {
      return res; // Error response already sent in helper function
    }

    const labels = Labels.getLabels(userId);
    const labelNames = labels.map(label => label.name);
    res.json(labelNames);
}
/**
 * Creates a new label for the current user.
 * Validates that a name is provided and does not already exist.
 */
exports.createLabel = (req, res) => {

    // Check for extra fields in the request body
    if (isThereExtraFields(req, ['name'])) {
        return res.status(400).json({ error: 'Only name field is allowed' });
    }

    const userId = getUserIdFromHeaders(req, res);
    if (userId === undefined) {
      return res; // Error response already sent in helper function
    }

    const { name } = req.body;
    if (!name){
         return res.status(400).json({ error: 'Label name is required' });
    }

    if (labelNameExists(userId, name)) {
      return res.status(409).json({ error: 'Another label with this name already exists' });
    }

    const newLabel = Labels.createLabel(userId,name);
    res.status(201).location(`/api/labels/${newLabel.id}`).end();
}
/**
 * Retrieves a specific label by ID for the current user.
 * Returns only the label name.
 */
exports.getLabelById = (req, res) => {

    // Check for extra fields in the request body
    if (isThereExtraFields(req, [])) {
        return res.status(400).json({ error: 'No extra fields allowed' });
    }

    const userId = getUserIdFromHeaders(req, res);
    if (userId === undefined) {
      return res; // Error response already sent in helper function
    }

    const labelId = getLabelFromParams(req, res, userId);
    if (labelId === undefined) {
      return res; // Error response already sent in helper function
    }

    res.json(Labels.getLabelById(userId, labelId).name);
}
/**
 * Deletes a label by its ID for the current user.
 * Does not affect any other users.
 */
exports.deleteLabel = (req,res) => {

    // Check for extra fields in the request body
    if (isThereExtraFields(req, [])) {
        return res.status(400).json({ error: 'No extra fields allowed' });
    }

    const userId = getUserIdFromHeaders(req, res);
    if (userId === undefined) {
      return res; // Error response already sent in helper function
    }

    const labelId = getLabelFromParams(req, res, userId);
    if (labelId === undefined) {
      return res; // Error response already sent in helper function
    }

    if (isProtectedLabel(labelId)) {
        return res.status(400).json({ error: 'Cannot delete protected label' });
    }

    Mails.removeMailsFromLable(userId, labelId); // Remove label from all mails
    Labels.deleteLabel(userId,labelId);
    return res.status(204).end();
}
/**
 * Updates the name of an existing label for the current user.
 * Checks that the new name is unique and valid.
 */
exports.updateLabel = (req, res) => {

    // Check for extra fields in the request body
    if (isThereExtraFields(req, ['name'])) {
        return res.status(400).json({ error: 'Only name field is allowed' });
    }

    const userId = getUserIdFromHeaders(req, res);
    if (userId === undefined) {
      return res; // Error response already sent in helper function
    }

    const labelId = getLabelFromParams(req, res, userId);
    if (labelId === undefined) {
      return res; // Error response already sent in helper function
    }

    // Check if the label is in the request body
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Label name is required' });
    }

    // Check if the label is protected (Sent, Inbox, Draft)
    if (isProtectedLabel(labelId)) {
      return res.status(400).json({ error: 'Cannot update protected label' });
    }  

    // Check if the new label name already exists for this user
    if (labelNameExists(userId, name)) {
      return res.status(409).json({ error: 'Another label with this name already exists' });
    }

    Labels.updateLabel(userId, labelId, { name });
    return res.status(204).end();
}
//
// ─── Helper Functions ───────────────────────────────────────────────────────────
//

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

function getLabelFromParams(req, res, userId) {
  const labelId = parseInt(req.params.id);
  if (isNaN(labelId)) {
    res.status(400).json({ error: 'Invalid label ID' });
    return undefined;
  }

  if (Labels.getLabelById(userId, labelId) === null) {
    res.status(404).json({ error: 'Label not found' });
    return undefined;
  }

  return labelId;
}

// Check if label is system-protected (Sent or Inbox)
const isProtectedLabel = (labelId) => {
  return labelId === 0 || labelId === 1 || labelId === 2;
};

// Check if label name already exists
const labelNameExists = (userId, name) => {
  return Labels.getLabels(userId).some(label => label.name === name);
};

// Check for extra fields in the request body
function isThereExtraFields(req, expectedKeys) {

  if (!req.body || typeof req.body !== 'object') {
    return false; // No body or not an object, no extra fields to check
  }

  const receivedKeys = Object.keys(req.body);
  const extraKeys = receivedKeys.filter(key => !expectedKeys.includes(key));

  return extraKeys.length > 0 ? true : false
}