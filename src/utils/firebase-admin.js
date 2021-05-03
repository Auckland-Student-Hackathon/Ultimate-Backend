const admin = require("firebase-admin");
const { FIREBASE_SERVICE_ACCOUNT } = require("../config")

const serviceAccountJson = JSON.parse(Buffer.from(FIREBASE_SERVICE_ACCOUNT, "base64").toString("ascii"))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountJson)
})

module.exports = {
  admin
}