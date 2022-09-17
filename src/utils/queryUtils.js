import { processDateTime, calculatePriceAndCost } from './dataUtils.js'
import { executeQuery, executeQueryJSON } from '../config/databases/firebird.js'
import { privateDecrypt } from 'crypto'

async function processDataQuery(order, callback)
    {
        const ssql_rate = `SELECT * FROM MONEDA`
        await executeQueryJSON (ssql_rate, function(err, result){
            if(err)
                {
                    console.log(err)
                }
            else
                {
                    const dateTime = order.updatedAt
                    let date
                    let time
                    let rate
                    let rateName
                    let price
                    let cost
                    let dni
                    let nameUser
                    let cuantityProducts
                    let phoneUser
                    let email
                    processDateTime(dateTime, function (dateProcessed, timeProcessed){
                        date = dateProcessed
                        time = timeProcessed
                    })
                    try
                        {
                            result.forEach(element => {
                                if(element.NOMBRE == 'ORINOCO')
                                    {
                                        rate = element.FACTOR
                                        rateName = element.NOMBRE
                                    }
                                else
                                    {
                                        console.log("buscando")
                                    }
                            })

                            if(rateName !== 'ORINOCO')
                                {
                                    throw "Por favor inserte la moneda ORINOCO y su respectiva tasa de cambio al bolivar"
                                }
                            else
                                {
                                    console.log('se ha encontrado')
                                }
                        }
                    catch(e)
                        {
                            console.log(e)
                        }    
                    calculatePriceAndCost(order.price, rate, 20, function(pricePrOcessed, costProcessed){
                        price = pricePrOcessed
                        cost = costProcessed
                    })

                    dni = (order.user[0].dni).split("-")[1]
                    nameUser = order.user[0].fullName
                    cuantityProducts = order.pedido[0].totalProductos
                    phoneUser = order.user[0].phone
                    email = order.user[0].email
                    let OBJECT_PRS_INPUT = {
                                CLIENTE_CODIGO: dni,
                                CLIENTE_NOMBRE: nameUser,
                                CLIENTE_TELEFONOS: phoneUser,
                                CLIENTE_CORREOS_E: email,
                                CLIENTE_RIF: dni,
                                TOTAL_CANTIDAD_ITEMS: cuantityProducts, 
                                TOTAL_ITEMS: cuantityProducts,
                                TOTAL_CANCELADO: price,
                                TOTAL_BRUTO_LINEAS: price,
                                TOTAL_NETO_LINEAS: price,
                                TOTAL_LINEAS: price,
                                TOTAL_NETO: price,
                                TOTAL_OPERACION: price,
                                TOTAL_EXENTO_LINEAS: price,
                                TOTAL_EXENTO: price,
                                TOTAL_BASE_IMP_IMP_CONSUMO_LIN: price, 
                                TOTAL_BASE_IMP_IMP_CONSUMO: price,
                                TOTAL_COSTO: cost,
                                TOTAL_COSTO_PROMEDIO: cost, 
                                TOTAL_COSTO_IMP: cost,
                                TOTAL_COSTO_PROMEDIO_IMP: cost,
                                FECHA_RECEPCION_RTP: date,
                                FECHA_HORA_IMPRESION: `${date} ${time}`,
                                FECHA_Y_HORA: `${date} ${time}`,
                                FECHA_HORA_REGISTRO: `${date} ${time}`,
                                MONEDA_CODIGO: 1,
                                CONTADO: 0
                            }
                        return callback(OBJECT_PRS_INPUT)
                    
                }
        })
        

        
    //     // const rate = 8.14
    //     // const priceSale = order.price * tasa
    //     // const priceSaleFix = priceSale.toFixed(3)
    //     // let percent = null
    //     // const priceCost = "falta calcular costos"
    //     // const data = moment(order.updatedAt).format("DD/MM/YYYY/LTS")
    //     // const datos = data.split("/")
    //     // const time = moment(datos[3], ["h:mm:ss A"]).format("HH:mm:ss")
    //     // const date = `${datos[0]}/${datos[1]}/${datos[2]}`
    //     // const dni = order.user[0].dni
    //     // const dniFix = dni.split("-")
    //     // const cedula = dniFix[1]
    //     // percentCalculator(50, 25, function(resultado){
    //     //     porcentaje = resultado
    //     // })

    //     const OBJECT_PRS_INPUT = {
    //         CLIENTE_CODIGO: cedula,
    //         CLIENTE_NOMBRE: order.user[0].fullName,
    //         CLIENTE_TELEFONOS: order.user[0].phone,
    //         CLIENTE_CORREOS_E: order.user[0].email,
    //         CLIENTE_RIF: cedula,
    //         TOTAL_CANTIDAD_ITEMS: parseFloat((order.pedido[0].totalProductos).toFixed(3)),
    //         TOTAL_ITEMS: order.pedido[0].totalProductos,
    //         TOTAL_CANCELADO: priceSaleFix,
    //         TOTAL_BRUTO_LINEAS: priceSaleFix,
    //         TOTAL_NETO_LINEAS: priceSaleFix,
    //         TOTAL_LINEAS: priceSaleFix,
    //         TOTAL_NETO: priceSaleFix,
    //         TOTAL_OPERACION: priceSaleFix,
    //         TOTAL_EXENTO_LINEAS: priceSaleFix,
    //         TOTAL_EXENTO: priceSaleFix,
    //         TOTAL_BASE_IMP_IMP_CONSUMO_LIN: priceSaleFix,
    //         TOTAL_BASE_IMP_IMP_CONSUMO: priceSaleFix,
    //         TOTAL_COSTO: priceCost,
    //         TOTAL_COSTO_PROMEDIO: priceCost,
    //         TOTAL_COSTO_IMP: priceCost,
    //         TOTAL_COSTO_PROMEDIO_IMP: priceCost,
    //         FECHA_RECEPCION_RTP: fecha,
    //         FECHA_HORA_IMPRESION: `${fecha} ${hora}`,
    //         FECHA_Y_HORA: `${fecha} ${hora}`,
    //         FECHA_HORA_REGISTRO: `${fecha} ${hora}`,
    //         MONEDA_CODIGO: 1,
    //         CONTADO: 0
    //     }

    //     const OBJECT_PRS_OUTPUT = {
    //         TOTAL_CANTIDAD_ITEMS: OBJECT_PRS_INPUT.TOTAL_CANTIDAD_ITEMS,
    //         TOTAL_ITEMS: OBJECT_PRS_INPUT.TOTAL_ITEMS,
    //         CORRELATIVO: 3,
    //         DOCUMENTO: 3,
    //         CLIENTE_CODIGO: OBJECT_PRS_INPUT.CLIENTE_CODIGO,
    //         CLIENTE_NOMBRE: OBJECT_PRS_INPUT.CLIENTE_NOMBRE,
    //         CLIENTE_TELEFONOS: OBJECT_PRS_INPUT.CLIENTE_TELEFONOS,
    //         CLIENTE_CORREOS_E: OBJECT_PRS_INPUT.CLIENTE_CORREOS_E,
    //         CLIENTE_ZONA: 1,
    //         CLIENTE_RIF: OBJECT_PRS_INPUT.CLIENTE_RIF, 
    //         MONEDA_CODIGO: OBJECT_PRS_INPUT.MONEDA_CODIGO,
    //         FACTOR_CAMBIO: 1,
    //         DEPOSITO_CODIGO: 3,
    //         VENDEDOR_CODIGO: 3,
    //         RETENCION: 3,
    //         CONTADO: OBJECT_PRS_INPUT.CONTADO,
    //         CREDITO: 3,
    //         ANTICIPO: 3,
    //         TOTAL_CANCELADO: OBJECT_PRS_INPUT.TOTAL_CANCELADO,
    //         VUELTO: 3,
    //         TOTAL_BRUTO_LINEAS: OBJECT_PRS_INPUT.TOTAL_BRUTO_LINEAS,
    //         TOTAL_DESCUENTO_LINEAS: 3,
    //         TOTAL_NETO_LINEAS: OBJECT_PRS_INPUT.TOTAL_NETO_LINEAS,
    //         TOTAL_IMPUESTO_LINEAS: 3,
    //         TOTAL_LINEAS: OBJECT_PRS_INPUT.TOTAL_LINEAS,
    //         DESCUENTO_1: 3,
    //         DESCUENTO_2: 3,
    //         FLETE: 3,
    //         TOTAL_NETO: OBJECT_PRS_INPUT.TOTAL_NETO,
    //         IMPUESTO: 3,
    //         TOTAL_IMPUESTO_MUNICIPAL: 3,
    //         TOTAL_IMPUESTO_ADICIONAL: 3,
    //         TOTAL_OPERACION: OBJECT_PRS_INPUT.TOTAL_OPERACION,
    //         TOTAL_BASE_IMPONIBLE_LINEAS: 3,
    //         TOTAL_IMPUESTO_FISCAL_LINEAS: 3,
    //         TOTAL_EXENTO_LINEAS: OBJECT_PRS_INPUT.TOTAL_EXENTO_LINEAS,
    //         TOTAL_BASE_IMPONIBLE: 3,
    //         TOTAL_IMPUESTO_FISCAL: 3,
    //         TOTAL_EXENTO: OBJECT_PRS_INPUT.TOTAL_EXENTO,
    //         TOTAL_COSTO: OBJECT_PRS_INPUT. TOTAL_COSTO,
    //         TEMPORAL: "F",
    //         ASIGNAR_COSTO: 3,
    //         TOTAL_COSTO_PROMEDIO: OBJECT_PRS_INPUT.TOTAL_COSTO_PROMEDIO,
    //         TOTAL_RETENCION_IVA: 3,
    //         PORC_RETENCION_IVA: 3,
    //         CONTROL_INTERNO: 3,
    //         TOTAL_IMPUESTO_AL_LICOR: 3,
    //         FECHA_RECEPCION_RTP: OBJECT_PRS_INPUT.FECHA_RECEPCION_RTP,
    //         FECHA_HORA_IMPRESION: OBJECT_PRS_INPUT.FECHA_HORA_IMPRESION ,
    //         FECHA_Y_HORA: OBJECT_PRS_INPUT.FECHA_Y_HORA,
    //         FECHA_HORA_REGISTRO: OBJECT_PRS_INPUT.FECHA_HORA_REGISTRO,
    //         TOTAL_COSTO_IMP: OBJECT_PRS_INPUT.TOTAL_COSTO_IMP,
    //         TOTAL_COSTO_PROMEDIO_IMP: OBJECT_PRS_INPUT.TOTAL_COSTO_PROMEDIO_IMP,
    //         TOTAL_RETENCION_ADIC: 3,
    //         TOTAL_RETENCION_MUNICIPAL: 3,
    //         TOTAL_RETENCIONES: 3,
    //         NOTA_CREDITO: 3,
    //         TOTAL_BASE_IMP_IMP_CONSUMO_LIN: OBJECT_PRS_INPUT.TOTAL_BASE_IMP_IMP_CONSUMO_LIN,
    //         TOTAL_IMP_CONSUMO_LINEAS: 3,
    //         TOTAL_BASE_IMP_IMP_CONSUMO: OBJECT_PRS_INPUT.TOTAL_BASE_IMP_IMP_CONSUMO,
    //         TOTAL_IMP_CONSUMO: 3,
    //         TIPO_CLIENTE: 3,
    //         EXONERADA: 3,
    //         PERCIBIDO: 3,
    //         TOTAL_IGTF: 3,
    //         CREDITO_IGTF: 3
    //     }
    }

export { processDataQuery }