// Stores labels per user
const labels = new Map();
/**
 * Returns the list of labels for a specific user.
 */
const getLabels = (userId) => {
  return labels.get(userId).data;
};
/**
 * Creates a new label for the specified user.
 * The label ID is assigned based on a per-user counter.
 */
const createLabel = (userId, name) => {
  const userLabels = labels.get(userId);
  const newLabel = { id: userLabels.labelCounter++, name }; 
  userLabels.data.push(newLabel);
  return newLabel;
};
/**
 * Retrieves a specific label by its ID for the given user.
 * Returns null if the label does not exist.
 */
const getLabelById = (userId, labelId) => {
  const userLabels = labels.get(userId).data;

  return userLabels.find(label => label.id === labelId) || null;
};
/**
 * Deletes a label by ID from a specific user's label list.
 */
const deleteLabel = (userId, labelId) => {
  const userData = labels.get(userId);
  userData.data = userData.data.filter(label => label.id !== labelId);
};
/**
 * Updates the name of a label by its ID for a specific user.
 * Only the 'name' field is updatable.
 */
const updateLabel = (userId, labelId, updates) => {
  const userLabels = labels.get(userId).data;

  const label = userLabels.find(label => label.id === labelId);
  if (label && updates.name !== undefined) {
    label.name = updates.name;
  }
};
/**
 * Initializes the label structure for a new user.
 */
const initLabelsForUser = (userId) => {
  labels.set(userId, {labelCounter: 3, data: [{ id: 0, name: 'Draft' },
                                              { id: 1, name: 'Sent' },
                                              { id: 2, name: 'Received' }]
                                            });
};

module.exports = {
    getLabels,
    createLabel,
    getLabelById,
    deleteLabel,
    initLabelsForUser,
    updateLabel
};