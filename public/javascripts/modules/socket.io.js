import { $, $$ } from './bling'
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
        this.adminTable = $('.admin__table')

        // // Calls for the event methods to execute on submit of the form
        // this.events()

        // Calls for the open connection method
        this.openConnection()
    }

    // events
    events() {

        if (this.form) {
            this.form.on('submit', (e) => {
                // prevents the default submitting of the form data
                e.preventDefault()

                // send the details to socket
                this.sendDetails()

                // this.formData = new FormData()
                // this.formData.append('file', this.file.files[0])
                // console.log(file)
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

        // console.log(this.file.fi)
        this.socket.emit('input', {
            regNumber: this.regNumber.value,
            businessName: this.businessName.value,
            businessAddress: this.businessAddress.value,
            state: this.state.value,
            dateOfReg: this.dateOfReg.value,
            natureOfBusiness: this.natureOfBusiness.value,
            proprietors: [this.proprietor1.value, this.proprietor2.value, this.proprietor3.value],
            author: this.author.dataset.id,

            // file: this.file.files[0].name
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
            // this.socket.on('connect', () => {
            //     console.log(this.socket.id)
            // })
            // this.socket.on('welcome', user => {
            //     console.log(user)
            // })
        this.socket.on('output', data => {
            if (data.length && this.adminTable) {
                data.forEach(item => {
                    this.displayDetails(item)
                })
            }
        })
        this.socket.on('document', data => {

            if (this.table && ((this.table.dataset.id == data[0].queuedTo) || (this.adminTable))) {
                data.forEach(item => {
                    this.displayDetails(item)
                })
                this.untreatedToday = $('.untreatedToday')
                this.totalReceived = $('.totalReceived')
                this.totalUntreated = $('.totalUntreated')
                this.untreatedToday.innerHTML = parseInt(this.untreatedToday.innerHTML) + 1
                this.totalReceived.innerHTML = parseInt(this.totalReceived.innerHTML) + 1
                this.totalUntreated.innerHTML = parseInt(this.totalUntreated.innerHTML) + 1
            } else return
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
                    <td>${data.regNumber}</td>
                    <td>${data.businessName}</td>
                    
                    <td>${data.state}</td>
                    <td>${this.date}</td>
                    <td style='font-size: 12px; color:${data.isTreated == true ? 'green' : 'brown'};'>${data.isTreated == true ? 'TREATED' : 'UNTREATED'}</td>
                    <td><a href='/admin/business/${data.slug}/${data._id}' style='color:white;background-color: #1c330d; padding: 4px;'>VIEW</a></td>
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