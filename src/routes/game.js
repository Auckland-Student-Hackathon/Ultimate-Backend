const { Router } = require('express')
const db = require('../models/index')
const { rooms } = require("../socket/handleRoom")
const { GAME_MODE_TYPE } = require("../socket/constants")

const gameRoute = Router()

gameRoute.route("/game")
  /**
   * @openapi
   * /game:
   *   post:
   *     description: Record an user's win/lost
   *     responses:
   *       200:
   *         description: Successful or not
   *         content:
   *          application/json:
   *            schema:
   *              type: boolean
   */
  .post(async (req, res) => {
    const headerUid = req.header.uid
    const { isWin, roomId } = req.body

    try {
      if (isWin) {
        await db.User.findOneAndUpdate({ uid: headerUid }, {
          $inc: {
            points: 100,
            wins: 1
          }
        }).lean().exec()
      } else {
        await db.User.findOneAndUpdate({ uid: headerUid }, {
          $inc: {
            points: -20,
            loses: 1
          }
        }).lean().exec()
      }
      return res.status(200).json(true)
    } catch (err) {
      console.error("POST game error", err)
      return res.status(500).json(err)
    }
  })

module.exports = {
  gameRoute
}