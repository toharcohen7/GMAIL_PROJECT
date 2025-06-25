const LabelsService = require('./labels')
const User = require('../models/users.js');


/**
 * Retrieves a user by ID.
 * Returns basic information without exposing the password.
 */
const getUser = async (userId) => {
    const user = await User.findOne({ _id: userId }).lean();
    if (!user)
        return undefined;
    return {
        _id: user._id,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
        birthDate: user.birthDate,
        image: user.image
  };
};

/**
 * Creates a new user if the username is not already taken.
 * Also initializes default labels (like "unlabeled") for the new user.
 * Returns the created user object or undefined if username exists.
 */
const createUser = async (userName, password, firstName, lastName, gender, birthDate, image) => {
    if (await User.findOne({ userName: userName })) {
        return undefined; // Username already exists
    }
    const newUser = new User({
        userName,
        password,
        firstName,
        lastName,
        gender,
        birthDate,
        image
    });
    await newUser.save();
    LabelsService.initLabelsForUser(newUser._id);
    return newUser;
};

/**
 * Authenticates a user by username and password.
 * Returns the user ID if login is successful, or undefined otherwise.
 */
const signIn = async (userName, password) => {
    const user = await User.findOne({ userName: userName, password: password });
    console.log("User found:", user);
    if (!user) {
        return undefined;
    }
    return {
        _id: user._id,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
        birthDate: user.birthDate
    };

}

const getIdFromUserName = async (userName) => {
    const user = await User.findOne({ userName: userName });
    return user ? user._id : undefined;
}

const getUserNameFromId = async (userId) => {
    const user = await User.findOne({ _id: userId });
    return user ? user.userName : undefined;
}

module.exports = {
    getUser,
    createUser,
    signIn,
    getIdFromUserName,
    getUserNameFromId
};