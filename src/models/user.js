const { ultimate } = require('../instances/mongoose')
const { Schema } = require('mongoose')

const userSchema = new Schema({
  uid: {
    type: String,
    index: true,
    required: true
  },
  name: {
    type: String,
    index: true
  },
  email: {
    type: String,
    index: true,
    required: true
  },
  points: {
    type: Schema.Types.Number
  },
  wins: {
    type: Schema.Types.Number
  },
  loses: {
    type: Schema.Types.Number
  }
})

const User = ultimate.model("User", userSchema)

module.exports = {
  User
}