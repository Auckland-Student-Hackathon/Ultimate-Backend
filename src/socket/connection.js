const { handleRoom } = require("./handleRoom")
const { handleLobby } = require("./handleLobby")

const onConnection = (io) => {
  io.on("connection", socket => {
    console.log("New client has been connected.", socket.id)

    // console.log("Current user's room", socket.rooms)

    socket.emit("data", {
      test: "data'"
    })

    socket.on("info", (data) => {
      console.log("got info from client", data)
    })

    socket.on("disconnect", () => {
      console.log("Client has disconnected.", socket.id)
    })

    handleRoom(socket)
    handleLobby(socket)
  })
}

module.exports = {
  onConnection
}