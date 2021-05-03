const { GAME_MODE_TYPE } = require("./constants")

const rooms = {}

const handleRoom = (socket) => {
  socket.on("createRoom", (data) => {
    const { roomId } = data

    if (rooms[roomId] !== undefined) {
      return socket.emit("createRoomResponse", {
        success: false,
        message: `The ${roomId} room already exist.`
      })
    }

    rooms[roomId] = {
      mode: "Tic-Tac-Toe",
      owner: socket.id,
      playerOne: socket.id,
      playerTwo: ""
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

  socket.on("joinRoom", (data) => {
    const { roomId } = data
    // Check if the room exist
    if (rooms[roomId] === undefined) {
      return socket.emit("joinRoomResponse", {
        success: false,
        message: `The ${roomId} room does not exist.`
      })
    }

    socket.join(roomId)
    console.log("This user's room", socket.rooms)
    return socket.emit("joinRoomResponse", {
      success: true,
      message: "Successfully joined the room.",
      roomId: roomId
    })
  })

  socket.on("roomDetails", () => {
    socket.emit("roomDetailsResponse", rooms)
  })

  socket.on("getRoomDetails", (data) => {
    const { roomId } = data
    const currentSocketId = socket.id

    if (rooms[roomId] === undefined) {
      return socket.emit("getRoomDetailsResponse", {
        success: false,
        message: "The room ID does not exist."
      })
    }

    if (
      rooms[roomId]["playerOne"] !== currentSocketId &&
      rooms[roomId]["playerTwo"] !== currentSocketId
    ) {
      return socket.emit("getRoomDetailsResponse", {
        success: false,
        message: "Unable to view details for a room that you do not belong in."
      })
    }

    return socket.emit("getRoomDetailsResponse", {
      success: true,
      data: rooms[roomId]
    })
  })
}

module.exports = {
  handleRoom,
  rooms
}