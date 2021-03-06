const express = require('express')
const http = require("http")
const socketIo = require("socket.io")
const config = require('./src/config')
const {
  userRoute,
  leaderboardRoute
} = require('./src/routes')
const {
  checkFirebaseToken,
  swaggerSpecs,
  swaggerUi
} = require("./src/middleware")
const {
  onConnection,
  handleAuth
} = require("./src/socket")
const cors = require("cors")

const PORT = config.port || 5000

const app = express()
app.use(cors({
  origin: "*",
  methods: "*",
  allowedHeaders: "*",
  optionsSuccessStatus: 204
}))
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

io.use(handleAuth)
onConnection(io)

if (config.NODE_ENV !== "production") {
  const morgan = require('morgan')
  app.use(morgan('dev'))
}

app.get("", async (req, res) => {
  return res.status(200).send(
    "<p>Welcome to Ultimate Game Center's Backend :)</p>" +
    "<p>Bye. Have a good day!</p>"
  )
})
app.use(express.json())
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs))
app.use("", checkFirebaseToken)

app.use(
  "",
  userRoute,
  leaderboardRoute
)

server.listen(PORT, () => {
  console.log(`Ultimate Server is running on port ${PORT}`)
})