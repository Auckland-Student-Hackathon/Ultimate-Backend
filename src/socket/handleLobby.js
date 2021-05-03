const { rooms } = require("./handleRoom")
const { GAME_MODE_TYPE } = require("./constants")

const handleLobby = (socket) => {
  socket.on("changeGameMode", (data) => {
    const { roomId, mode } = data
    const currentSocketId = socket.id

    console.log(roomId, mode, currentSocketId)

    if (rooms[roomId] === undefined) {
      return socket.emit("changeGameModeResponse", {
        success: false,
        message: "The room ID does not exist."
      })
    }

    if (rooms[roomId]["owner"] !== currentSocketId) {
      return socket.emit("changeGameModeResponse", {
        success: false,
        message: "Only the owner can change the room's game mode."
      })
    }

    if (GAME_MODE_TYPE[mode] === undefined) {
      return socket.emit("changeGameModeResponse", {
        success: false,
        message: "This game mode is not supported."
      })
    }

    rooms[roomId]["mode"] = mode
    return socket.emit("changeGameModeResponse", {
      success: true,
      message: `The game mode has successfully been updated to ${GAME_MODE_TYPE[mode]}`
    })
  })
}

module.exports = {
  handleLobby
}