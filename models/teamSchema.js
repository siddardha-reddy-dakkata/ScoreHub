const mongoose = require('mongoose');
const playerSchema = require('./playerSchema')



const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shortName: { type: String, required: true },
  logo: { type: String },
  sportType: { type: String, required: true },
  players: [playerSchema],
});

module.exports = mongoose.model('Team', teamSchema);