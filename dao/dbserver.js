const { populate } = require('../model/dbmodel')
var dbmodel = require('../model/dbmodel')
var User = dbmodel.model('User')
const Friend = dbmodel.model('Friend')
const bcrypt = require('./bcrypt')
const jwt = require('./jwt')
const Message = dbmodel.model('Message')

//注册用户
module.exports.buildUser = (name, mail, pwd, res) => {
  //密码加密
  let password = bcrypt.encryption(pwd)
  let data = {
    name: name,
    email: mail,
    psw: password,
    time: new Date()
  }
  let user = new User(data);
  user.save((err, result) => {
    if (err) return res.send({ status: 500 })
    res.send({ status: 200 })
  })
}

//验证用户名邮箱是否被占用
module.exports.countUserValue = (data, type, res) => {
  let wherestr = {}
  wherestr[type] = data
  User.countDocuments(wherestr, (err, result) => {
    if (err) return res.send({ status: 500, })
    return res.send({ status: 200, result })
  })
}

//用户登录验证
module.exports.userMatch = (data, pwd, res) => {
  let wherestr = { $or: [{ 'name': data }, { 'email': data }] }
  let out = { 'name': 1, 'imgurl': 1, 'psw': 1 }

  User.find(wherestr, out, function (err, result) {
    if (err) return res.send({ status: 500 })
    if (result == '') return res.send({ status: 400 })
    result.map((e) => {
      const pwdMatch = bcrypt.verification(pwd, e.psw)
      if (pwdMatch) {
        let token = jwt.generateToken(e._id)
        const back = {
          id: e._id,
          name: e.name,
          imgurl: e.imgurl,
          token: token
        }
        return res.send({ status: 200, back })
      } else {
        return res.send({ status: 400 })
      }
    })
  })
}

//搜索用户
module.exports.searchUser = (data, res) => {
  let wherestr = ''
  if (data === 'yike') {
    wherestr = {}
  } else {
    wherestr = { $or: [{ 'name': { $regex: data } }, { 'email': { $regex: data } }] }
  }
  let out = {
    'name': 1,
    'email': 1,
    'imgurl': 1
  }
  User.find(wherestr, out, (err, result) => {
    if (err) return res.send({ status: 500 })
    res.send({ status: 200, result })
  })
}

//判断是否为好友
module.exports.isFriend = (uid, fid, res) => {
  const wherestr = { 'userID': uid, 'friendID': fid, 'state': 0 }
  Friend.findOne(wherestr, function (err, result) {
    if (err) return res.send({ status: 500 })
    if (result) {
      res.send({ status: 200 })
    } else {
      res.send({ status: 400 })
    }
  })
}


//用户详情
module.exports.userDatail = (id, res) => {
  let wherestr = { '_id': id }
  let out = { 'psw': 0 }
  User.findOne(wherestr, out, (err, result) => {
    if (err) res.send({ status: 500 })
    else res.send({ status: 200, result })
  })
}

function update(data, update, res) {
  User.findByIdAndUpdate(data, update, (err, result) => {
    if (err) res.send({ status: 500, message: '修改失败' })
    else res.send({ status: 200, message: '修改成功' })
  })
}

//修改用户信息
module.exports.userUpdate = (data, res) => {
  let updatestr = {}
  if (typeof (data.pwd) !== 'undefined') {
    User.find({ '_id': data.id }, { 'psw': 1 }, (err, result) => {
      if (err) {
        res.send({ status: 500 })
      } else {
        if (result === '') {
          res.send({ status: 400 })
        }
        result.map(function (e) {
          const pwdMatch = bcrypt.verification(data.pwd, e.psw);
          if (pwdMatch) {
            if (data.type === 'psw') {
              let password = bcrypt.encryption(data.data)
              updatestr[data.type] = password
              update(data.id, updatestr, res)
            } else {
              updatestr[data.type] = data.data
              User.countDocuments(updatestr, (err, result) => {
                if (err) return res.send({ status: 500 })
                if (result === 0) update(data.id, updatestr, res)
                else res.send({ status: 300, message: '已经存在' })
              })
            }
          } else res.send({ status: 400, message: '密码匹配失败' })
        })
      }
    })
  } else if (data.type === 'name') {
    updatestr[data.type] = data.data
    User.countDocuments(updatestr, (err, result) => {
      if (err) return res.send({ status: 500 })
      if (result === 0) update(data.id, updatestr, res)
      else res.send({ status: 300, message: '已经存在' })
    })
  } else {
    updatestr[data.type] = data.data
    update(data.id, updatestr, res)
  }
}
//获取好友昵称
module.exports.getMarkName = (data, res) => {
  const wherestr = { 'userID': data.uid, 'friendID': data.fid }
  const out = { 'markname': 1 }
  Friend.findOne(wherestr, out, (err, result) => {
    if (err) res.send({ status: 500 })
    else res.send({ status: 200, result })
  })
}

//修改好友昵称
module.exports.friendMarkName = (data, res) => {
  const wherestr = { 'userID': data.uid, 'friendID': data.fid }
  const updatestr = { 'markname': data.name }
  Friend.updateOne(wherestr, updatestr, (err, result) => {
    if (err) res.send({ status: 500 })
    else res.send({ status: 200 })
  })
}

