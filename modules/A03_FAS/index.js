import _ from 'lodash'
import Promise from 'promise'

import { getInsuredAge, getTaipeiTime, isNumeric } from '../../utils/insurance_helper'
import { setModuleError } from '../../utils'
import Products from '../products.json'
import PREM_DB from './refs/prem.json'

export const get = (payload) => {
  return new Promise((resolve, reject) => {
    const [{
      product_name,
      product_id,
      ins_rate_stated,
      ins_payment_period_available,
      ins_min_amount
    }] = _.filter(Products, { product_id: 'FAS', ins_provider: 'A03' })
    const { birthday,
            gender,
            ins_amount,
            ins_payment_period } = payload

    // Exception handling
    //
    if (ins_payment_period_available.indexOf(ins_payment_period) < 0) {
      const errorStatus = setModuleError(`${product_name}, 此商品的繳費年期為 ${_.replace(ins_payment_period_available, null, '躉繳')}`)
      reject(errorStatus)
    }
    const [{ ins_amount_by_period }] = _.filter(ins_min_amount, {ins_payment_period})
    if (ins_amount < ins_amount_by_period) {
      const errorStatus = setModuleError(`保費${ins_payment_period === null ? '躉繳' : ins_payment_period}年期最低保費為 ${ins_amount_by_period} 美元`)
      reject(errorStatus)
    }
    const age = getInsuredAge(new Date(birthday))
    const sheet_length = 110 - age + 1
    const today = getTaipeiTime(new Date())
    const product_code = 'FAS'// 險種代碼
    const prem_code = `${product_code}${isNumeric(ins_payment_period) ? (ins_payment_period < 10 ? '0' + ins_payment_period : ins_payment_period): '00'}${gender === 'male' ? 'M' : 'F'}01`
    const ins_fee_per_year = _.round(ins_amount / 1000 * PREM_DB[prem_code][age + 2])
    const ins_rate = getInsRate(ins_payment_period)


    console.log(ins_rate)
    resolve({
      product_name
    })
  })
}

const getInsRate = (ins_payment_period) => {
  switch (ins_payment_period) {
    case null:
      return 0.0175
    case 3:
      return 0.0175
    case 6:
      return 0.025
    case 10:
      return 0.025
  }
}
