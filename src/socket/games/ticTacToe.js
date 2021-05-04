

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
  for (const obj of gameObject) {
    if (obj.playerUid !== null) {
      if (checkObj[obj.playerUid] === undefined) {
        checkObj[obj.playerUid] = [obj.id]
        players.push(obj.playerUid)
      } else {
        checkObj[obj.playerUid] = [
          ...checkObj[obj.playerUid],
          obj.id
        ]
      }
      if (obj.id === 9) {
        winnerUid = obj.playerUid
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