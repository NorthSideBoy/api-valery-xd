import * as dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import {router} from  "./routes/querys.js"
import { dbConnect } from './config/databases/mongo.js'
const app = express()
dotenv.config()
const port = process.env.PORT || 3500



app.use(cors())
app.use(express.json())
app.use(express.static('images'))

dbConnect()

app.listen (port, () =>
    {
        console.log("Server on port:" + port)
    })

app.use("/querys", router)