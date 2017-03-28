import _ from 'lodash'
import Promise from 'promise'

import { getInsuredAge, getTaipeiTime } from '../../utils/insurance_helper'
import { setModuleError } from '../../utils'
import INS_FEE from './refs/ins_fee.json'
import FORFEIT_FEE from './refs/forfeit_fee.json'
import ABAR from './refs/abar.json'
import POLICY_VALUE from './refs/policy_value.json'

export const get = (payload) => {
  return new Promise((resolve, reject) => {
    const { birthday,
            gender,
            ins_amount,
            ins_payment_period } = payload
    let status = {
      code: 'success',
      message: null
    }
    // Exception handling
    //
    // 最低保額 20 萬元
    if (ins_amount <= 20) {
      const errorStatus = setModuleError('ins_amount minimum is 20')
      reject(errorStatus)
    }
    // 繳費年期： 躉繳
    if (ins_payment_period !== null) {
      const errorStatus = setModuleError('此商品的繳費年期只有躉繳')
      reject(errorStatus)
    }

    const age = getInsuredAge(new Date(birthday))
    const sheet_length = 110 - age + 1
    const today = getTaipeiTime(new Date())

    // excel params
    const product_name = '遠雄人壽美滿超優利利率變動型終身壽險(DO1)'
    const product_id = 'DO1' // 險種
    const product_code = 'DO1S99' // 險種代碼
    const product_search_code = `${product_code}${gender === 'male' ? '男' : '女'}${age < 10 ? '0' + age : age}` // 險種查詢代碼
    const product_ins_fee = parseInt(_.filter(INS_FEE, { criteria: product_search_code })[0]['ins_fee']) // 險種費率
    const payment_factor = 1 // 繳別係數
    const ins_discount = 0 // 保額折扣
    const ins_rate_stated = 0.0301 // 宣告利率
    const ins_rate = 0.0125 // 預定利率
    const ins_discount_with_high_amount = ((ins_amount>=250 && ins_amount<500)
                                      ? 0.3
                                      : ((ins_amount>=500&&ins_amount<1000) ? 0.6 : ((ins_amount>=1000) ? 0.9 : 0)))
                                      // 高保額折扣
                                      // =IF(AND(E9>=250,E9<500),0.3,IF(AND(E9>=500,E9<1000),0.6,IF(AND(E9>=1000),0.9,0)))
    const total_discount = ins_discount + ins_discount_with_high_amount // 保費折扣合計
    const ins_fee = product_ins_fee * ins_amount // 表定保費
    const ins_fee_with_discount = _.round(ins_fee * payment_factor  * (1 - total_discount * 0.01)) // 首期保費

    // search criteria
    const criteria = { criteria: product_search_code }
    // 列印頁 當年度末基本保額 對應之解約金 (A)
    let forfeit_fee = _.map(_.filter(FORFEIT_FEE, criteria)[0],
                              (val, key) => isNumeric(key) ? parseInt(val) * ins_amount : ''
                             )
    // 列印頁 次年度初預估 累計增加之解約金(B)
    let abar = _.map(_.filter(ABAR, criteria)[0],
                       (val, key) => isNumeric(key) ? parseInt(val) : ''
                      )
    // 保價金
    let policy_value = _.map(_.filter(POLICY_VALUE, criteria)[0],
                                (val, key) => isNumeric(key) ? parseInt(val) : ''
                              )
    const accumulated_forfeit_fee = []

    forfeit_fee = _.slice(forfeit_fee, 1, sheet_length)
    abar = _.slice(abar, 1, sheet_length)
    policy_value = _.slice(policy_value, 1, sheet_length)

    const res = {
      product_id,
      product_name,
      ins_fee,
      ins_fee_with_discount,
      forfeit_fee
      }
    let cell_P = 0
    let sheet = _.map(forfeit_fee, (val, idx) => {
      const cell_H = policy_value[idx] * ins_amount
      const cell_L = _.round(Math.max((ins_rate_stated - ins_rate), 0) * cell_H, 0)
      const cell_AI = abar[idx]
      const cell_O = ((age===15&&idx!=0)?0:(idx==0?_.round(10000*cell_L/cell_AI,0):_.round(10000*(cell_L+_.round(_.round((cell_P)/10000*cell_AI,0)*Math.max(ins_rate_stated-ins_rate,0),0))/cell_AI,0)))
      cell_P = cell_P + cell_O
      const cell_Q = _.round( cell_P / 10000 * cell_AI, 0 )
      const sheet_payload = {
        age: age + idx,
        forfeit_fee: forfeit_fee[idx] + cell_Q,
        guarantee_rate: _.round((forfeit_fee[idx] + cell_Q)/ins_fee * 100, 2),
        guarantee_rate_with_discount: _.round((forfeit_fee[idx] + cell_Q)/ins_fee_with_discount * 100, 2)
      }
      return sheet_payload
    })
    resolve({
      status,
      ins_fee,
      ins_fee_with_discount,
      sheet
    })

  })
}

const isNumeric = (value) => {
  return /^\d+$/.test(value)
}



