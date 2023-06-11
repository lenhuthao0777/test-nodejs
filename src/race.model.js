const mongoose = require('mongoose')

const raceSchema = new mongoose.Schema({
  grand_prix: { type: String, default: '' },
  date: { type: Date, default: '' },
  winner: { type: String, default: '' },
  car: { type: String, default: '' },
  laps: { type: String, default: '' },
  time: { type: String, default: '' },
})
module.exports = mongoose.model('Race', raceSchema, 'race')
