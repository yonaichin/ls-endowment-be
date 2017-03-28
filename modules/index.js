import { get as getDO1 } from './DO1'
import Promise from 'promise'

class Module {
  constructor (product_id, insured_payload) {
    this.product_id = product_id
    this.insured_payload = insured_payload
  }
  get () {
    console.log('get modules', this.product_id)
    switch (this.product_id) {
      case 'DO1':
        return getDO1(this.insured_payload)
      default :
        return new Promise((resolve, reject) => {
          reject({
            status: {
              code: 'error',
              message: 'product doesnt exist'
            }
          })
        })

    }
  }


}
export default Module
