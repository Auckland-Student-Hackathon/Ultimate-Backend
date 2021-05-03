const mongoose = require('mongoose')
const config = require('../config')
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)

const ultimate = mongoose.createConnection(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
ultimate.once('open', function () {
  console.log("Ultimate MongoDB database connection established successfully")
})

module.exports = {
  ultimate
}