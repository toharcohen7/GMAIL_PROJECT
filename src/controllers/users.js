const Users = require('../models/users')

exports.getUserById= (req, res) => {
    const userId = parseInt(req.params.id);
    const user = Users.getUser(userId);
    if(!user)
        return res.status(404).json({error: 'User not found'});
    res.json(user);
}
/**
 * Creates a new user if the username is not already taken.
 * Also initializes default labels for the user.
 */
exports.createUser = (req, res) => {
    const requiredFields = ['userName', 'password', 'firstName', 'lastName', 'gender', 'birthDate'];
    for (const field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).json({ error: `${field} is required` });
        }
    }

    const { userName, password, firstName, lastName, gender, birthDate } = req.body;
    const newUser = Users.createUser(userName, password, firstName, lastName, gender, birthDate);
    if (!newUser) {
        return res.status(409).json({ error: 'User already exists' });
    }
    
    res.status(201).location(`/api/users/${newUser.id}`).end();
};