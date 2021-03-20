const dbserver = require('../dao/dbserver')

module.exports.getFriend = (req, res) => {
  let data = req.body
  dbserver.getUsers(data, res)
}

//获取最后一条消息
module.exports.getLastMsg = (req, res) => {
  let data = req.body
  dbserver.getOneMsg(data, res)
}