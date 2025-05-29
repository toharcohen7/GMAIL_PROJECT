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

    if(!isValidPassword(req.body.password)){
        return res.status(400).json({error:
             'Password must be at least 6 characters long and include one uppercase letter, one number, and one special character'});
    }

    if(!isValidGender(req.body.gender)){
        return res.status(400).json({error:'gender must be male/female/other'});
    }

     if(!isValidDate(req.body.birthDate)){
        return res.status(400).json({error:'birthDate must be in a date format'});
    }

    const { userName, password, firstName, lastName, gender, birthDate } = req.body;
    const newUser = Users.createUser(userName, password, firstName, lastName, gender, birthDate);
    if (!newUser) {
        return res.status(409).json({ error: 'User already exists' });
    }
    
    res.status(201).location(`/api/users/${newUser.id}`).end();
};
//
// ─── Helper Functions ───────────────────────────────────────────────────────────
//
function isValidPassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;
    return regex.test(password);
}

function isValidGender(gender) {
    return (gender === 'Male' ||gender === 'male' || gender === 'Female' || gender === 'female' || gender === 'Other' || gender === 'other');
}

function isValidDate(birthDate) {
    return /^\d{4}-\d{2}-\d{2}$/.test(birthDate);
}