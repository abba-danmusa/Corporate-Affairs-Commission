import { $, $$ } from './bling'

export default class Socket {
    constructor() {
        this.table = $('#table')
        this.form = $('#businessDetailsForm')
        this.regNumber = $('.regNumber')
        this.businessName = $('.businessName')
        this.state = $('.state')
        this.dateOfReg = $('.dateOfReg')
        this.natureOfBusiness = $('.natureOfBusiness')
        this.proprietor = [$$('.proprietor')]
        this.openConnection()
        this.events()
    }

    // events
    events() {
        this.form.on('submit', (e) => {
            e.preventDefault()
            this.sendDetails()
        })
        this.regNumber.value = ''
        this.businessName = ''
        this.natureOfBusiness = ''
        this.state = ''
        this.proprietor = ''
        this.dateOfReg = ''
    }

    // methods
    sendDetails() {
        this.socket.emit('input', {
            regNumber: this.regNumber.value,
            businessName: this.businessName.value,
            state: this.state.value,
            dateOfReg: this.dateOfReg.value,
            natureOfBusiness: this.natureOfBusiness.value,
            proprietor: this.proprietor.value
        })
    }
    openConnection() {
        this.socket = io()
        this.socket.on('welcome', data => {
            this.userName = data.userName
        })

        this.socket.on('output', data => {

            if (data.length) {
                data.forEach(item => {
                    this.displayDetails(item)
                })
            }
        })
        this.socket.on('document', data => {
            console.log(data)
            this.displayDetails(data)
        })
    }

    displayDetails(data) {
        let tableRow = `
        <tr>
        <td>${data.regNumber}</td>
        <td>${data.businessName}</td>
        <td>${data.natureOfBusiness}</td>
        <td>${data.state}</td>
        <td>${data.dateOfReg}</td>
        </tr>
        `
        this.table.insertAdjacentHTML('beforeend', tableRow)
    }
}