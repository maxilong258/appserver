const dbserver = require('../dao/dbserver')

//获取一对一聊天数据
module.exports.msg = (req, res) => {
  let data = req.body
  dbserver.msg(data, res)
}