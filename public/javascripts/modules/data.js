import { $, $$ } from './bling'
export default class Live {
    constructor() {
        this.openedYet = false
        this.live = $('#live')
        this.injectHTML()
            // this.tableRow = $('')
            // this.tableForm = $('')
        this.openConnection()
        this.events()
    }

    // Events
    events() {
        this.businessDetailsForm.on('submit', (e) => {
            e.preventDefault()
            this.sendMessageToServer()
        })
    }

    // Methods

    sendMessageToServer() {
        this.socket.emit('businessDetailsFromBrowser', {
                regNumber: this.regNumber.value,
                businessName: this.businessName.value,
                dateOfReg: this.dateOfReg.value,
                state: this.state.value,
                natureOfBusiness: this.natureOfBusiness.value,
                proprietors: this.proprietors.value
            })
            // this.tableRow.insertAdjacentHTML('beforeend', `

        // `)
        this.regNumber.value = ''
        this.businessName.value = ''
        this.dateOfReg = ''
        this.state = ''
        this.natureOfBusiness = ''
        this.proprietors = ''
    }

    connectSocket() {
        if ($('#live')) {
            if (!this.openedYet) {}
            this.openedYet = true

        }
        this.openConnection()
    }

    openConnection() {
        this.socket = io()
        this.socket.on('welcome', data => {
            this.name = data.name

        })
        this.socket.on('businessDetailFromServer', (data) => {
            alert(data.message)
            this.displayDetailsFromServer(data)
        })
    }

    displayDetailsFromServer(data) {
        this.tableRow.insertAdjacentHTML('beforeend', `<p>${data.regNumbera}</p>`)
    }

    injectHTML() {
        this.live.innerHTML = `
        <div> </div>
      `
    }
}