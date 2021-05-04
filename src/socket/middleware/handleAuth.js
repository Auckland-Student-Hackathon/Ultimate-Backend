const handleAuth = (socket, next) => {
  const uid = socket.handshake.query.uid
  console.log("uid", uid, "socket id", socket.id)
  if (uid === "" || uid == null || uid === "null") {
    return next(new Error("No uid provided."))
  }
  return next()
}

module.exports = {
  handleAuth
}