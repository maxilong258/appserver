const bcrypt = require('bcryptjs')

//生成hash密码
module.exports.encryption = function (e) {
  //生成随机salt
  let salt = bcrypt.genSaltSync(10)
  //生成hash密码
  let hash = bcrypt.hashSync(e, salt)
  return hash
}

//解密
module.exports.verification = function (e, hash) {
  //密码与hash密码比对
  let verif = bcrypt.compareSync(e, hash)
  //返回true false
  return verif
}