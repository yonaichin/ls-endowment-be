import Module from '../modules'

import { HTTPLogger } from '../utils'

export const postProduct = (req, res) => {
  HTTPLogger(req)
  const { product_id } = req.params
  const { birthday,
          gender,
          ins_amount,
          ins_payment_period }  = req.body
  const payload = { birthday, gender, ins_amount, ins_payment_period }
  const module = new Module(product_id, payload)
  module.get().then(
    (payload) => {
      res.status(200).json(payload)
    },
    (err) => {
      res.status(400).json(err)
    }
  )
}
