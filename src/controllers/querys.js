import {executeQuery, executeQueryBlob, executeQueryJSON, newExecuteQuery} from '../config/databases/firebird.js'
import * as fs from 'fs'
import Orders from '../models/orders.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { orderNumbers, percentCalculator} from '../utils/dataUtils.js'
import { processDataQuery } from '../utils/queryUtils.js'
dotenv.config()
const url = process.env.PUBLIC_URL



const query_1 = (req, res) => 
    {
        const ssql = `SELECT P.CODIGO_PRODUCTO, P.NOMBRE, PTF.IMAGEN FROM PRODUCTOS as P INNER JOIN PRODUCTOS_TERMINADOS_FOTO as PTF ON P.CODIGO_PRODUCTO = PTF.PRODUCTO_CODIGO WHERE P.CODIGO_PRODUCTO = ${req.body.codigo}`
        executeQueryBlob(ssql, function(err, result, buffer)
            {
                if(err)
                    {
                        console.log(err)
                        res.status(400).json(err)
                    }
                else
                    {
                        if (result == null || result == undefined)
                            {
                                const ssql400 =  `SELECT P.CODIGO_PRODUCTO, P.NOMBRE FROM PRODUCTOS as P WHERE P.CODIGO_PRODUCTO = ${req.body.codigo}`
                                executeQuery(ssql400, function(err, result400)
                                    {
                                        if(result400[0] == undefined)
                                            {
                                                res.status(400).json({
                                                    error: "PRODUCT_NOT_FOUND"
                                                })
                                            }
                                        else
                                            {
                                                if(err)
                                                    {
                                                        console.log(err)
                                                        res.status(400).json(err)
                                                    }
                                                else
                                                    {
                                                        const image_not_found = `${url}/valery_default_400.png`
                                                        res.status(200).json({
                                                            codigo_producto: result400[0][0],
                                                            nombre_producto: result400[0][1],
                                                            imagen_producto: image_not_found
                                                        })
                                                    }
                                            }
                                    })
                            }
                        else
                            {
                                const filename = `${req.body.codigo}.jpg`
                                const pathStorage = `${url}/${filename}`
                                fs.readFile(`images/${filename}`, (err, data) => 
                                    {
                                        if(err)
                                            {
                                                fs.writeFile(`images/${filename}`, buffer, err => 
                                                    {
                                                        if (err) 
                                                            {
                                                                res.status(200).json(err)
                                                            } 
                                                        else 
                                                            {
                                                                console.log('El archivo se ha creado')
                                                                res.status(200).json({
                                                                    codigo_producto: result[0][0],
                                                                    nombre_producto: result[0][1],
                                                                    imagen_producto: pathStorage
                                                                })
                                                            }
                                                    })
                                            }
                                        else 
                                            {
                                                const compare = Buffer.compare(buffer, data)
                                                if (compare == 0)
                                                    {
                                                        console.log('No se ha reemplazado el archivo')
                                                        res.status(200).json({
                                                            codigo_producto: result[0][0],
                                                            nombre_producto: result[0][1],
                                                            imagen_producto: pathStorage
                                                        })
                                                    } 
                                                else 
                                                    {
                                                        fs.writeFile(`images/${filename}`, buffer, err => 
                                                            {
                                                                if (err) 
                                                                    {
                                                                        res.status(200).json(err)
                                                                    } 
                                                                else 
                                                                    {
                                                                        console.log('El archivo se ha reemplazado')
                                                                        res.status(200).json({
                                                                            codigo_producto: result[0][0],
                                                                            nombre_producto: result[0][1],
                                                                            imagen_producto: pathStorage
                                                                        })
                                                                    }
                                                            })
                                                    }
                                            }
                                    })
                            }        
                    }
                
            })
    }

const query_2 = (req, res) => {
    const ssql = `SELECT * FROM MONEDA`
    const xd = newExecuteQuery(ssql)
}

const query_10 = async (req, res) =>{
    
    const order = await Orders.findOne({_id: mongoose.Types.ObjectId("6320bc95dd3ab8543368d70d")})
    let input_prs_object
    processDataQuery (order, function(INPUT_PRS_OBJECT){
        console.log(input_prs_object)
    })

    // const ssql_correlativo = 'SELECT V.CORRELATIVO FROM VENTAS as V'
    // executeQuery(ssql_correlativo, function(err, result)
    //     {
    //         if(err)
    //             {
    //                 console.log(err)
    //             }
    //         else
    //             {
    //                 var correlativos = []
    //                 result.forEach(result => {
    //                    var data = result[0]
    //                    correlativos.push(data)
    //                 })
    //                 orderNumbers(correlativos, function(result)
    //                     {
    //                         res.status(200).json(result)
    //                     })                
    //             }
    //     })
         
    // const ssql = `SELECT * FROM VENTAS as V WHERE V.CORRELATIVO = ${req.body.id}`
    // executeQueryJSON(ssql, function(err, result){
    //     if(err)
    //         {
    //             console.log(err)
    //         }
    //     else
    //         {
    //             var xd = "ignorar"
    //             console.log(xd)
    //         }
    // })

    }
export {query_1, query_2, query_10}