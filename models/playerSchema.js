const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  playerType: {
    type: String,
    enum: ['User', 'Guest'],
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
  },
  username : {
    type: String
  },
  captain: { type: Boolean, default: false },
});

playerSchema.pre('validate', function (next) {
  if (this.playerType === 'User' && !this.userId && !this.username) {
    return next(new Error('User ID and username required for playerType "User"'));
  }
  if (this.playerType === 'Guest' && !this.name) {
    return next(new Error('Name required for playerType "Guest"'));
  }
  next();
});



module.exports = playerSchema;