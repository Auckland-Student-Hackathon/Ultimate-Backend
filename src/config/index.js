const dotenv = require('dotenv');
const path = require("path")

const envFound = dotenv.config()
// When deployed to Heroku, the process.env is already loaded
// Therefore, no need to check 
// if (envFound.error) {
//   throw new Error("⚠️  Couldn't find .env file  ⚠️");
// }

module.exports = {
  /**
   * The default port for the server to run on.
   */
  port: process.env.PORT,

  /**
   * Connection string for MongoDB
   */
  MONGODB_URI: process.env.MONGODB_URI || "",

  /**
   * Node environment
   */
  NODE_ENV: process.env.NODE_ENV || "development",

  /**
   * Firebase Config File
   * JSON stringify and encoded in base 64
   */
  FIREBASE_SERVICE_ACCOUNT: process.env.FIREBASE_SERVICE_ACCOUNT
}