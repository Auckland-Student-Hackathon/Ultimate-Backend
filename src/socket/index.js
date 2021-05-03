const {
  onConnection
} = require("./connection")
const {
  handleAuth
} = require("./middleware")

module.exports = {
  onConnection,
  handleAuth
}