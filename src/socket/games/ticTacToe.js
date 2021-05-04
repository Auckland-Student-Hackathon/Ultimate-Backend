

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
}

module.exports = {
  setupGameTicTacToe,
  handleGameMove
}