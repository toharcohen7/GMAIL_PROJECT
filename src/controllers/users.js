const Users = require('../models/users')

exports.getUserById= (req, res) => {

    // Check if the user ID is provided and is a valid number
    if (isThereExtraFields(req, [])) {
    return res.status(400).json({ error: 'No extra fields allowed' });
    }

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

    const requiredFields = ['userName', 'password', 'confirmPassword', 'firstName', 'lastName', 'gender', 'birthDate', 'image'];

    // Check for extra fields in the request body
    if (isThereExtraFields(req, requiredFields)) {
    return res.status(400).json({ error: 'Only userName, confirmPassword, password, firstName, lastName, gender, birthDate and image are allowed' });
    }

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
        return res.status(400).json({error:'birthDate must be a valid date'});
    }

    const { userName, password, firstName, lastName, gender, birthDate , image} = req.body;

    const newUser = Users.createUser(userName, password, firstName, lastName, gender, birthDate, image);
    if (!newUser) {
        return res.status(400).json({ error: 'userName already exists' });
    }
    
    res.status(201).location(`/api/users/${newUser.id}`).json(newUser);
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
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) return false;

  const [year, month, day] = birthDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false;
  }

  const now = new Date();
  if (date > now) {
    return false;
  }

  return true;
}


function isThereExtraFields(req, expectedKeys) {

  if (!req.body || typeof req.body !== 'object') {
    return false; // No body or not an object, no extra fields to check
  }

  const receivedKeys = Object.keys(req.body);
  const extraKeys = receivedKeys.filter(key => !expectedKeys.includes(key));

  return extraKeys.length > 0 ? true : false
}