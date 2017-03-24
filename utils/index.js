import fs from 'fs-extra'

export const copyToTemp = (filePath, tmpPath) => {
  return fs.copySync(filePath, tmpPath)
}
export const removeTempFile = (path, fileName) => {
  setTimeout(() => {
    fs.removeSync(path + fileName)
    console.log(`Temp file[${fileName}] removed from /tmp.`)

  }, 5000)
}
