const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: { type: String, required: false },
    otp: { type: Number, required: true },
    expiresAt: { 
        type: Date, 
        default: () => new Date(Date.now() + 5 * 60 * 1000),
        index:  { expires: 0},
    },
});

module.exports =  mongoose.model('Otp', otpSchema);