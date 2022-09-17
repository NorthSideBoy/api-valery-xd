import mongoose from "mongoose";
import * as dotenv from 'dotenv'
dotenv.config()

const DB_URI = process.env.DB_URI

export async function dbConnect() {
    return mongoose.connect(DB_URI)
    .then(() => {
        console.log("**** CONEXION CORRECTA ****")
    })
    .catch((err) => {
        console.log("**** ERROR AL CONECTAR ****", err)
    })
}

export async function dbDisconnect(){
    return mongoose.disconnect()
}