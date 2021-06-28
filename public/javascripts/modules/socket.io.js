import { $, $$ } from './bling'

export default class Socket {
    constructor() {
        this.table = $('#table')
        this.flashStatus = $('.status')
        this.form = $('#businessDetailsForm')
        this.regNumber = $('.regNumber')
        this.businessName = $('.businessName')
        this.state = $('.state')
        this.dateOfReg = $('.dateOfReg')
        this.natureOfBusiness = $('.natureOfBusiness')
        this.proprietors = $('.proprietor')
        this.events()
        this.openConnection()
    }

    // events
    events() {
        if (this.form) {
            this.form.on('submit', (e) => {
                e.preventDefault()
                this.sendDetails()
                    // this.sanitizeData()
            })
        }
    }

    // methods

    sanitizeData() {
        this.regNumber.value.trim()
        this.businessName.value.trim()
        this.natureOfBusiness.value.trim()
        this.proprietors.value.trim()

        if (this.regNumber.value, this.businessName.value, this.natureOfBusiness.value, this.proprietors.value, this.dateOfReg.value, this.state.value == '' || typeof(this.regNumber.value, this.businessName.value, this.natureOfBusiness.value, this.proprietors.value) !== 'string') {
            this.regNumber.value == ''
            this.businessName.value == ''
            this.natureOfBusiness.value == ''
            this.state.value == ''
            this.proprietors.value == ''
            this.dateOfReg.value == ''
            this.flashStatus.style.display = 'block'
            this.flashStatus.innerText = 'Error: Details not saved, Please make sure the details are correct'
            setTimeout(() => {
                this.flashStatus.style.display = 'none'
            }, 10000);

            console.log('error')
            return
        } else {}
    }

    sendDetails() {
        this.socket.emit('input', {
            regNumber: this.regNumber.value,
            businessName: this.businessName.value,
            state: this.state.value,
            dateOfReg: this.dateOfReg.value,
            natureOfBusiness: this.natureOfBusiness.value,
            proprietors: this.proprietors.value
        })
        this.regNumber.value = ''
        this.businessName.value = ''
        this.natureOfBusiness.value = ''
        this.state.value = ''
        this.proprietors.value = ''
        this.dateOfReg.value = ''
    }
    openConnection() {
        this.socket = io()
        this.socket.on('welcome', data => {
            this.userName = data.userName
        })

        this.socket.on('output', data => {

            if (data.length && this.table) {
                data.forEach(item => {
                    this.displayDetails(item)
                })
            }
        })
        this.socket.on('document', data => {
            if (data.length && this.table) {
                data.forEach(item => {
                    this.displayDetails(item)
                })
            }
        })

        this.socket.on('success', successMessage => {
            if (this.flashStatus) {
                this.flashStatus.style.display = 'block'
                this.flashStatus.innerText = successMessage
                setTimeout(() => {
                    this.flashStatus.style.display = 'none'
                }, 7000)
            }
        })

        this.socket.on('error', errorMessage => {
            if (this.flashStatus) {
                this.flashStatus.style.display = 'block'
                this.flashStatus.innerText = errorMessage
                setTimeout(() => {
                    this.flashStatus.style.display = 'none'
                }, 7000)
            }
        })

        // this.socket.on('error', data => {
        //     if (data.length) {

        //         data.forEach(error => {
        //             this.displayError(error)
        //         })
        //     }
        // })

        // Sets default status
        // this.statusDefault = this.flashStatus.textContent

        // this.setStatus = function(s) {
        //     this.flashStatus = s
        //     if (s !== this.statusDefault) {
        //         this.delay = setTimeout(function() {
        //             this.setStatus(this.statusDefault)
        //         }, 5000)
        //     }
        // }

        // // Get status from server
        // this.socket.on('status', data => {
        //     // Get message status
        //     this.setStatus((typeof data == 'object') ? data.messsage : data)


        // })

    }

    displayError(err) {
        this.flashStatus.style.display = 'block'
        this.flashStatus.innerText = err
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
        this.table.insertAdjacentHTML('afterbegin', tableRow)
    }
}