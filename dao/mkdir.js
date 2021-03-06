const fs = require('fs')
const path = require('path')

module.exports.mkdirs = function (pathname, callback) {
  pathname = path.isAbsolute(pathname) ? pathname : path.join(__dirname, pathname)
  pathname = path.relative(__dirname, pathname)
  let floders = pathname.split(path.sep)
  let pre = ''
  floders.forEach(floder => {
    try {
      let _stat = fs.statSync(path.join(__dirname, pre, floder))
      let hasMkdir = _stat && _stat.isDirectory()
      if (hasMkdir) {
        callback
      }
    } catch (error) {
      try {
        fs.mkdirSync(path.join(__dirname, pre, floder))
        callback && callback(null)
      } catch (error) {
        callback && callback(error)
      }
    }
    pre = path.join(pre, floder)
  })
}