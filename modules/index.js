import { get as getA06_DO1 } from './A06_DO1'
import { get as getA06_DR1 } from './A06_DR1'
import { get as getA06_ZJ1 } from './A06_ZJ1'
import { get as getA03_FAS } from './A03_FAS'
import Promise from 'promise'

class Module {
  constructor (product_id, insured_payload) {
    this.product_id = product_id
    this.insured_payload = insured_payload
  }
  get () {
    console.log('get modules', this.product_id)
    switch (this.product_id) {
      case 'A06_DO1':
        return getA06_DO1(this.insured_payload)
      case 'A06_DR1':
        return getA06_DR1(this.insured_payload)
      case 'A06_ZJ1':
        return getA06_ZJ1(this.insured_payload)
      case 'A03_FAS':
        return getA03_FAS(this.insured_payload)
      default :
        return new Promise((resolve, reject) => {
          reject({
            code: 'error',
            message: 'product doesnt exist'
          })
        })

    }
  }


}
export default Module
