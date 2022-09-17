import Firebird from "node-firebird";

const dbOptions = {
    host: '0.0.0.0',
    port: 3050,
    database: 'C:\\Users\\Saidcito\\Desktop\\refactorizar\\VALERY\\VALERY\\database\\VALERY3POS.MDF',
    user: 'SYSDBA',
    password: 'masterkey',
    lowercase_keys: false,
    role: null,
    pageSize: 4096,
    pageSize: 4096,  
    retryConnectionInterval: 1000
}

function executeQuery(ssql, callback)
    {
        Firebird.attach(dbOptions, function(err, db)
            {
                if(err)
                    {
                        console.log(err)
                    }
                else
                    {
                        db.execute(ssql).then((err, result) => {
                            if(err)
                                {
                                    console.log(err)
                                }
                            else
                                {
                                    console.log(result)
                                }
                        })
                    }
            })
    }

async function newExecuteQuery(ssql){
    await Firebird.attach(dbOptions).then((xd)=> {
        console.log(xd)
    })
}
function executeQueryBlob(ssql, callback)
    {
        Firebird.attach(dbOptions, function(err, db) 
            {
                if (err) 
                    {
                        return callback(err, [])
                    }

                db.execute(ssql, function(err, result) 
                    {
                        if (err) 
                            {
                                return callback(err, [])
                            } 
                        else 
                            {
                                if(result[0] === undefined || result[0] === null)
                                    {
                                        return callback(result[0])
                                    }
                                else 
                                    {
                                        result[0][2](function(err, name, eventEmitter)
                                            {
                                                const buffers = []
                                                eventEmitter.on('data', function(chunk) 
                                                    {
                                                        buffers.push(chunk)
                                                    })
                                                eventEmitter.once('end', function() 
                                                    {
                                                        const buffer = Buffer.concat(buffers)
                                                        return callback(undefined, result, buffer)
                                                    })
                                            })
                                    }
                                db.detach()
                            }
                    })
            })
    }

function executeQueryJSON(ssql, callback)
    {
        Firebird.attach(dbOptions, function(err, db) 
            {
                if (err) 
                    {
                        return callback(err, []); 
                    }
                db.query(ssql, function(err, result) 
                    {            
                        db.detach()
                        if (err) 
                            {
                                return callback(err, [])
                            } 
                        else 
                            {
                                var resultQuery = []
                                result.forEach(object => {
                                    var keys = Object.keys(object)
                                    var values = [Object.values(object)]
                                    var stringsValues = []
                                    var row = []
                                    for (const obj in values)
                                        {
                                            for (const col in values[obj])
                                                {
                                                    if(values[obj][col] == null)
                                                        {
                                                            row.push('')
                                                        }
                                                    else
                                                        {
                                                            row.push(values[obj][col].toString()) 
                                                        }
                                                }
                                            stringsValues.push(row)
                                            row=[]
                                        }
                                    var i = 0
                                    var arrayValues = stringsValues[0]
                                    var resultsToPush = {}
                                    while(i < keys.length) {
                                        resultsToPush[keys[i]] = arrayValues[i]
                                        i++
                                    }
                                    resultQuery.push(resultsToPush)
                                })
                                return callback(undefined, resultQuery)
                            }
                    })
            })
    }
export {executeQuery, executeQueryJSON, executeQueryBlob, newExecuteQuery, dbOptions, Firebird};