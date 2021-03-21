const dbserver = require('../dao/dbserver')
const email = require('../dao/emailserver')

//用户注册
module.exports.signUp = (req, res) => {
  let name = req.body.name
  let mail = req.body.mail
  let pwd = req.body.pwd
  dbserver.buildUser(name, mail, pwd, res)
  // 发送邮件到用户邮箱
  //email.emailSignUp(mail)
}

//用户或邮箱是否被占用

module.exports.judgeValue = (req, res) => {
  let data = req.body.data
  let type = req.body.type

  dbserver.countUserValue(data, type, res)
}
