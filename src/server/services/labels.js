const Labels = require('../models/labels.js');

/**
 * Returns the list of labels for a specific user.
 */
const getLabels = (userId) => {
  return Labels.find({ userId: userId });
};
/**
 * Creates a new label for the specified user.
 * The labels is assigned based on a per-user counter.
 */
const createLabel = async (userId, labelName, iconClass) => {
  const newLabel = await new Labels({ userId: userId, name: labelName, countBadge: 0, iconClass: iconClass });
  return await newLabel.save();
};
/**
 * Retrieves a specific label by its name for the given user.
 * Returns null if the label does not exist.
 */
const getLabelByName = async (userId, labelName) => {
  return await Labels.findOne({ userId: userId, name: labelName });
};
/**
 * Deletes a label by name from a specific user's label list.
 */
const deleteLabel = async (userId, labelName) => {
    await Labels.deleteOne({ userId: userId, name: labelName });
};
/**
 * Updates the name of a label by its name for a specific user.
 */
const updateLabel = async (userId, labelName, updates) => { 

  const Mails = require('./mails.js');
  const userLabel = await Labels.findOne({ userId: userId, name: labelName });

  if (!userLabel) {
    throw new Error(`Label "${labelName}" not found for user ${userId}`);
  }

  if (updates.name !== undefined) {
    userLabel.name = updates.name;
    // Update all mails with this label
    await Mails.UpdateMailsToEditLabel(userId, labelName, updates.name);
  }

  if (updates.iconClass !== undefined) {
    userLabel.iconClass = updates.iconClass;
  }

  await userLabel.save();
};
/**
 * Initializes the label structure for a new user.
 */
const initLabelsForUser = async (userId) => {
    await Promise.all([
        createLabel(userId, 'Draft', 'bi bi-inbox-fill'),
        createLabel(userId, 'Sent', 'bi bi-send'),
        createLabel(userId, 'Received', 'bi bi-file-earmark'),
        createLabel(userId, 'Spam', 'bi bi-exclamation-octagon'),
        createLabel(userId, 'Trash', 'bi bi-trash')
    ]);
};


async function addLabelCountBadgeByOne(userId, labelName) {
    await updateLabelCountBadge(userId, labelName, 1);
}

async function decreaseLabelCountBadgeByOne(userId, labelName) {
    await updateLabelCountBadge(userId, labelName, -1);
}

async function updateLabelCountBadge(userId, labelName, increment) {
    const label = await getLabelByName(userId, labelName);
    if (label) {
        label.countBadge += increment;
        await label.save();
    } else {
        throw new Error(`Label "${labelName}" not found for user ${userId}`);
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