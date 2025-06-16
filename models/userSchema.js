const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true},  // Deeni nunchi motham get cheskunela pettukovali...
    
    fullName: { type: String, required: false},
    email: { type: String, required: true},

    password: { type: String, required: true},
    profilePicture: { type: String },
})



module.exports = mongoose.model('User', userSchema);