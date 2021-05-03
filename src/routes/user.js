const { Router } = require('express')
const { User } = require('../models/index')

const userRoute = Router()

userRoute.route("/user")
  /**
   * @openapi
   * /user:
   *   get:
   *     description: Return the requested user information
   *     responses:
   *       200:
   *         description: An object of the user's data
   *         content:
   *          application/json:
   *            schema:
   *              type: object
   */
  .get(async (req, res) => {
    const headerUid = req.header.uid

    let uidSearchUp = headerUid

    try {
      const result = await User.findOne({ uid: uidSearchUp }).lean().exec()
      return res.status(200).json(result || {})
    } catch (err) {
      console.error("GET user error", err)
      return res.status(500).json(err)
    }
  })
  /**
   * @openapi
   * /user:
   *   post:
   *     description: Add a new user into the system.
   *     responses:
   *       200:
   *         description: The user's UID.
   */
  .post(async (req, res) => {
    const data = req.body.data
    const headerUid = req.header.uid

    if (headerUid === "") {
      return res.status(400).send("Bad request.")
    }

    try {
      const check = await User.findOne({
        uid: headerUid
      }).select("").lean().exec()
      if (check !== null) {
        // The user already exist
        return res.status(200).send("ok")
      }
      const newUser = await User.findOneAndUpdate({
        uid: headerUid,
      }, {
        uid: headerUid,
        name: data.name,
        email: data.email
      }, { upsert: true, new: true }).select("").lean().exec()

      return res.status(200).json(newUser["_id"])
    } catch (err) {
      console.error("POST user error", err)
      return res.status(500).json(err)
    }
  })

userRoute.route("/update-profile")
  /**
     * @openapi
     * /update-profile:
     *   post:
     *     description: Update the user's information.
     *     responses:
     *       200:
     *         description: Empty.
     */
  .post(async (req, res) => {
    const headerUid = req.header.uid

    if (headerUid === "") {
      return res.status(400).send("Bad request.")
    }

    const data = req.body

    try {
      await User.findOneAndUpdate({
        uid: headerUid,
      }, {
        name: data.name
      }, { new: true }).select("").lean().exec()

      return res.status(200).json({})
    } catch (err) {
      console.error("POST update-profile error", err)
      return res.status(500).json(err)
    }
  })

module.exports = {
  userRoute
}