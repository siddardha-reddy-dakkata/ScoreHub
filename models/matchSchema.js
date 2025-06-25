const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  sport: { type: String, required: true },
  type: { type: String, enum: ['Instant', 'Tournament'], default: 'Instant' },
  teamA: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  teamB: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },


  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament' },
  startTime: { type: Date },
  endTime: { type: Date },

  likes: { type: Number, default: 0},
  createdAt: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('Match', matchSchema);
