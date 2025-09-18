const http = require('http')

const url = 'http://api.weatherstack.com/current?access_key=5ffed24e9a6a2488f553c24a0e0881f7&query=45,-75&units=m'

const request = http.request(url, (response) => {
    let data = ''
    response.on('data', (chunk) => {
        data = data + chunk.toString()
        console.log(chunk)
    })

    response.on('end', () => {
        const body = JSON.parse(data)
        console.log(body)
    })
})

request.on('error', (error) => {
    console.log('An Error', error)
})

request.end()