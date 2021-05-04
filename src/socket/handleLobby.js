const { rooms } = require("./handleRoom")
const { GAME_MODE_TYPE } = require("./constants")

const handleLobby = (socket, uid) => {
  socket.on("changeGameMode", (data) => {
    const { roomId, mode } = data
    const currentSocketId = uid

    console.log(roomId, mode, currentSocketId)
    console.log("This person's rooms", uid, socket.rooms)

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
    socket.to(roomId).emit("changeGameModeResponse", {
      success: true,
      message: `The game mode has been updated to ${GAME_MODE_TYPE[mode]}`
    })

    return socket.emit("changeGameModeResponse", {
      success: true,
      message: `The game mode has been updated to ${GAME_MODE_TYPE[mode]}`
    })
  })

  socket.on("startGame", (data) => {
    const { roomId } = data
    const currentSocketId = uid

    if (rooms[roomId] === undefined) {
      return socket.emit("startGameResponse", {
        success: false,
        message: "The room ID does not exist."
      })
    }

    if (rooms[roomId]["owner"] !== currentSocketId) {
      return socket.emit("startGameResponse", {
        success: false,
        message: "Only the owner can start the game."
      })
    }

    // Check if all players are ready
    const roomObj = rooms[roomId]
    let playersAreReady = true
    for (const player of roomObj["players"]) {
      if (!player.ready) {
        playersAreReady = false
        break
      }
    }

    if (!playersAreReady) {
      return socket.emit("startGameResponse", {
        success: false,
        message: `Not all players are ready!`
      })
    }

    rooms[roomId]["started"] = true
    socket.to(roomId).emit("startGameResponse", {
      success: true,
      message: `Game is starting!`
    })

    return socket.emit("startGameResponse", {
      success: true,
      message: `Game is starting!`
    })
  })
}

module.exports = {
  handleLobby
}