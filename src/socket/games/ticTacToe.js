

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

module.exports = {
  setupGameTicTacToe,
  handleGameMove
}