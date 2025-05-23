let idCounter = 0;
const users = [];

const getUser = (id) => {
    const user = users.find(u => u.id === id);
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

const createUser = (userName, password,firstName,lastName,gender,birthDate) => {
    const newUser = {id: ++idCounter,userName, password,firstName,lastName,gender,birthDate};
    users.push(newUser);
    return newUser;
};

module.exports = {
    getUser,
    createUser
};