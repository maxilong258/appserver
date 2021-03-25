const dbserver = require('../dao/dbserver')

//获取一对一聊天数据
module.exports.msg = (req, res) => {
  let data = req.body
  dbserver.msg(data, res)
}

//更新未读消息数
module.exports.updateMsg = (req, res) => {
  let data = req.body
  dbserver.updateMsg(data, res)
}