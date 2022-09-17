import moment from "moment"

function percentCalculator(number, percent, callback)
    {
        const resultado = number*(percent/100)
        return callback(resultado)
    }

function orderNumbers(array, callback)
    {
        Array.prototype.sortNumbers = function(){
            return this.sort(
                function(a,b){
                    return a-b
                }
            )
        }

        return callback(array.sortNumbers())
    }

function processDateTime(data, callback)
    {
        const format = moment(data).format("DD/MM/YYYY/LTS")
        const splitData = format.split("/")
        const time = moment(splitData[3], ["h:mm:ss A"]).format("HH:mm:ss")
        const date = `${splitData[0]}/${splitData[1]}/${splitData[2]}`
        return callback(date, time)
    }

function calculatePriceAndCost(price, rate, percent, callback)
    {
        percentCalculator(price, percent, function(result){
            let priceSale = parseFloat((price * rate).toFixed(3))
            let priceCost = parseFloat((priceSale - result).toFixed(3))
            return callback(priceSale, priceCost)
        })
    }

export { percentCalculator, orderNumbers, processDateTime, calculatePriceAndCost}