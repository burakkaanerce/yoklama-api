const jwt = require("jsonwebtoken");

function authToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const tokenType = authHeader && authHeader.split(' ')[0]
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null || tokenType != "Bearer") return res.sendStatus(401)

  jwt.verify(token, "yoklamaauthsecret", (err, user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

module.exports = authToken;