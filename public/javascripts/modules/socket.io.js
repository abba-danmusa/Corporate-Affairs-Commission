import { $, $$ } from './bling'

export default class Socket {
    constructor() {
        this.table = $('#table')
        this.openConnection()
    }

    // events 

    // methods
    openConnection() {
        this.socket = io()
        this.socket.on('welcome', data => {
            this.userName = data.userName
        })

        this.socket.on('output', data => {
            console.log('hello')
            console.log(data)
            if (data.length) {
                data.forEach(item => {
                    this.displayDetails(item)
                })
            }
        })
    }

    displayDetails(data) {
        let tableRow = document.createElement('tr')
        tableRow.classList.add('business')
        let business = `
            <td>${data.regNumber}</td>
            <td>${data.businessName}</td>
            <td>${data.natureOfBusiness}</td>
            <td>${data.state}</td>
            <td>${data.dateOfReg}</td>
        `
        tableRow.appendChild(business)
        this.table.insertAdjacentHTML('beforeend', tableRow)
    }
}