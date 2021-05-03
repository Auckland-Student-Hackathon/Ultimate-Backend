
const serviceAccount = require("./serviceAccountKey.json")

const outputJsonString = JSON.stringify(serviceAccount)
console.log(outputJsonString)
console.log("\nencoded\n")
const outputBase64 = Buffer.from(outputJsonString).toString("base64")
console.log(outputBase64)


console.log("\ndecoded\n")
const decodeBase64 = Buffer.from(outputBase64, "base64").toString("ascii")
console.log(decodeBase64)
const decodeJson = JSON.parse(decodeBase64)
console.log(decodeJson)