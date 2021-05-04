const { handleRoom } = require("./handleRoom")
const { handleLobby } = require("./handleLobby")
const { handleGame } = require("./handleGame")

const onConnection = (io) => {
  io.on("connection", socket => {
    const uid = socket.handshake.query.uid
    console.log("New client has been connected.", uid, socket.id)

    // console.log("Current user's room", socket.rooms)

    socket.emit("data", {
      test: "data'"
    })

    socket.on("info", (data) => {
      console.log("got info from client", data)
    })

    socket.on("disconnect", () => {
      console.log("Client has disconnected.", uid, socket.id)
    })

    handleRoom(socket, uid)
    handleLobby(socket, uid)
    handleGame(socket, uid)
  })
}

module.exports = {
  onConnection
}