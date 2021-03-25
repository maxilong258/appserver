
const dbserver = require('./dbserver')

module.exports = function (io) {
  const users = {}
  io.on('connection', socket => {
    // console.log('a user connected');
    // socket.send('hello!')
    socket.on('login', (id) => {
      console.log(socket.id);
      socket.emit('login', socket.id)
      socket.name = id
      users[id] = socket.id
    })
    socket.on('msg', (msg, fromid, toid) => {
      console.log(msg);
      //操作数据库
      dbserver.upFriendLastTime({ uid: fromid, fid: toid })
      dbserver.insertMsg(fromid, toid, msg.message, msg.types)
      //发送给对方
      if (users[toid]) socket.to(users[toid]).emit('msg', msg, fromid, 0)
      //发送给自己
      socket.emit('msg', msg, toid, 1)
    })
    socket.on('disconnecting', () => {
      if (users.hasOwnProperty(socket.name)) {
        delete users[socket.name]
        console.log(socket.id + '离开')
      }
    })
  })
}