const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    sport: { type: String, required: true },

})


module.exports =  mongoose.model('Match', matchSchema);