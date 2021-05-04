const db = require("../../models")

const addPointsToUsers = async () => {
  try {
    const docs = await db.User.find().select().lean().exec()
    const promise = docs.map(async (c) => {
      await db.User.findOneAndUpdate({ _id: c["_id"] }, {
        points: 0,
        wins: 0,
        loses: 0
      }).select().lean().exec()
    })

    await Promise.all(promise)
    console.log("done updating users")
  } catch (err) {
    console.error("error", err)
  }
}

const gameFinishedFunction = async (players, winnerUid) => {
  try {
    await db.User.findOneAndUpdate({ uid: winnerUid }, {
      $inc: {
        points: 100,
        wins: 1
      }
    }).lean().exec()

    const promise = players.map(async (c) => {
      if (c.uid === winnerUid) {
        return
      }
      await db.User.findOneAndUpdate({ uid: c.uid }, {
        $inc: {
          points: -20,
          loses: 1
        }
      }).lean().exec()
    })

    await Promise.all(promise)
  } catch (err) {
    console.error("gameFinishedFunction err", err)
  }
}

module.exports = {
  gameFinishedFunction
}