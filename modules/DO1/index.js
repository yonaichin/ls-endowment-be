import Promise from 'promise'

import { copyToTemp, removeTempFile } from '../../utils'

export const get = () => {
  return new Promise((resolve, reject) => {
    const fileHash = (new Date()).getTime()
    const tmpFileName = `DO1-${fileHash}.xlsx`
    const tmpDir = `${__dirname}/../../tmp/`

    copyToTemp(__dirname + '/product.xlsx', tmpDir + tmpFileName)
    console.log(`${tmpFileName} copied to /tmp`)

    const payload = { tmpFileName }
    resolve(payload)
    removeTempFile(tmpDir, tmpFileName)
    // fs.copy(__dirname + '/product.xlsx',
    //         tmpDir + tmpFileName,
    //         (err) => {
    //             if(err) return console.error(err)
    //             console.log(`${tmpFileName} copied to /tmp`)

    //             removeTempFile(tmpDir, tmpFileName)
    //             const payload = {
    //               tmpFileName
    //             }
    //             resolve(payload)
    //           }
    //         )

  })
}


