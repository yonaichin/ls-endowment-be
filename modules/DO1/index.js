import Promise from 'promise'
import Excel from 'exceljs'

import { copyToTemp, removeTempFile } from '../../utils'

export const get = () => {
  return new Promise((resolve, reject) => {
    const fileHash = (new Date()).getTime()
    const tmpFileName = `DO1-${fileHash}.xlsx`
    const tmpDir = `${__dirname}/../../tmp/`

    copyToTemp(__dirname + '/product.xlsx', tmpDir + tmpFileName)
    console.log(`${tmpFileName} copied to /tmp`)
    const workbook = new Excel.Workbook()
    workbook.xlsx.readFile(tmpDir + tmpFileName)
      .then(() => {
        const worksheet = workbook.getWorksheet('工作表1')
        worksheet.getCell('A1').value = 5
        const A1 = worksheet.getCell('A1').value
        const B1 = worksheet.getCell('B1').value
        console.log('cell', A1, B1)
        workbook.xlsx.writeFile(tmpDir + 't-' + tmpFileName)

      })

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


