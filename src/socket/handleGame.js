const { rooms } = require("./handleRoom")
const { GAME_MODE_TYPE } = require("./constants")
const {
  setupGameTicTacToe,
  handleGameMove
} = require("./games/ticTacToe")

const handleGame = (socket, uid) => {
  socket.on("getGameStatus", (data) => {
    const { roomId } = data
    const currentSocketId = uid

    if (rooms[roomId] === undefined) {
      return socket.emit("getGameStatusResponse", {
        success: false,
        message: "The room ID does not exist."
      })
    }

    const roomObj = rooms[roomId]

    let arr = []
    // Generate the game board based on the game type
    if (roomObj["mode"] === GAME_MODE_TYPE["Tic-Tac-Toe"]) {
      arr = setupGameTicTacToe(9)
    }

    // Create a generic status object
    // should be usable for other games as well 
    if (roomObj["status"] === undefined) {
      roomObj["status"] = {
        "currentPlayersTurn": roomObj.owner,
        "moves": [],
        "winner": null,
        "firstPlayer": roomObj.owner,
        "gameObject": arr
      }
    }

    return socket.emit("getGameStatusResponse", {
      success: true,
      data: roomObj["status"]
    })
  })

  socket.on("gameMove", (data) => {
    const { roomId, index } = data

    const roomObj = rooms[roomId]

    if (rooms[roomId] === undefined) {
      return
      // return socket.emit("getGameStatusResponse", {
      //   success: false,
      //   message: "The room ID does not exist."
      // })
    }

    let newGameStatus = {}
    // Generate the game board based on the game type
    if (roomObj["mode"] === GAME_MODE_TYPE["Tic-Tac-Toe"]) {
      handleGameMove(roomObj, index, uid)
      newGameStatus = roomObj["status"]
    }

    socket.to(roomId).emit("gameMoveResponse", {
      success: true,
      data: newGameStatus
    })

    return socket.emit("gameMoveResponse", {
      success: true,
      data: newGameStatus
    })
  })
}

module.exports = {
  handleGame
}