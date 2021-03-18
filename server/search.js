const dbserver = require('../dao/dbserver')

module.exports.searchUser = (req, res) => {
  const data = req.body.data
  dbserver.searchUser(data, res)
}

module.exports.isFriend = (req, res) => {
  const data = req.body.uid
  const fid = req.body.fid
  dbserver.isFriend(uid, fid, res)
}