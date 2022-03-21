const mongoose = require('mongoose')

const accountSchema = mongoose.Schema({
    Name: {
      type: String,
      required: true
    },
    UserId: {
      type: Number,
      default: false
    },
    NameGame: {
      type: String,
      required: true
    },
    Status: {
      type: Boolean,
      default: false
    },
    Items: Array,
})

let account
try {
  account = mongoose.model('account')
} catch (error) {
  account = mongoose.model('account', accountSchema)
}

module.exports = account