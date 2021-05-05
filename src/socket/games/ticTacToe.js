

const setupGameTicTacToe = (boardSize) => {
  const arr = []
  for (let i = 1; i <= boardSize; i++) {
    arr.push({
      id: i,
      empty: true,
      playerUid: null
    })
  }
  return arr
}

const handleGameMove = (roomObject, index, uid) => {
  const gameStatus = roomObject["status"]
  const gameObject = gameStatus["gameObject"]

  // Update the array
  gameObject[index - 1] = {
    id: index,
    empty: false,
    playerUid: uid
  }

  // Set the current player to the next person 
  const players = roomObject["players"]
  let currentPlayersPosition = null
  for (let i = 0; i < players.length; i++) {
    const player = players[i]
    if (player.uid === uid) {
      currentPlayersPosition = i
      break
    }
  }

  if (currentPlayersPosition === players.length - 1) {
    gameStatus["currentPlayersTurn"] = players[0]["uid"]
  } else {
    gameStatus["currentPlayersTurn"] = players[currentPlayersPosition + 1]["uid"]
  }
  gameStatus["moves"] = [
    ...gameStatus["moves"],
    {
      id: index,
      playerUid: uid
    }
  ]
}

const calculateWinner = (roomObject) => {
  console.log("roomObject roomObject", roomObject["status"]["gameObject"])
  const gameObject = roomObject["status"]["gameObject"]
  const checkObj = {}
  const players = []
  let winnerUid = null
  let totalMoves = 0
  for (const obj of gameObject) {
    if (obj.playerUid !== null) {
      totalMoves += 1
      if (checkObj[obj.playerUid] === undefined) {
        checkObj[obj.playerUid] = [obj.id]
        players.push(obj.playerUid)
      } else {
        checkObj[obj.playerUid] = [
          ...checkObj[obj.playerUid],
          obj.id
        ]
      }
    }
  }

  // is a draw
  if (totalMoves === 9) {
    return "draw"
  }

  for (player of players) {
    const currentCheckArray = checkObj[player]
    // top left corner to bottom right
    if (
      currentCheckArray.includes(1) &&
      currentCheckArray.includes(5) &&
      currentCheckArray.includes(9)
    ) {
      winnerUid = player
      break
    }

    // top right corner to bottom left
    if (
      currentCheckArray.includes(3) &&
      currentCheckArray.includes(5) &&
      currentCheckArray.includes(7)
    ) {
      winnerUid = player
      break
    }

    // check each row
    for (let row = 1; row <= 9; row += 3) {
      if (
        currentCheckArray.includes(row) &&
        currentCheckArray.includes(row + 1) &&
        currentCheckArray.includes(row + 2)
      ) {
        winnerUid = player
        break
      }
    }

    // check each column
    for (let column = 1; column <= 3; column += 1) {
      if (
        currentCheckArray.includes(column) &&
        currentCheckArray.includes(column + 3) &&
        currentCheckArray.includes(column + 6)
      ) {
        winnerUid = player
        break
      }
    }
  }

  console.log("checkObj", checkObj)
  console.log("players", players)
  return winnerUid
}

const resetGame = (rooms, roomId) => {
  const roomObj = rooms[roomId]
  const playerArr = []

  for (player of roomObj.players) {
    if (player.role === "owner") {
      playerArr.push(player)
    } else {
      playerArr.push({
        ...player,
        ready: false
      })
    }
  }

  const resetRoomObj = {
    mode: roomObj.mode,
    owner: roomObj.owner,
    maxPlayers: roomObj.maxPlayers,
    players: playerArr,
    started: false,
  }
  rooms[roomId] = resetRoomObj
}

module.exports = {
  setupGameTicTacToe,
  handleGameMove,
  calculateWinner,
  resetGame
}