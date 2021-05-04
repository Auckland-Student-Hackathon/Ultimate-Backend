const { Router } = require('express')
const db = require('../models/index')

const leaderboardRoute = Router()

leaderboardRoute.route("/leaderboard")
  /**
   * @openapi
   * /leaderboard:
   *   get:
   *     description: Returns a list of the current leaderboard
   *     responses:
   *       200:
   *         description: An array of the leaderboard data
   *         content:
   *          application/json:
   *            schema:
   *              type: array
   *              items: 
   *                type: object
   */
  .get(async (req, res) => {
    const headerUid = req.header.uid

    try {
      const results = await db.User.find().sort({
        points: -1
      }).lean().exec()

      const modifiedResults = results.map((c) => {
        let isSelf = false
        if (c.uid === headerUid) {
          // is self
          // can return a bit more data about the user
          isSelf = true
        }
        return ({
          name: c.name,
          points: c.points,
          wins: c.wins,
          loses: c.loses,
          uid: isSelf ? c.uid : undefined
        })
      })
      return res.status(200).json(modifiedResults || [])
    } catch (err) {
      console.error("GET leaderboard error", err)
      return res.status(500).json(err)
    }
  })

module.exports = {
  leaderboardRoute
}