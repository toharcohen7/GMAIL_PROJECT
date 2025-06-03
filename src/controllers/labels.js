const Labels = require('../models/labels')
/**
 * Returns all label names for the current user.
 * Requires user-id header for authentication.
 */
exports.getLabels = (req, res) => {
    const userId = requireUserId(req, res);
    if (!userId) return;

    const labels = Labels.getLabels(userId);
    const labelNames = labels.map(label => label.name);
    res.json(labelNames);
}
/**
 * Creates a new label for the current user.
 * Validates that a name is provided and does not already exist.
 */
exports.createLabel = (req, res) => {
    const userId = requireUserId(req, res);
    if (!userId) return;

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
    const labelId = parseInt(req.params.id);
    const userId = requireUserId(req, res);
    if (!userId) return;

    const label = requireLabel(res, userId, labelId);
    if (!label) return;
 
    res.json(label.name);
}
/**
 * Deletes a label by its ID for the current user.
 * Does not affect any other users.
 */
exports.deleteLabel = (req,res) => {
    const userId = requireUserId(req, res);
    if (!userId) return;

    const labelId = parseInt(req.params.id);

    if (isProtectedLabel(labelId)) {
        return res.status(400).json({ error: 'Cannot delete protected label' });
    }

    const label = requireLabel(res, userId, labelId);
    if (!label) return;
    
    Labels.deleteLabel(userId,labelId);
    return res.status(204).end();
}
/**
 * Updates the name of an existing label for the current user.
 * Checks that the new name is unique and valid.
 */
exports.updateLabel = (req, res) => {
    const userId = requireUserId(req, res);
    if(!userId) return

    const labelId = parseInt(req.params.id);
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Label name is required' });
    }

    if (isProtectedLabel(labelId)) {
      return res.status(400).json({ error: 'Cannot update protected label' });
    }  

    if (labelNameExists(userId, name)) {
      return res.status(409).json({ error: 'Another label with this name already exists' });
    }

    const label = requireLabel(res, userId, labelId);
    if (!label) return;

    Labels.updateLabel(userId, labelId, { name });
    return res.status(204).end();
}
//
// ─── Helper Functions ───────────────────────────────────────────────────────────
//

// Helper to extract and validate userId
const requireUserId = (req, res) => {
  const userId = parseInt(req.headers['user-id']);
  if (!userId) {
    res.status(401).json({ error: 'Missing user-id header' });
    return null;
  }
  return userId;
};
// Check if label is system-protected (Sent or Inbox)
const isProtectedLabel = (labelId) => {
  return labelId === 0 || labelId === 1 || labelId === 2;
};
// Check if label name already exists
const labelNameExists = (userId, name) => {
  return Labels.getLabels(userId).some(label => label.name === name);
};
// Helper to retrieve a label by ID for a specific user
const requireLabel = (res, userId, labelId) => {
  const label = Labels.getLabelById(userId, labelId);
  if (!label) {
    res.status(404).json({ error: 'Label not found' });
    return null;
  }
  return label;
};
