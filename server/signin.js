const dbserver = require('../dao/dbserver')

module.exports.signIn = (req, res) => {
  let data = req.body.data
  let pwd = req.body.pwd

  dbserver.userMatch(data, pwd, res)
}