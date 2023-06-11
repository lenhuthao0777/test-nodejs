const mongoose = require('mongoose')

const seasonSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  year: { type: Date, default: '' },
})

module.exports = mongoose.model('Season', seasonSchema, 'season')
