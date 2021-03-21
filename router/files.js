const multer = require('multer')
const express = require('express')
const mkdir = require('../dao/mkdir')

const files = express.Router()

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let url = req.body.url
    mkdir.mkdirs('../data/' + url, err => console.log(err))
    cb(null, './data/' + url)
  },
  filename: function (req, file, cb) {
    let name = req.body.name
    let type = file.originalname.replace(/.+\./, '.')
    console.log(type);
    cb(null, name + type)
  }
})

var upload = multer({ storage: storage })

files.post('/files/upload', upload.array('file', 10), (req, res, result) => {
  let url = req.body.url
  //let data = req.files[0].filename

  let name = req.files[0].filename
  let imgUrl = '/' + url + '/' + name
  res.send(imgUrl)
  //res.send(data)
})


module.exports = files