const Blacklist = require('../services/blacklist');

exports.addBlacklist = async (req, res) => {

    // Check for extra fields in the request body
    if (isThereExtraFields(req, ['url'])) {
        return res.status(400).json({ error: 'Only url field is allowed' });
    }

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

    // Check for extra fields in the request body
    if (isThereExtraFields(req, [])) {
        return res.status(400).json({ error: 'No extra fields allowed' });
    }

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

    // Check for extra fields in the request body
    if (isThereExtraFields(req, ['url'])) {
        return res.status(400).json({ error: 'Only url field is allowed' });
    }

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

// Check for extra fields in the request body
function isThereExtraFields(req, expectedKeys) {

  if (!req.body || typeof req.body !== 'object') {
    return false; // No body or not an object, no extra fields to check
  }

  const receivedKeys = Object.keys(req.body);
  const extraKeys = receivedKeys.filter(key => !expectedKeys.includes(key));

  return extraKeys.length > 0 ? true : false
}
