var nodemailer = require('nodemailer')

var credentials = require('../config/credentials')

var transporter = nodemailer.createTransport({
  service: 'qq',
  auth: {
    user: credentials.qq.user,
    pass: credentials.qq.pass
  }
})

// module.exports.emailSignUp = (email, res) => {
//   let options = {
//     from: '1948487742@qq.com',
//     to: email,
//     subject: 'thankyou for singin',
//     html: '<a href="http://localhost:8080/">点击</a>'
//   }

//   transporter.sendMail(options, (err, msg) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log('发送成功')
//     }
//   })
// }