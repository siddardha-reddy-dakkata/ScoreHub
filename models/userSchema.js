const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true},
    
    fullName: { type: String, required: false},
    email: { type: String, required: true},

    password: { type: String, required: true},
    profilePicture: { type: String , default: ""},
})



module.exports = mongoose.model('User', userSchema);