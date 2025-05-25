const Labels = require('../models/labels')

exports.getLabels = (req, res) => {
    const labels = Labels.getLabels();
    const labelNames = labels.map(label => label.name);
    res.json(labelNames);
}

exports.createLabel = (req, res) => {
    const { name } = req.body;

    if (!name){
         return res.status(400).json({ error: 'Label name is required' });
    }

    const exists = Labels.getLabels().some(label => label.name === name);
    if (exists) {
        return res.status(409).json({ error: 'Label name already exists' });
    }

    const newLabel = Labels.createLabel(name);
    res.status(201).location(`/api/labels/${newLabel.id}`).end();
}

exports.getLabelById = (req, res) => {
    const label = Labels.getLabelById(parseInt(req.params.id));
    if(!label)
        return res.status(404).json({error: 'Label not found'});
    res.json(label.name);
}

exports.deleteLabel = (req,res) => {
    const id = parseInt(req.params.id);
    const label = Labels.getLabelById(id);
    if(!label)
        return res.status(404).json({error: 'Label not found'});
    Labels.deleteLabel(id);
    return res.status(204).end();
}

exports.updateLabel = (req, res) => {
    const id = parseInt(req.params.id);
    const updates = req.body;

    if (!updates.name) {
        return res.status(400).json({ error: 'name must be provided' });
    }

    const labels = Labels.getLabels();
    if(labels.some(label => label.name === updates.name)) {
        return res.status(409).json({ error: 'Another label with this name already exists' });
    }

    const index = Labels.getLabelIndexById(id);

    if (index === -1) {
        return res.status(404).json({ error: 'Label not found' });
    }

    Labels.patchLabel(index, updates);
    return res.status(204).end();
}