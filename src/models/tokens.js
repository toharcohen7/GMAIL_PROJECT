const users = require('./users');

const signIn = (userName, password) => {
    const user = users.signIn(userName, password);
    if (!user) {
        return undefined;
    }
    return {
        id: user.id,
    }
};

module.exports = {
    signIn
};