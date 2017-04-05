import _ from 'lodash'
import Promise from 'promise'

import { getInsuredAge, getTaipeiTime, isNumeric } from '../../utils/insurance_helper'
import { setModuleError } from '../../utils'
import Products from '../products.json'
import INS_FEE from './refs/ins_fee.json'
import FORFEIT_FEE from './refs/forfeit_fee.json'
import ABAR from './refs/abar.json'
import POLICY_VALUE from './refs/policy_value.json'
import FULL_TERM_INSURANCE_MONEY from './refs/full_term_insurance_money.json'

export const get = (payload) => {
  return new Promise((resolve, reject) => {
    const [{
      product_name,
      product_id,
      ins_rate,
      ins_rate_stated,
      ins_payment_period_available,
      ins_min_amount
    }] = _.filter(Products, { product_id: 'ZJ1' })
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
      const errorStatus = setModuleError(`繳費 ${ins_payment_period} 年期最低保費為 ${ins_amount_by_period} 美元`)
      reject(errorStatus)
    }
    const age = getInsuredAge(new Date(birthday))
    const sheet_length = 110 - age + 1
    const today = getTaipeiTime(new Date())
    const product_code = 'ZJ1-06'// 險種代碼
    const product_search_code = `${product_code}${gender === 'male' ? '男' : '女'}${age < 10 ? '0' + age : age}`
    const product_ins_fee = parseInt(_.filter(INS_FEE, { criteria: product_search_code })[0]['ins_fee']) // 險種費率
    const payment_factor = 1 // 繳別係數
    const ins_discount = 1 // 匯款及自動轉帳1%
    const ins_discount_with_high_amount = 0
    const total_discount = ins_discount + ins_discount_with_high_amount
    const ins_fee = _.round(product_ins_fee * ins_amount / 10000) // 表定保費
    const ins_fee_with_discount = _.round(ins_fee * payment_factor * (1 - total_discount * 0.01))
    // search criteria
    const criteria = { criteria: product_search_code }
    // 隱藏試算表 cell AI11
    let forfeit_fee = _.map(_.filter(FORFEIT_FEE, criteria)[0],
                              (val, key) => isNumeric(key) ? parseInt(val) : ''
                             )
    // 試算表 cell AJ11
    let abar = _.map(_.filter(ABAR, criteria)[0],
                       (val, key) => isNumeric(key) ? parseInt(val) : ''
                      )
    // 保價金
    let policy_value = _.map(_.filter(POLICY_VALUE, criteria)[0],
                                (val, key) => isNumeric(key) ? parseInt(val) : ''
                              )
    let full_term_insurance_money = _.map(_.filter(FULL_TERM_INSURANCE_MONEY, criteria)[0],
                       (val, key) => isNumeric(key) ? parseInt(val) : ''
                      )
    const accumulated_forfeit_fee = []

    forfeit_fee = _.slice(forfeit_fee, 1, sheet_length)
    abar = _.slice(abar, 1, sheet_length)
    policy_value = _.slice(policy_value, 1, sheet_length)
    full_term_insurance_money = _.slice(full_term_insurance_money, 0, sheet_length)
    let cell_P = 0
    let cell_D = 0
    let sheet = _.map(forfeit_fee, (val, idx) => {
      const cell_J = _.round(ins_amount / 10000 * forfeit_fee[idx])
      const cell_AM = full_term_insurance_money[idx]
      // const cell_AQ = cell_T - cell_Q
      const cell_H = _.round(ins_amount / 10000 * policy_value[idx] )
      const cell_L = _.round(Math.max((ins_rate_stated - ins_rate), 0) * cell_H, 0)
      const cell_AJ = abar[idx]
      const cell_O = ((age===15 && idx != 0)?_.round(10000*(cell_L)/cell_AJ,0):(idx==0?_.round(10000*cell_L/cell_AJ,0):_.round(10000*(cell_L+_.round(_.round(cell_P/10000*cell_AJ,0)*Math.max(ins_rate_stated - ins_rate,0),0))/cell_AJ,0)))
      cell_P = cell_P + cell_O
      const cell_T = _.round(cell_P / 10000 * cell_AJ)
      const cell_Q = _.round(cell_P / 10000 * cell_AM)
      const cell_AQ = cell_T - cell_Q
      if (idx < ins_payment_period) {
        cell_D = cell_D + ins_fee_with_discount
      }

      const sheet_payload = {
        age: age + idx,
        forfeit_fee: cell_J + cell_AQ,
        guarantee_rate: _.round((cell_J + cell_AQ)/cell_D * 100, 2)
      }
      return sheet_payload
    })

    resolve({
      product_name,
      product_id,
      ins_fee,
      ins_fee_with_discount,
      sheet
    })

  })
}
