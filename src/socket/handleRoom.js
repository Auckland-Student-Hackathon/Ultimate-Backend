const { GAME_MODE_TYPE } = require("./constants")
const cryptoRandomString = require("crypto-random-string")
const db = require("../models")

/**
 * Object data
 * {
      mode: "Tic-Tac-Toe",
      owner: "",
      maxPlayers: 2,
      players: [""],
      started: false
    }
 */
const rooms = {}

const generateNewRoomCode = () => {
  while (true) {
    const newString = cryptoRandomString({
      length: 5,
      characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    })
    if (rooms[newString] === undefined) {
      return newString
    }
  }
}

const handleRoom = (socket, uid) => {
  socket.on("createRoom", async (data) => {
    const roomId = generateNewRoomCode()
    console.log("new generated roomId", roomId)

    let playerName = ""
    try {
      const doc = await db.User.findOne({ uid: uid }).lean().exec()
      if (doc !== null) {
        playerName = doc.name
      }
    } catch (err) {
      console.error("handleRoom playerDoc error", err)
    }

    rooms[roomId] = {
      mode: "Tic-Tac-Toe",
      owner: uid,
      maxPlayers: 2,
      players: [{
        uid,
        name: playerName,
        role: "owner",
        ready: true
      }],
      started: false
    }
    socket.join(roomId)
    console.log("Create a new room", roomId)
    console.log("This user's room", socket.rooms)
    return socket.emit("createRoomResponse", {
      success: true,
      message: "Successfully created the room.",
      roomId: roomId
    })
  })

  socket.on("joinRoom", async (data) => {
    const { roomId } = data
    // Check if the room exist
    if (rooms[roomId] === undefined) {
      return socket.emit("joinRoomResponse", {
        success: false,
        message: `The ${roomId} room does not exist.`
      })
    }

    // Check if the room is available to be joined
    const roomObject = rooms[roomId]
    const playersArr = roomObject["players"]

    let playerAlreadyExistInRoom = false
    for (const obj of playersArr) {
      if (obj.uid === uid) {
        playerAlreadyExistInRoom = true
      }
    }

    if (playerAlreadyExistInRoom) {
      return socket.emit("joinRoomResponse", {
        success: true,
        message: "Successfully joined the room.",
        roomId: roomId
      })
    }

    if (playersArr.length >= roomObject.maxPlayers) {
      console.log("room is full", roomObject)
      return socket.emit("joinRoomResponse", {
        success: false,
        message: `The room is full.`
      })
    }

    let playerName = ""
    try {
      const doc = await db.User.findOne({ uid: uid }).lean().exec()
      if (doc !== null) {
        playerName = doc.name
      }
    } catch (err) {
      console.error("handleRoom playerDoc error", err)
    }

    if (roomObject["owner"] === uid) {
      return socket.emit("joinRoomResponse", {
        success: true,
        message: "Successfully joined the room.",
        roomId: roomId
      })
    }

    const newPlayerObj = {
      uid,
      name: playerName,
      role: "player",
      ready: false
    }

    roomObject["players"] = [
      ...roomObject["players"],
      newPlayerObj
    ]

    socket.join(roomId)
    console.log("This user's room", socket.rooms, uid)
    socket.emit("joinRoomResponse", {
      success: true,
      message: "Successfully joined the room.",
      roomId: roomId
    })

    return socket.to(roomId).emit("newUserJoinedResponse", {
      data: roomObject,
      newPlayer: newPlayerObj
    })
  })

  socket.on("roomDetails", () => {
    socket.emit("roomDetailsResponse", rooms)
  })

  socket.on("getRoomDetails", async (data) => {
    const { roomId } = data
    const currentSocketId = uid

    const roomObj = rooms[roomId]

    if (roomObj === undefined) {
      return socket.emit("getRoomDetailsResponse", {
        success: false,
        message: "The room ID does not exist."
      })
    }

    let belongToRoom = false
    for (const player of roomObj["players"]) {
      if (player.uid === currentSocketId) {
        belongToRoom = true
        break
      }
    }

    if (!belongToRoom) {
      return socket.emit("getRoomDetailsResponse", {
        success: false,
        message: "Unable to view details for a room that you do not belong in."
      })
    }

    socket.join(roomId)

    return socket.emit("getRoomDetailsResponse", {
      success: true,
      data: roomObj
    })
  })

  socket.on("playerReady", async (data) => {
    const { roomId } = data
    const currentSocketId = uid

    const roomObj = rooms[roomId]
    let foundPlayer = false
    let playerObj = {}
    for (const player of roomObj.players) {
      if (player.uid === currentSocketId) {
        player.ready = true
        foundPlayer = true
        playerObj = player
      }
    }

    if (!foundPlayer) {
      return socket.emit("playerReadyResponse", {
        success: false,
        message: "Failed to find you in this room. Try to refresh the page."
      })
    }

    socket.to(roomId).emit("playerReadyResponse", {
      success: true,
      data: roomObj,
      playerObj
    })

    return socket.emit("playerReadyResponse", {
      success: true,
      data: roomObj,
      playerObj
    })
  })
}

module.exports = {
  handleRoom,
  rooms
}