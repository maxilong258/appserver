var mongoose = require('mongoose')

var db = mongoose.createConnection('mongodb://localhost/myapp', { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false })

db.on('error', console.error.bind(console, 'connection error: '))
db.once('open', function () {
  console.log('we are connected!');
})

module.exports = db