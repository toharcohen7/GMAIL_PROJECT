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
 * The labels is assigned based on a per-user counter.
 */
const createLabel = (userId, labelName, iconClass) => {
  const userLabels = labels.get(userId);
  const newLabel = { name: labelName, countBadge: 0, iconClass: iconClass }; 
  userLabels.data.push(newLabel);
  return newLabel;
};
/**
 * Retrieves a specific label by its name for the given user.
 * Returns null if the label does not exist.
 */
const getLabelByName = (userId, labelName) => {
  const userLabels = labels.get(userId).data;

  return userLabels.find(label => labelName === label.name) || null;
};
/**
 * Deletes a label by name from a specific user's label list.
 */
const deleteLabel = (userId, labelName) => {
  const userData = labels.get(userId);
  userData.data = userData.data.filter(label => labelName !== label.name);
};
/**
 * Updates the name of a label by its name for a specific user.
 */
const updateLabel = (userId, labelName, updates) => {
  const userLabels = labels.get(userId).data;

  const label = userLabels.find(label => labelName === label.name);
  if (label && updates.name !== undefined) {
    label.name = updates.name;
  }
  if (label && updates.iconClass !== undefined) {
    label.iconClass = updates.iconClass;
  }
};
/**
 * Initializes the label structure for a new user.
 */
const initLabelsForUser = (userId) => {
  labels.set(userId, {
    data: [{ name: 'Draft', countBadge: 0, iconClass: 'bi bi-inbox-fill' },
           { name: 'Sent', countBadge: 0, iconClass: 'bi bi-send' },
           { name: 'Received', countBadge: 0, iconClass: 'bi bi-file-earmark' },
           { name: 'Spam', countBadge: 0, iconClass: 'bi bi-exclamation-octagon' },
           { name: 'Trash', countBadge: 0, iconClass: 'bi bi-trash' }
          ]
  });
};

function addLabelCountBadgeByOne(userId, labelName) {
  const userLabels = labels.get(userId).data;
  const label = userLabels.find(label => label.name === labelName);
  if (label) {
    ++label.countBadge;
  }
  else {
    console.error(`Label ${labelName} not found for user ${userId}`);
  }
}

function decreaseLabelCountBadgeByOne(userId, labelName) {
  const userLabels = labels.get(userId).data;
  const label = userLabels.find(label => label.name === labelName);
  if (label) {
    --label.countBadge;
  }
  else {
    console.error(`Label ${labelName} not found for user ${userId}`);
  }
}


module.exports = {
    getLabels,
    createLabel,
    getLabelByName,
    deleteLabel,
    initLabelsForUser,
    updateLabel,
    addLabelCountBadgeByOne,
    decreaseLabelCountBadgeByOne
};