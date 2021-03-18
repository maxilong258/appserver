const dbserver = require('../dao/dbserver')

module.exports.applyFriend = (req, res) => {
  const data = req.body
  dbserver.applyFriend(data, res)
}

//好友状态更新
module.exports.updateFriendState = (req, res) => {
  const data = req.body
  dbserver.updateFriendState(data, res)
}
//拒绝或删除好友
module.exports.deleteFriend = (req, res) => {
  const data = req.body
  dbserver.deleteFriend(data, res)
}