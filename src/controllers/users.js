const Users = require('../models/users')

exports.getUserById= (req, res) => {
    const user = Users.getUser(parseInt(req.params.id));
    if(!user)
        return res.status(404).json({error: 'User not found'});
    res.json(user);
}

exports.createUser = (req, res) => {
    const {userName, password,firstName,lastName,gender,birthDate} = req.body;
    if(!userName)
        return res.status(400).json({error: 'userName is required'});
    if(!password)
        return res.status(400).json({error: 'password is required'});
     if(!firstName)
        return res.status(400).json({error: 'firstName is required'});
     if(!lastName)
        return res.status(400).json({error: 'lastName is required'});
     if(!gender)
        return res.status(400).json({error: 'gender is required'});
     if(!birthDate)
        return res.status(400).json({error: 'birthDate is required'});
    const newArticle = Articles.createUser(userName, password,firstName,lastName,gender,birthDate);
    res.status(201).location(`/api/users/${newArticle.id}`).end();
}