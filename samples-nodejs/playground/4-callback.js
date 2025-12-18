// setTimeout(() => {
//     console.log('Two second are up')
// }, 2000)

// const names = ['Ritesh', 'Jen', 'Jess']
// const shortName = names.filter((name) => {
//     return name.length <= 4
// })

// const geocode = (address, callback) => {
//     setTimeout(() => {
//         const data = {
//             latitide: 0,
//             longitude: 0
//         }
//         callback(data)
//     }, 2000)
// }

// geocode('Bengaluru', (data) => {
//     console.log(data)
// })


// const add = (first, second, callback) => {
//     setTimeout(() =>{
//         result = first + second
//         callback(result)
//     }, 2000)
// }

// add(1, 4, (sum) => {
//     console.log(sum) // Should print: 5
// })

const doWorkCallback = (callback) => {
    setTimeout(() => {
        //callback('This is my error', undefined)
        callback(undefined, [1, 4, 7])
    }, 2000)
}

doWorkCallback((error, result) => {
    if (error){
        return console.log(error)
    }

    console.log(result)
})