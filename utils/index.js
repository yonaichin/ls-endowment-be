import fs from 'fs-extra'
import _ from 'lodash'
import colors from 'colors'

export const copyToTemp = (filePath, tmpPath) => {
  return fs.copySync(filePath, tmpPath)
}
export const removeTempFile = (path, fileName) => {
  setTimeout(() => {
    fs.removeSync(path + fileName)
    console.log(`Temp file[${fileName}] removed from /tmp.`)

  }, 5000)
}

export const HTTPLogger = (req) => {
  const { method,
          originalUrl,
          body,
          params,
          query } = req

  console.log(`[${method}] ${originalUrl} , request payload: ${JSON.stringify(body)}, request query: ${JSON.stringify(query)}, request params: ${JSON.stringify(params)}`.rainbow)
}
