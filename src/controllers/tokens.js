const tokens = require('../models/tokens')

exports.signIn = (req, res) => {
  // Check if the user ID is provided and is a valid number
  if (isThereExtraFields(req, ["userName", "password"])) {
  return res.status(400).json({ error: 'No extra fields allowed' });
  }

  const { userName, password } = req.body
  if (!userName || !password) 
      return res.status(400).json({ error: 'User name and password are required' })

  const jwtToken = tokens.signIn(userName, password);
    if (!jwtToken)
      return res.status(401).json({ error: 'Invalid user name or password' });
  
    res.status(200).json({ token: jwtToken });
}

function isThereExtraFields(req, expectedKeys) {

  if (!req.body || typeof req.body !== 'object') {
    return false; // No body or not an object, no extra fields to check
  }

  const receivedKeys = Object.keys(req.body);
  const extraKeys = receivedKeys.filter(key => !expectedKeys.includes(key));

  return extraKeys.length > 0 ? true : false
}