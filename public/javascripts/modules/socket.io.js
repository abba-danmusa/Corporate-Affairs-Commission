import { $, $$ } from './bling'
import axios from 'axios'

export default class Socket {
    constructor() {
        this.table = $('#table')
        this.flashStatus = $('.status')
        this.form = $('#businessDetailsForm')
        this.regNumber = $('.regNumber')
        this.businessName = $('.businessName')
        this.businessAddress = $('.businessAddress')
        this.state = $('.state')
        this.dateOfReg = $('.dateOfReg')
        this.natureOfBusiness = $('.natureOfBusiness')
        this.proprietor1 = $('.proprietor1')
        this.proprietor2 = $('.proprietor2')
        this.proprietor3 = $('.proprietor3')
        this.author = $('.author')
        this.file = $('.file')

        // Calls for the event methods to execute on submit of the form
        // this.events()

        // Calls for the open connection method
        this.openConnection()
    }

    // events
    events() {

        if (this.form) {
            this.form.on('submit', (e) => {
                e.preventDefault()
                    // this.formData = new FormData()
                    // this.formData.append('file', this.file.files[0])
                console.log(file)
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
        // console.log(file)
        this.socket.emit('input', {
            regNumber: this.regNumber.value,
            businessName: this.businessName.value,
            businessAddress: this.businessAddress.value,
            state: this.state.value,
            dateOfReg: this.dateOfReg.value,
            natureOfBusiness: this.natureOfBusiness.value,
            proprietors: [this.proprietor1.value, this.proprietor2.value, this.proprietor3.value],
            author: this.author.value,
            file: this.file.files[0].name
        })
        this.regNumber.value = ''
        this.businessName.value = ''
        this.natureOfBusiness.value = ''
        this.businessAddress.value = ''
        this.proprietor1.value = ''
        this.proprietor2.value = ''
        this.proprietor3.value = ''
        this.dateOfReg.value = ''
            // this.file.value = ''
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
                this.flashStatus.style.borderColor = 'green'
                this.flashStatus.innerText = successMessage
                setTimeout(() => {
                    this.flashStatus.style.display = 'none'
                }, 7000)
            }
        })

        this.socket.on('error', errorMessage => {
            if (this.flashStatus) {
                this.flashStatus.style.display = 'block'
                this.flashStatus.style.borderColor = 'red'
                if (errorMessage.message) {
                    this.validationErrors = errorMessage.message
                } else if (errorMessage.keyValue) {
                    this.duplicateErrors = errorMessage.keyValue.regNumber ? 'Registration Number; ' + errorMessage.keyValue.regNumber + ' already exist' : 'Business Name; ' + errorMessage.keyValue.businessName + ' already exist'
                }
                this.flashStatus.innerText = this.validationErrors || this.duplicateErrors
                setTimeout(() => {
                    this.flashStatus.style.display = 'none'
                }, 10000)
            }
        })

    }

    displayError(err) {
        this.flashStatus.style.display = 'block'
        this.flashStatus.innerText = err
    }

    displayDetails(data) {
        [this.date] = data.dateOfReg.split('T')
        let tableRow = `
        <tr>
            <td><div class='pointer'></div></td>
            <td>${data.regNumber}</td>
            <td>${data.businessName}</td>
            <td>${data.natureOfBusiness}</td>
            <td>${data.state}</td>
            <td>${this.date}</td>
        </tr>
        `
        this.table.insertAdjacentHTML('afterbegin', tableRow)
            // setTimeout(() => {
            //     this.pointer = $('.pointer')
            //     if (this.pointer)
            //         this.pointer.style.visibility = 'hidden'
            // }, 90000)
    }
}