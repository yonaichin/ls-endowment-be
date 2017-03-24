import express from 'express'

import { postList } from '../controllers/list'

const Router = express.Router()

Router.get('/', (req, res) => {
  res.status(200).json({ message: 'api index'})
})

const listRoute = Router.route('/list')
listRoute.post(postList)

export default Router
