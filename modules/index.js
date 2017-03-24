import { get as getDO1 } from './DO1'

class Module {
  constructor (product_id) {
    this.product_id = product_id

  }
  get () {
    console.log('get modules', this.product_id)
    switch (this.product_id) {
      case 'DO1':
        return getDO1()
    }
  }


}
export default Module
