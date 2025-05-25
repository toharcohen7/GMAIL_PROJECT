let labelIdCounter = 0;
const labels = [];

const getLabels = () => {
  return labels;
};

const createLabel = (name) => {
    const newLabel = { id: ++labelIdCounter,name };
    labels.push(newLabel);
    return newLabel;
}

const getLabelById = (id) => labels.find(label => label.id === id);

const deleteLabel = (id) => {
    const index = labels.findIndex(label => label.id === id);
    if (index !== -1) 
        labels.splice(index, 1);
}

const getLabelIndexById = (id) => {
  return labels.findIndex(label => label.id === id);
}

const patchLabel = (index, updates) => {
    if (updates.name !== undefined)
        labels[index].name = updates.name; 
}

module.exports = {
    getLabels,
    createLabel,
    getLabelById,
    deleteLabel,
    getLabelIndexById,
    patchLabel
};