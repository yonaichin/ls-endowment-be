import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(bodyParser.json())

const _PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Leishan Endowment API' })
})
app.listen(_PORT, () => {
  console.log(`Server in up and running on http://localhost:${_PORT}`)
})
