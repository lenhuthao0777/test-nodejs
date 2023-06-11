const mongoose = require('mongoose')

const teamSchema = new mongoose.Schema({

  name: { type: String, default: '' },
  rank: { type: String, default: '' },
  logo: { type: String, default: '' },
  image: { type: String, default: '' },
  points: { type: String, default: '' },
  season: {
    type: mongoose.Types.ObjectId,
    ref: 'Season'
  }
})

module.exports = mongoose.model('Team', teamSchema, 'team')
