const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    sportType: { type: String, required: true },

    scheduledTime: { type: Date, required: true},
    scheduledDate: { type: Date, required: true},
})