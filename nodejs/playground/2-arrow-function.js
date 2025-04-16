// const square = function (x) {
//     return x * x
// }

// const square = (x) => {
//     return x * x
// }

// const square = (x) => x * x

// console.log(square(3))

const event = {
    name: 'Birthday Party',
    guestList: ['Ritesh', 'Gaurav', 'Giridhar'],
    printGuestList () {
        console.log('Guest list for ' + this.name)
        this.guestList.forEach(element => {
            console.log(element + ' is attending ' + this.name)
        });
    }
}

event.printGuestList()