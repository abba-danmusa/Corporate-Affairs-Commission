import { $ } from './bling'
import DOMPurify from 'dompurify'

export default class Chat {
    constructor() {
        this.openedYet = false
        this.businessWrapper = $('#businesses-wrapper')
        this.openBtn = $('.open-btn')
        this.injectHTML()
        this.businessLog = $('#business')
        this.businessForm = $('#businessForm')
        this.regNumberField = $('#regNumberField')
        this.events()
    }

    // events 
    events() {
        this.businessForm.on('submit', (e) => {
            e.preventDefault()
            this.sendMessageToServer()
        })
        this.openBtn.on('click', () => this.showBusinesseslog())
    }

    // methods
    sendMessageToServer() {
        this.socket.emit('chatMessageFromBrowser', {
            message: this.regNumberField.value
        })
        this.businessLog.insertAdjacentHTML('beforeend', DOMPurify.sanitize(`
            <div class="business"> 
                <table>
                    <tr>
                        <td>
                            ${this.regNumberField.value}    
                        </td>
                    </tr>
                </table>
            </div>
        `))
        this.businessLog.scrollTop = this.businessLog.scrollHeight
        this.regNumberField.value = ''
        this.regNumberField.focus()
    }

    displayMessageFromServer(data) {
        this.businessLog.insertAdjacentHTML('beforeend',
            DOMPurify.sanitize(`
            <div class="business"> 
                <table>
                    <tr>
                        <td>
                            ${data.userName}    
                        </td>
                        <td>
                            ${data.message}
                        </td>
                    </tr>
                </table>
            </div>
        `))
        this.chatLog.scrollTop = this.chatLog.scrollHeight
    }

    showBusinesseslog() {
        if (!this.openedYet) {
            this.openConnection()
        }
        this.openedYet = true
        this.businessWrapper.classList.add('log--visible')
    }
    openConnection() {
        alert('opened')
        this.socket = io()
        this.socket.on('welcome', data => {
            this.userName = data.userName
            this.name = data.name
        })
        this.socket.on('chatMessageFromServer', (data) => {
            this.displayMessageFromServer(data)
        })
    }

    injectHTML() {
        this.businessWrapper.innerHTML = `<div id='business'></div><form id='businessForm' action='/' method='POST'><input id='regNumberField' type='text'><input type='submit'></form>
        `
    }
}