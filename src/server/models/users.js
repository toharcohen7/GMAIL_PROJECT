const Mongoose = require('mongoose');
const { Schema } = Mongoose;

const UserSchema = new Schema({
    userName: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    gender: { type: String, required: true },
    birthDate: { type: Date, required: true },
    image: { type: String, required: true },
});

const User = Mongoose.model('User', UserSchema);
module.exports = User;