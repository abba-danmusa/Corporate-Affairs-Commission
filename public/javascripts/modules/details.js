import { $ } from './bling'

export default class Socket {
    constructor() {
        this.form = $('#businessDetailsForm')
        this.regNumber = $('.regNumber')
        this.businessName = $('.businessName')
        this.dateOfReg = $('.dateOfReg')
        this.natureOfBusiness = $('.natureOfBusiness')
        this.state = $('.state')
        this.details = $('#myTable')
        this.events()
        this.openConnection()
    }

    // events
    events() {
        this.form.on('submit', e => {
            e.preventDefault()
            this.sendDetailsToServer()
        })
    }

    // Methods
    openConnection() {
        this.socket = io()
        this.socket.on('welcome', data => {
            this.userName = data.userName
        })

        // collect details from server when a user saves data
        this.socket.on('detailsFromServer', (data) => {
            this.displayDetailsFromServer(data)
            if (data.length) {
                for (let x = 0; x < data.length; x++) {}
            }
        })
    }

    displayDetailsFromServer(data) {
        let businesses = document.createElement('tr')
        businesses.innerHTML = `
            <tr>
            <td>${data.regNumber}</td>
            <td>${data.businessName}</td>
            <td>${data.natureOfBusiness}</td>
            <td>${data.state}</td>
            <td>${data.dateOfReg}</td>
        `
        this.details.appendChild(businesses)
            // this.details.insertAdjacentHTML('beforeend', `
            //     <div>${data.regNumber}</div>
            //     <p>sent by ${data.userName}</p> 
            // `)
    }

    sendDetailsToServer() {
        this.socket.emit('detailsFromBrowser', { regNumber: this.regNumber.value })
        this.details.insertAdjacentHTML('beforeend', `
            <div>${this.regNumber.value}</div>
            <p>sent by ${this.userName}</p>
        `)
    }
}