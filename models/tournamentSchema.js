const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sport: { type: String, required: true },
  type: { type: String, enum: ['Knockout'], default: 'Knockout' },

  organizers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  }],
  matches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
  }],
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Tournament', tournamentSchema);



