const express = require('express')
const config = require('./src/config')
const morgan = require('morgan')
const { userRoute } = require('./src/routes')
const {
  checkFirebaseToken,
  swaggerSpecs,
  swaggerUi
} = require("./src/middleware")

const PORT = config.port || 5000

const app = express()
app.use(express.json())
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs))
app.use("", checkFirebaseToken)

if (config.NODE_ENV !== "production") {
  app.use(morgan('dev'))
}

app.use(
  "",
  userRoute
)

app.listen(PORT, () => {
  console.log(`Ultimate Server is running on port ${PORT}`)
})