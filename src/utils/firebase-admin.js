const admin = require("firebase-admin");
const { FIREBASE_SERVICE_ACCOUNT } = require("../config")

const encodedBase64StringToJson = (string) => {
  return JSON.parse(Buffer.from(string, "base64").toString("ascii"))
}

const serviceAccountJson = encodedBase64StringToJson(FIREBASE_SERVICE_ACCOUNT)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountJson)
})

module.exports = {
  admin
}