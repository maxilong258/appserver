const jwt = require('jsonwebtoken')
let secret = 'maxilong'

module.exports.generateToken = (id) => {
  const payload = {
    id: id,
    time: new Date()
  }
  const token = jwt.sign(payload, secret, { expiresIn: 60 * 60 * 24 * 120 })
  return token
}

module.exports.verifyToken = (e) => {
  let payload = ''
  jwt.verify(e, secret, function (err, result) {
    if (err) payload = 0
    else payload = 1
  })
  return payload
}