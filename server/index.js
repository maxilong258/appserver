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

//获取好友未读消息树
module.exports.unreadMsg = (req, res) => {
  let data = req.body
  dbserver.unreadMsg(data, res)
}

//消息标为已读

module.exports.updateMsg = (req, res) => {
  let data = req.body
  dbserver.updateMsg(data, res)
}