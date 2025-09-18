const request = require('request')

const weatherdata = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=5ffed24e9a6a2488f553c24a0e0881f7&query='+ latitude +',' + longitude + '&units=m'
    request({url: url, json: true}, (error, { body }) => {
        if (error){
            callback('Unable to connect to weather service!', undefined)
        }else if (body.error){
            callback('Unable to find location. Try another search.', undefined)
        }else{
            callback(undefined, {
                data: body.current
            })
        }
    })
}

module.exports = weatherdata