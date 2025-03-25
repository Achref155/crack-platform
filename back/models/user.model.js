const mongoose = require('mongoose');
const bcrypt = require('bcrypt');



const userSchema = new mongoose.Schema({

    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    image: {
        type: String,
        default: 'avatar.png'
    },
    isBanned: {
        type: Boolean,
        default: false  // Default set to false, user not banned initially
    }
});

module.exports = mongoose.model('User' , userSchema );