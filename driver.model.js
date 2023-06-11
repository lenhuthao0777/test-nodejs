const mongoose = require('mongoose')

const driverSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  rank: { type: String, default: '' },
  points: { type: String, default: '' },
  car: { type: String, default: '' },
  flag: { type: String, default: '' },
  team: {
    type: mongoose.Types.ObjectId,
    ref: 'Team',
  },
})
module.exports = mongoose.model('Driver', driverSchema, 'driver')
