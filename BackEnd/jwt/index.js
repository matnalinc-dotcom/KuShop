import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import memberRoute from './routes/memberRoute.js'
import productRoute from './routes/productRoute.js'
import cartRoute from "./routes/cartRoute.js"

import swaggerUI from "swagger-ui-express"
import yaml from "yaml"
import fs from "fs"

dotenv.config()

const app = express()
const port = process.env.PORT || 3000


app.use(cors({
  origin: [
    'http://localhost', 
    'http://127.0.0.1',
    'http://localhost:5173', 
    'http://127.0.0.1:5173',
    'http://localhost:4173', 
    'http://127.0.0.1:4173'
  ],  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))

app.use("/img_pd", express.static("img_pd"))
app.use("/img_mem", express.static("img_mem"))

app.use(bodyParser.json())
app.use(cookieParser())

app.use('/members', memberRoute)
app.use('/products', productRoute)
app.use('/carts', cartRoute)

const swaggerfile = fs.readFileSync('services/swagger.yaml', 'utf-8')
const swaggerDoc = yaml.parse(swaggerfile)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc))

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})