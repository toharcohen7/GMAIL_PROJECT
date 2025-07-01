const Labels = require('../services/labels')
const Users = require('../services/users');
const Mails = require('../services/mails');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


/**
 * Returns all label names for the current user.
 * Requires user-id header for authentication.
 */
exports.getLabels = async (req, res) => {

    // Check for extra fields in the request body
    if (isThereExtraFields(req, [])) {
        return res.status(400).json({ error: 'No extra fields allowed' });
    }

    const userId = await getUserIdFromHeaders(req, res);
    if (userId === undefined) {
      return res; // Error response already sent in helper function
    }

    const labels = await Labels.getLabels(userId);
    const labelData = labels.map(label => ({
      _id: label._id.toString(),
      name: label.name,
      iconClass: label.iconClass,
      countBadge: label.countBadge
    }));
    res.json(labelData);
}
/**
 * Creates a new label for the current user.
 * Validates that a name is provided and does not already exist.
 */
exports.createLabel = async (req, res) => {

    // Check for extra fields in the request body
    if (isThereExtraFields(req, ['name', 'iconClass'])) {
        return res.status(400).json({ error: 'Only name and iconClass field is allowed' });
    }

    const userId = await getUserIdFromHeaders(req, res);
    if (userId === undefined) {
      return res; // Error response already sent in helper function
    }

    const { name, iconClass } = req.body;
    if (!name || !iconClass) {
      return res.status(400).json({ error: 'Label name and icon is required' });
    }

    if (await labelNameExists(userId, name)) {
      return res.status(400).json({ error: 'Another label with this name already exists' });
    }

    const newLabel = await Labels.createLabel(userId, name, iconClass);
    return res.status(201).json({
      _id: newLabel._id.toString(),
      userId: newLabel.userId.toString(),
      name: newLabel.name,
      iconClass: newLabel.iconClass
    }).end();
}

/**
 * Retrieves a specific label by ID for the current user.
 * Returns only the label name.
 */
exports.getLabelByName = async (req, res) => {

  // Check for extra fields in the request body
  if (isThereExtraFields(req, [])) {
      return res.status(400).json({ error: 'No extra fields allowed' });
  }

  const userId = await getUserIdFromHeaders(req, res);
  if (userId === undefined) {
    return res; // Error response already sent in helper function
  }

  const labelName = await getLabelFromParams(req, res, userId);
  if (labelName === undefined) {
    return res; // Error response already sent in helper function
  }

  const label = await Labels.getLabelByName(userId, labelName);
  res.json(label.name);
}
/**
 * Deletes a label by its ID for the current user.
 * Does not affect any other users.
 */
exports.deleteLabel = async (req,res) => {

    // Check for extra fields in the request body
    if (isThereExtraFields(req, [])) {
        return res.status(400).json({ error: 'No extra fields allowed' });
    }

    const userId = await getUserIdFromHeaders(req, res);
    if (userId === undefined) {
      return res; // Error response already sent in helper function
    }

    const labelName = await getLabelFromParams(req, res, userId);
    if (labelName === undefined) {
      return res; // Error response already sent in helper function
    }

    if (isProtectedLabel(labelName)) {
        return res.status(400).json({ error: 'Cannot delete protected label' });
    }

    await Mails.removeMailsFromLabel(userId, labelName); // Remove label from all mails
    await Labels.deleteLabel(userId, labelName);
    return res.status(204).end();
}
/**
 * Updates the name of an existing label for the current user.
 * Checks that the new name is unique and valid.
 */
exports.updateLabel = async (req, res) => {

    // Check for extra fields in the request body
    if (isThereExtraFields(req, ['name'])) {
        return res.status(400).json({ error: 'Only name field is allowed' });
    }

    const userId = await getUserIdFromHeaders(req, res);
    if (userId === undefined) {
      return res; // Error response already sent in helper function
    }

    const labelName = await getLabelFromParams(req, res, userId);
    if (labelName === undefined) {
      return res; // Error response already sent in helper function
    }

    // Check if the label is in the request body
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Label name is required' });
    }

    // Check if the label is protected (Sent, Inbox, Draft)
    if (isProtectedLabel(labelName)) {
      return res.status(400).json({ error: 'Cannot update protected label' });
    }  

    // Check if the new label name already exists for this user
    if (await labelNameExists(userId, name)) {
      return res.status(409).json({ error: 'Another label with this name already exists' });
    }

    await Labels.updateLabel(userId, labelName, { name });
    return res.status(204).end();
}
//
// ─── Helper Functions ───────────────────────────────────────────────────────────
//

// Extracts and validates the user ID from request headers
async function getUserIdFromHeaders(req, res) {
  const userId = req.headers['user-id'];
  if (!userId || !ObjectId.isValid(userId)) {
    res.status(400).json({ error: 'Missing or invalid user-id header' });
    return undefined;
  }

  if (await Users.getUser(userId) === undefined) {
    res.status(404).json({ error: 'User not found' });
    return undefined;
  }

  return userId;
}

async function getLabelFromParams(req, res, userId) {
  const labelName = req.params.id;
  if (!labelName || typeof labelName !== 'string') {
    res.status(400).json({ error: 'Invalid label name' });
    return undefined;
  }

  if (!await Labels.getLabelByName(userId, labelName)) {
    res.status(404).json({ error: 'Label not found' });
    return undefined;
  }

  return labelName;
}

// Check if label is system-protected (Sent or Inbox)
const isProtectedLabel = (labelName) => {
  return labelName === 'Draft' || labelName === 'Sent' || labelName === 'Received' || labelName === 'Spam';
};

// Check if label name already exists
const labelNameExists = async (userId, name) => {
  const labels = await Labels.getLabels(userId);
  return labels.some(label => label.name === name);
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