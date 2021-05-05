const { rooms } = require("./handleRoom")
const { GAME_MODE_TYPE } = require("./constants")
const {
  setupGameTicTacToe,
  handleGameMove,
  calculateWinner,
  resetGame
} = require("./games/ticTacToe")
const { gameFinishedFunction } = require("./functions")

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

  socket.on("gameMove", async (data) => {
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
    let winnerUid = null
    // Generate the game board based on the game type
    if (roomObj["mode"] === GAME_MODE_TYPE["Tic-Tac-Toe"]) {
      handleGameMove(roomObj, index, uid)
      newGameStatus = roomObj["status"]
      winnerUid = calculateWinner(roomObj)
    }

    socket.to(roomId).emit("gameMoveResponse", {
      success: true,
      data: newGameStatus
    })

    socket.emit("gameMoveResponse", {
      success: true,
      data: newGameStatus
    })

    if (winnerUid !== null) {
      const players = roomObj["players"]
      console.log("players", players)
      console.log("winnerUid", winnerUid)

      // Do not add points if the game was a draw
      if (winnerUid !== "draw") {
        await gameFinishedFunction(players, winnerUid)
      }

      // Reset the game
      if (roomObj["mode"] === GAME_MODE_TYPE["Tic-Tac-Toe"]) {
        resetGame(rooms, roomId)
      }

      socket.to(roomId).emit("gameWinnerFound", {
        success: true,
        winner: winnerUid
      })

      return socket.emit("gameWinnerFound", {
        success: true,
        winner: winnerUid
      })
    } else {
      console.log("THERE IS NO WINNER")
    }
  })
}

module.exports = {
  handleGame
}