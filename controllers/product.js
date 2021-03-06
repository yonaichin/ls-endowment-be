import Module from '../modules'

import { HTTPLogger } from '../utils'

export const postProduct = (req, res) => {
  HTTPLogger(req)
  const { product_id } = req.params
  const { birthday,
          gender,
          ins_amount,
          ins_payment_period,
          ins_provider }  = req.body
  const payload = { birthday, gender, ins_amount, ins_payment_period }
  if ( ins_provider === undefined ||
       birthday === undefined ||
       gender === undefined ||
       ins_amount === undefined ||
       ins_payment_period === undefined )
    res.status(400).json({
      code: 'error',
      message: 'birthday, gender, ins_amount, ins_payment_period, ins_provider are requried in payload'
    })
  const product = `${ins_provider}_${product_id}`
  const module = new Module(product, payload)
  module.get().then(
    (payload) => {
      res.status(200).json(payload)
    },
    (err) => {
      res.status(400).json(err)
    }
  )
}
