const jwt = require('jsonwebtoken');
const users = require('./users');

const SECRET = 'super-secret-key';

const signIn = (userName, password) => {
  const user = users.signIn(userName, password);
  if (!user) {
    return undefined;
  }

  const token = jwt.sign(
    {
      id: user.id,
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      birthDate: user.birthDate
    }, 
    SECRET);

  return token;
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
};

module.exports = {
  signIn,
  verifyToken,
};
