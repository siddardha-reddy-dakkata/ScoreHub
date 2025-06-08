const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    shortName: { type: String, required: true },
    logo: { type: String, required: true },

    sportType: { type: String, required: true },
    players: [player],
})

const playerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    },
    captain: { type: Boolean, default: false},
})