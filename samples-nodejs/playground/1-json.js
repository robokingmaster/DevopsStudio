const fs = require('fs');

// const book = {
//     title: 'Ego is the enemy',
//     auther: 'Ryan Holiday'
// }

// const bookJSON = JSON.stringify(book)
// fs.writeFileSync('1-json.json', bookJSON)
// console.log(bookJSON)

// const parsedData = JSON.parse(bookJSON)
// console.log(parsedData.auther)

// Read from file
// const dataBuffer = fs.readFileSync('1-json.json')
// const dataJSON = dataBuffer.toString()
// const data = JSON.parse(dataJSON)

// console.log(data.title)

//// Challange

const dataBuffer = fs.readFileSync('1-json.json')
const dataJSON = dataBuffer.toString()
const data = JSON.parse(dataJSON)

data.name = 'Ritesh'
data.age = '36'

const modifiedJSON = JSON.stringify(data)
fs.writeFileSync('1-json.json', modifiedJSON)