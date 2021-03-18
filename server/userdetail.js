const dbserver = require('../dao/dbserver')

//获取用户详情
module.exports.userDetail = (req, res) => {
  let id = req.body.id
  dbserver.userDatail(id, res)
}

//用户信息修改
module.exports.userUpdate = (req, res) => {
  let data = req.body
  dbserver.userUpdate(data, res)
}

//获取好友昵称
module.exports.getMarkName = (req, res) => {
  let data = req.body
  dbserver.getMarkName(data, res)
}
//修改好友昵称
module.exports.friendMarkName = (req, res) => {
  let data = req.body
  dbserver.friendMarkName(data, res)
}