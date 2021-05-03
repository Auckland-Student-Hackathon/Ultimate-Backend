const handleAuth = (socket, next) => {
  const uid = socket.handshake.query.uid
  if (uid === "" || uid == null) {
    return next(new Error("No uid provided."))
  }
  return next()
}

module.exports = {
  handleAuth
}