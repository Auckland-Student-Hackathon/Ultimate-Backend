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
  }
})

const User = ultimate.model("User", userSchema)

module.exports = {
  User
}