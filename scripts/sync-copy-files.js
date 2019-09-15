const fs = require('fs')
const path = require('path')

function cpoyFile (srcPath, destPath) {
  fs.copyFileSync(srcPath, destPath)
}

function readdir (srcPath) {
  let files = []

  files = fs.readdirSync(srcPath)

  return files
}

function copyFolder (srcPath, destPath) {
  let files = []

  if (fs.lstatSync(srcPath).isDirectory()) {
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath)
    }
    files = readdir(srcPath)
  }

  if (files && files.length > 0) {
    files.forEach((file) => {
      let curSource = path.join(srcPath, file)
      let targetFolder = path.join(destPath, file)

      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolder(curSource, targetFolder)
      } else {
        cpoyFile(curSource, targetFolder)
      }
    })
  }
}

function checkDirIsOk (checkPath) {
  let paths
  let pathStr = ''

  // console.info('\n checkPath: ', checkPath, fs.existsSync(checkPath))

  if (fs.existsSync(checkPath) === true) {
    return
  }

  paths = typeof checkPath === 'string' ? checkPath.trim().split(/\\|\/|\//) : checkPath

  paths.forEach(pathKey => {
    let createPath
    if (pathKey) {
      pathStr += pathKey + '/'
      if (fs.existsSync(path.join(pathStr)) !== true) {
        fs.mkdirSync(path.join(pathStr))
      }
    }
  })
}

module.exports = {
  cpoyFile,
  readdir,
  copyFolder,
  checkDirIsOk
}
