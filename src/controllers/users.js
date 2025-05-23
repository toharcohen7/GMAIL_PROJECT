const Users = require('../models/users')

exports.getUserById= (req, res) => {
    const user = Users.getUser(parseInt(req.params.id));
    if(!user)
        return res.status(404).json({error: 'User not found'});
    res.json(user);
}

exports.createUser = (req, res) => {
    const requiredFields = ['userName', 'password', 'firstName', 'lastName', 'gender', 'birthDate'];
    for (const field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).json({ error: `${field} is required` });
        }
    }

    const { userName, password, firstName, lastName, gender, birthDate } = req.body;
    const newUser = Users.createUser(userName, password, firstName, lastName, gender, birthDate);
    res.status(201).location(`/api/users/${newUser.id}`).end();
};