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
import path from "path"
import { fileURLToPath } from "url"

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 3000

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))

app.use("/img_pd", express.static(path.join(__dirname, "img_pd")))
app.use("/img_mem", express.static(path.join(__dirname, "img_mem")))

app.use(bodyParser.json())
app.use(cookieParser())

app.use('/members', memberRoute)
app.use('/products', productRoute)
app.use('/carts', cartRoute)

const swaggerPath = path.join(__dirname, 'services', 'swagger.yaml')
if (fs.existsSync(swaggerPath)) {
  const swaggerfile = fs.readFileSync(swaggerPath, 'utf-8')
  const swaggerDoc = yaml.parse(swaggerfile)
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc))
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
