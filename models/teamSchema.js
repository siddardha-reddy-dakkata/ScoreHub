const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    shortName: { type: String, required: true },
    logo: { type: String, required: true },

    sportType: { type: String, required: true },
    players: [player],
})

const playerSchema = new mongoose.Schema({
    playerType: {
        type: String,
        enum: ["User", "Guest"],
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: this.playerType == "User"
    },
    name: {
        type: String,
        required: this.playerType == "Guest"
    },
    captain: { type: Boolean, default: false},
})