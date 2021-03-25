const express = require('express')
const bodyParser = require('body-parser')
const router = require('./router/index')
const files = require('./router/files')
const jwt = require('./dao/jwt')

const port = 2333
const app = express()
// const app1 = require('express')()
// var http = require('http').createServer(app1);
const server = app.listen(3000)
const io = require('socket.io')(server)
require('./dao/socket')(io)


app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", 'http://localhost:8080');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true)
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(__dirname + '/data'))

app.use(function (req, res, next) {
  if (typeof (req.body.token) != 'undefined') {
    //处理token匹配
    let token = req.body.token
    let tokenMatch = jwt.verifyToken(token)
    if (tokenMatch === 1) next()
    else res.send({ status: 300 })
  } else {
    next()
  }
})

app.use(router)
app.use(files)

//404处理
app.use(function (req, res, next) {
  // let err = new Error('Not Found');
  // err.status = 404
  // next(err)
  //console.log('222');
  res.send(404)
  // next()
})

//全局错误处理
app.use(function (err, req, res, next) {
  res.status(res.status || 500)
  res.send(err.message)
})

app.listen(port, () => console.log(`running on port ${port}!`))
