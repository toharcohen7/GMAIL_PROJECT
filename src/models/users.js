const Labels = require('../models/labels')
const Mails = require('../models/mails')


let idCounter = 0;
const users = [];

/**
 * Retrieves a user by ID.
 * Returns basic information without exposing the password.
 */
const getUser = (userId) => {
    const user = users.find(u => u.id === userId);
    if (!user) 
        return undefined;
    return {
        id: user.id,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
        birthDate: user.birthDate
  };
};
/**
 * Creates a new user if the username is not already taken.
 * Also initializes default labels (like "unlabeled") for the new user.
 * Returns the created user object or undefined if username exists.
 */
const createUser = (userName, password,firstName,lastName,gender,birthDate, image) => {
    if (users.find(u => u.userName === userName)) {
        return undefined; // Username already exists
    }
    const newUser = {id: ++idCounter, userName, password, firstName, lastName, gender, birthDate, image};
    users.push(newUser);
    Labels.initLabelsForUser(newUser.id);
    Mails.initMailsForUser(newUser.id);
    console.log("Current users array:", users);
    return newUser;
};
/**
 * Authenticates a user by username and password.
 * Returns the user ID if login is successful, or undefined otherwise.
 */
const signIn = (userName, password) => {
    const user = users.find(u => u.userName === userName && u.password === password);
    if (!user) {
        return undefined;
    }
    return {
        id: user.id
    }
}

module.exports = {
    getUser,
    createUser,
    signIn
};