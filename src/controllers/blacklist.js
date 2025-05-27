const Blacklist = require('../models/blacklist');

exports.addBlacklist = async (req, res) => {
    const url = req.body.url;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const serverResponse = await Blacklist.operationOnBlacklist('POST', url);
    
    // Check if the server response indicates that the URL was added successfully
    if (serverResponse.includes('201 Created')) {
        return res.status(201).end();
    } else {
        return res.status(400).json({ error: 'Failed to add URL to blacklist' });
    }
};

exports.deleteBlacklist = async (req, res) => {
    const url = req.params.id;
    if (!url) {
        return res.status(400).json({ error: 'ID is required' });
    }

    const serverResponse = await Blacklist.operationOnBlacklist('DELETE', url);

    // Check if the server response indicates that the URL was deleted successfully or not found
    if (serverResponse.includes('204 No Content')) {
        return res.status(204).end();
    } else if (serverResponse.includes('404 Not Found')) {
        return res.status(404).json({ error: 'URL not found in blacklist' });
    } else {
        return res.status(400).json({ error: 'Failed to delete URL from blacklist' });
    }
};

exports.searchBlacklist = async (req, res) => {
    const url = req.body.url;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const serverResponse = await Blacklist.operationOnBlacklist('GET', url);
    
    // Parse the serverResponse to extract the boolean values
    // Example serverResponse: "200 OK\n\ntrue true"
    // in case of unvalid url: "400 Bad Request"
    const resultLine = serverResponse.split('\n\n');

    if (resultLine[0] === "200 Ok") {
        // true true means the URL is in the blacklist
        // true false means the URL is not in the blacklist (false positive)
        // false means the URL is not in the blacklist
        if (resultLine[1] === "true true") {
            return res.status(200).json({ isInBlacklist: true });
        } else {
            return res.status(200).json({ isInBlacklist: false });
        }
    } else {
        return res.status(400).json({ error: "Invalid URL or request" });
    }
};
