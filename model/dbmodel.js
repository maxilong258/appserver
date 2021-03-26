var mongoose = require('mongoose')
var db = require('../config/db')
var Schema = mongoose.Schema

var UserSchema = new Schema({
  name: { type: String },
  psw: { type: String },
  email: { type: String },
  sex: { type: String, default: 'asexual' },
  birth: { type: Date },
  phone: { type: Number },
  explain: { type: String },
  imgurl: { type: String, default: '/user/user.png' },
  time: { type: Date }
})

var FriendSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: 'User' },
  friendID: { type: Schema.Types.ObjectId, ref: 'User' },
  state: { type: String },                          //好友状态 0表示已为好友 1表示申请中 2表示尚未通过
  markname: { type: String },
  time: { type: Date },                              //好友状态建立时间
  lastTime: { type: Date }                           //好友最后通讯时间
})

var MessageSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: 'User' },
  friendID: { type: Schema.Types.ObjectId, ref: 'User' },
  message: { type: String },
  types: { type: String },                           //内容类型 0文字 1图片 2音频
  time: { type: Date },
  state: { type: Number }                            //消息状态 0已读 1未读
})

var GroupSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String },
  imgurl: { type: String, default: 'group.png' },
  time: { type: Date },
  notice: { type: String }
})

var GroupUserSchema = new Schema({
  groupID: { type: Schema.Types.ObjectId, ref: 'Group' },
  userID: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String },
  tip: { type: Number, default: 0 },
  time: { type: Date },
  lastTime: { type: Date },
  shield: { type: Number }
})

var GroupMsgSchema = new Schema({
  groupID: { type: Schema.Types.ObjectId, ref: 'Group' },
  userID: { type: Schema.Types.ObjectId, ref: 'User' },
  message: { type: String },
  types: { type: String },                           //内容类型 0文字 1图片 2音频
  time: { type: Date },
})
module.exports = db.model('User', UserSchema)
module.exports = db.model('Friend', FriendSchema)
module.exports = db.model('Message', MessageSchema)
module.exports = db.model('Group', GroupSchema)
module.exports = db.model('GroupUser', GroupUserSchema)
module.exports = db.model('GroupMsg', GroupMsgSchema)