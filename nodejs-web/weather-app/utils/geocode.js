const request = require('request')

const geocode = (address, callback) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+ encodeURIComponent(address) +'.json?access_token=pk.eyJ1Ijoic2luZ2hpcHN0IiwiYSI6ImNraWhrcHZ2YjA4bGYycm13d2FkZ3N5OTYifQ.6oEDvhLGb1kJ_PELYGPRGw&limit=1'
    request({url: url, json: true}, (error, { body }) => {
        if (error){
            callback('Unble to connect to location services!', undefined)
        }else if (body.features.length === 0){
            callback('Unable to find location Try another search.', undefined)
        }else{
            callback(undefined, {
                longitude: body.features[0].center[0],
                latitude: body.features[0].center[1],                
                location: body.features[0].place_name
            })
        }
    })
}

module.exports = geocode