import express from 'express'

const Router = express.Router()

Router.get('/', (req, res) => {
  res.status(200).json({ message: 'api index'})
})

export default Router
