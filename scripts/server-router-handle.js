const path = require('path')
const fs = require('fs')
const formidable = require('formidable')
const serverProxy = require('./server-proxy')
let isMock = false
const env = require('../config/env')

function getMockFile(reqPath, res) {
  try {
    reqPath = reqPath.replace('/api', '/mocks')
    reqPath = path.resolve('.' + reqPath)
  
    console.info('[req info mock]', reqPath)
  
    fs.readFile(reqPath, function (err, result) {
      var result = JSON.parse(String(result))
      if (err) {
        res.send(err)
      } else {
        res.set('content-type', 'application/json')
        res.send(result)
      }
      res.end()
    })
  } catch(err) {
    console.info(err)
  }
  
}

function recieveImageFile(req, res, next) {
  var body = ''
  var file, fileObj, saveImgPath
  // create an incoming form object
  var form = new formidable.IncomingForm()
  var fileObj = {
    code: '-1',
    data: '',
    detailMessage: '',
    message: ''
  }

  // req.on('data', function (data) {
  //   body += data
  // })
  // req.on('end', function () {
  //   console.info('========end========')
  //   console.log(String(body))
  // })

  res.set('content-type', 'text/html')

  form.parse(req, function (err, fields, files) {
    if (err) {
      res.send(JSON.stringify(fileObj))
      res.end()
    } else {
      console.log('****temp img path:', files['file']['path'])

      file = files['file']
      fileObj = {
        name: file.name,
        size: file.size,
        type: file.name.match(/\.(.+)$/)[1],
        tempPath: file.path,
        data: file.path,
        code: '200'
      }

      saveImgPath = path.join(__dirname, '../uploads/' + file.name)

      fs.readFile(file.path, (err, data) => {
        if (err) {
          fileObj.detailMessage = JSON.stringify(err)
          res.send(JSON.stringify(fileObj))
          res.end()
        } else {
          fs.writeFile(saveImgPath, data, 'binary', (err) => {
            if (err) {
              fileObj.detailMessage = JSON.stringify(err)
            }
            fileObj.data = 'http://' + env['development']['host'] + ':' + env['development']['port'] + '/uploads/' + file.name
            res.send(JSON.stringify(fileObj))
            res.end()
          })
        }
      })
    }
  })
}

function assignRouter(req, res, next) {
  var reqPath = req.originalUrl
  var proxyConfig

  if (process.env.NODE_ENV === 'mock') {
    isMock = true
    console.log('mock reqPath', reqPath)
    getMockFile(reqPath + '.json', res)
  }
  if (next) {
    next()
  }
}

function getHtmlFile(compiler, filename, res, next) {
  compiler.outputFileSystem.readFile(filename, function (err, result) {
    if (err) {
      res.send(err)
    } else {
      res.set('content-type', 'text/html')
      res.send(result)
      res.end()
    }
    if (next) {
      next()
    }
  })
}

function getImageFile(compiler, filename, res, next) {
  var newFs = compiler ? compiler.outputFileSystem : fs

  console.info('[get image path]', filename)

  newFs.readFile(filename, function (err, result) {
    if (err) {
      res.send(err)
    } else {
      res.set('content-type', 'image/' + filename.match(/\.(\d)$/))
      res.send(result)
    }
    res.end()

    if (next) {
      next()
    }
  })
}

function getJsFile(compiler, filename, res, next) {
  var newFs = compiler ? compiler.outputFileSystem : fs

  console.info('[get js path]', filename)

  newFs.readFile(filename, function (err, result) {
    if (err) {
      res.send(err)
    } else {
      res.set('content-type', 'application/x-javascript')
      res.send(result)
    }
    res.end()

    if (next) {
      next()
    }
  })
}

function routerRootPath(req, res, compiler) {
  // TODO compiler.outputPath is equal to the webpack publickPath
  var filename = path.join(compiler.outputPath, 'app.html')
  // console.info('####', compiler.outputPath, path.join(compiler.outputPath, 'app.html'))
  getHtmlFile(compiler, filename, res)
}

function routerUploadSingleFile(req, res, next) {
  var reqPath = req.originalUrl

  if (process.env.NODE_ENV === 'mock') {
    isMock = true
    console.log('mock reqPath', reqPath.replace(/\?.*$/, ''))
    recieveImageFile(req, res, next)
  }
  if (next) {
    next()
  }
}

function routerImgPath(req, res, compiler) {
  // var reqImgPath = req.baseUrl.match(/.+(assets.+)$/)[1]
  var filename = compiler ? path.join(compiler.outputPath, req.baseUrl.match(/.+(assets.+)$/)[1]) : path.join(__dirname, '../' + req.baseUrl + req.path)
  getImageFile(compiler, filename, res)
}

function routerHtmlPath(req, res, compiler) {
  var filename = path.join(compiler.outputPath, req.baseUrl.replace('/', ''))
  getHtmlFile(compiler, filename, res)
}

function routerJsFile(req, res, compiler) {
  var filename = path.join(compiler.outputPath, req.baseUrl.replace('/', ''))
  getJsFile(compiler, filename, res)
}

module.exports = {
  getMockFile,
  recieveImageFile,
  assignRouter,
  routerRootPath,
  routerUploadSingleFile,
  routerImgPath,
  routerHtmlPath,
  routerJsFile
}
