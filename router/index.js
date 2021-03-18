const express = require('express')
var dbserver = require('../dao/dbserver')
var emailserver = require('../dao/emailserver')
const signup = require('../server/signup')
const signin = require('../server/signin')
const search = require('../server/search')
const user = require('../server/userdetail')
const friend = require('../server/friend')


const router = express.Router()

router.get('/', (req, res) => {
  res.send('helloWorld!')
})

// router.get('/test', (req, res) => {
//   res.send('666')
// })

// router.post('/mail', (req, res) => {
//   let mail = req.body.mail
//   emailserver.emailSignUp(mail, res)
//   console.log(mail);
// })
//注册
router.post('/signup/add', (req, res) => {
  signup.signUp(req, res)
})
//用户或邮箱是否被占用判断
router.post('/signup/judge', (req, res) => {
  signup.judgeValue(req, res)
})
//登录
router.post('/signin/match', (req, res) => {
  signin.signIn(req, res)
})

//搜索页面
//搜索用户
router.post('/search/user', (req, res) => {
  search.searchUser(req, res)
})
//判断是否为好友
router.post('/search/isfriend', (req, res) => {
  search.isFriend(req, res)
})
//搜索群。。。


//用户详情
router.post('/user/detail', (req, res) => {
  user.userDetail(req, res)
})
//用户信息修改
router.post('/user/update', (req, res) => {
  user.userUpdate(req, res)
})
//好友昵称获取
router.post('user/getmarkname', (req, res) => {
  user.getMarkName(req, res)
})
//好友昵称修改
router.post('/user/markname', (req, res) => {
  user.friendMarkName(req, res)
})

//好友操作
//申请好友
router.post('/friend/applyFriend', (req, res) => {
  friend.applyFriend(req, res)
})
//申请状态修改
router.post('/friend/updatefriendstate', (req, res) => {
  friend.updateFriendState(req, res)
})
//拒绝或删除好友
router.post('/friend/deletefriend', (req, res) => {
  friend.deleteFriend(req, res)
})
module.exports = router