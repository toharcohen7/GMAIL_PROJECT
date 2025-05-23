const tokens = require('../models/tokens')

exports.signIn = (req, res) => {
    const { userName, password } = req.body
    if (!userName || !password) 
        return res.status(400).json({ error: 'User name and password are required' })

    const token = tokens.signIn(userName, password)
    if (!token) 
        return res.status(401).json({ error: 'Invalid user name or password' })
    res.set('X-User-Id', token.id).status(200).json({ id: token.id });
}