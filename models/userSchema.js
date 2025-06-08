const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    message: { type: String, required: true},
    status:  { type: Boolean, required: true, default: false},
    createdAt: {type: Date, default: Date.now}
})

const userSchema = new mongoose.Schema({
    username: { type: String, required: true},
    fullName: { type: String, required: false},
    email: { type: String, required: true},

    password: { type: String, required: true},
    profilePicture: { type: String},
    notifications: [notificationSchema],
})



module.exports = mongoose.model('User', userSchema);