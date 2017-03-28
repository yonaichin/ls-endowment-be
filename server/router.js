import express from 'express'

import { postProduct } from '../controllers/product'

const Router = express.Router()

Router.get('/', (req, res) => {
  res.status(200).json({ message: 'api index'})
})

const productRoute = Router.route('/product/:product_id')
productRoute.post(postProduct)

export default Router
