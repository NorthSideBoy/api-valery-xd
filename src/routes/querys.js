import express from "express"
const router = express.Router()
import {query_1, query_2, query_10} from '../controllers/querys.js'

router.post("/query_1", query_1)

router.post("/query_10", query_10)

router.post("/query_2", query_2)

export {router}