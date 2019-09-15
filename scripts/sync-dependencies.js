const fs = require('fs')
const path = require('path')
const { copyFolder, checkDirIsOk } = require('./sync-copy-files')

function syncFile(bitFiles) {
  const allFilesName = Object.keys(bitFiles)
  try {
    allFilesName.forEach(name => {
      let { version ,src, dest} = bitFiles[name]
      dest = getDestPath(version, dest)
      if (fs.statSync(src).isFile()) {
        copyFile(src, dest)
      } else if (fs.statSync(src).isDirectory()) {
        copyFolder(src, dest)
      }
    })
  } catch(err) {
    throw err
  }
}

function copyFile(src, dest) {
  if (fs.existsSync(dest)) {
    return false
  }

  const folders = dest.split('/')
  checkDirIsOk(folders.slice(0, folders.length - 1))

  try {
    fs.copyFileSync(src, dest)
  } catch (err) {
    throw new Error(`copy file ${src} faild`)
  }
  
}

function getDestPath(verions, destPath) {
  destPath = destPath.replace('<%version%>', verions)
  return destPath
}

function syncDependencies() {
  const filePath = path.resolve('./dependencies.json')
  // console.info(filePath, fs.statSync(filePath).isFile(), fs.statSync(filePath).isDirectory())
  if(fs.statSync(filePath).isFile() === true){
    const dependencies = fs.readFileSync(filePath, 'utf8')
    try {
      const depObj = JSON.parse(dependencies)
      const {font, javascript, css} = depObj.dependencies

      javascript && syncFile(javascript)
      css && syncFile(css)
      font && syncFile(font)

    } catch(err) {
      throw new Error(err)
    }
  } else {
    throw new Error('Have no dependencies.json file in you project root')
  }
  
}

syncDependencies()