//好友操作
//添加好友表
module.exports.buildFriend = (uid, fid, state, res) => {
  const data = {
    userID: uid,
    friendID: fid,
    state: state,
    time: new Date(),
    lastTime: new Date()
  }
  const friend = new Friend(data);
  friend.save((err, result) => {
    if (err) console.log('申请好友表出错');
    //else res.send({ status: 200 })
  })
}

//好友最后通讯时间
module.exports.upFriendLastTime = (data) => {
  const wherestr = { $or: [{ 'userID': data.uid, 'friendID': data.fid }, { 'userID': data.fid, friendID: data.uid }] }
  const updatestr = { 'lastTime': new Date() }
  Friend.updateMany(wherestr, updatestr, (err, result) => {
    if (err) console.log('更新好友最后通讯时间出错');
    //else res.send({ status: 200 })
  })
}

//添加一对一消息表
module.exports.insertMsg = (uid, fid, msg, type, res) => {
  const data = {
    userID: uid,
    friendID: fid,
    message: msg,
    types: type,
    time: new Date(),
    state: 1
  }
  const message = new Message(data)
  message.save((err, result) => {
    if (err) {
      if (res) res.send({ status: 500 })
    } else {
      if (res) res.send({ status: 200 })
    }
  })
}

//好友申请
module.exports.applyFriend = function (data, res) {
  //判断是否已经申请过
  const wherestr = { $or: [{ 'userID': data.uid, 'friendID': data.fid }, { 'userID': data.fid, 'friendID': data.uid }] }
  Friend.countDocuments(wherestr, (err, result) => {
    if (err) return res.send({ status: 500 })
    if (result === 0) {
      this.buildFriend(data.uid, data.fid, 2)
      this.buildFriend(data.fid, data.uid, 1)
    } else {
      this.upFriendLastTime(data)
    }
    this.insertMsg(data.uid, data.fid, data.msg, 0, res)
  })
}

//更新好友状态
module.exports.updateFriendState = (data, res) => {
  const wherestr = { $or: [{ 'userID': data.uid, 'friendID': data.fid }, { 'userID': data.fid, 'friendID': data.uid }] }
  Friend.updateMany(wherestr, { 'state': 0 }, (err, result) => {
    if (err) res.send({ status: 500 })
    else res.send({ status: 200 })
  })
}

//拒绝或删除好友
module.exports.deleteFriend = (data, res) => {
  const wherestr = { $or: [{ 'userID': data.uid, 'friendID': data.fid }, { 'userID': data.fid, 'friendID': data.uid }] }
  Friend.deleteMany(wherestr, (err, result) => {
    if (err) res.send({ status: 500 })
    else res.send({ status: 200 })
  })
}

//按要求获取用户列表
module.exports.getUsers = (data, res) => {
  let query = Friend.find({})
  query.where({ 'userID': data.uid, 'state': data.state })
  query.populate('friendID')
  query.sort({ 'lastTime': -1 })
  query.exec().then((e) => {
    let result = e.map((ver) => {
      return {
        id: ver.friendID._id,
        name: ver.friendID.name,
        markname: ver.markname,
        imgurl: ver.friendID.imgurl,
        lastTime: ver.lastTime
      }
    })
    res.send({ status: 200, result })
  }).catch((err) => {
    res.send({ status: 500 })
  })
}

//按要求获取一条一对一消息
module.exports.getOneMsg = (data, res) => {
  let query = Message.findOne({})
  query.where({ $or: [{ 'userID': data.uid, 'friendID': data.fid }, { 'userID': data.fid, 'friendID': data.uid }] })
  query.sort({ 'time': -1 })
  //console.log(query);
  query.exec().then((ver) => {
    const result = {
      message: ver.message,
      time: ver.time,
      types: ver.types
    }
    res.send({ status: 200, result })
  }).catch((err) => {
    res.send({ status: 500 })
  })
}

//汇总未读一对一消息数
module.exports.unreadMsg = (data, res) => {
  const wherestr = { 'userID': data.fid, 'friendID': data.uid, 'state': 1 }
  Message.countDocuments(wherestr, (err, result) => {
    if (err) res.send({ status: 500 })
    else res.send({ status: 200, result })
  })
}

//一对一消息状态修改
module.exports.updateMsg = (data, res) => {
  const wherestr = { 'userID': data.fid, 'friendID': data.uid, 'state': 1 }
  const updatestr = { 'state': 0 }
  Message.updateMany(wherestr, updatestr, (err, result) => {
    if (err) res.send({ status: 500 })
    else res.send({ status: 200 })
  })
}

//消息操作
//分页获取一对一聊天数据
module.exports.msg = (data, res) => {
  //跳过的条数
  let skipNum = data.nowPage * data.pageSize
  let query = Message.find({})
  //查询条件
  query.where({ $or: [{ 'userID': data.uid, 'friendID': data.fid }, { 'userID': data.fid, 'friendID': data.uid }] })
  //排序方式
  query.sort({ 'time': -1 })
  //查找friendID关联的user对象
  query.populate('userID')
  //跳过条数
  query.skip(skipNum)
  //一页条数
  query.limit(data.pageSize)
  //查询结果
  query.exec().then((e) => {
    let result = e.map((ver) => {
      return {
        id: ver._id,
        message: ver.message,
        types: ver.types,
        time: ver.time,
        fromId: ver.userID._id,
        imgurl: ver.userID.imgurl
      }
    })
    res.send({ status: 200, result })
  }).catch((err) => {
    res.send({ status: 500, err })
  })
}


