import { $, $$ } from './bling'

const status = $('#status')
const messages = $('#messages')
const textArea = $('#textarea')
const userName = $('#userName')

function chat() {
    let statusDefault = status.textContent
    let setStatus = function(s) {
            if (s !== statusDefault) {
                let delay = setTimeout(function() {
                    setStatus(statusDefault)
                }, 4000)
            }
        }
        // Connect to socket.io
    const socket = io()

    // Check for connection
    if (socket !== undefined) {
        console.log('connected to socket.io')

        // Handle output
        socket.on('output', function(data) {
            console.log(data)
            if (data.length) {
                for (let x = 0; x < data.length; x++) {
                    let message = document.createElement('div')
                    message.setAttribute('class', 'chat-message')
                    message.textContent = data[x].name + ": " + data[x].message
                    messages.appendChild(message)
                    messages.insertBefore(message, messages.firstChild)
                }
            }
        })

        // Get status from server
        socket.on('status', function(data) {
            // Get message status
            setStatus((typeof data === 'object') ? data.message : data)
        })

        // Handle input
        textArea.on('keydown', function(event) {
            if (event.which == 13 && event.shiftkey == false) {
                // Emit to server input
                socket.emit('input', {
                    name: userName.value,
                    message: textArea.value

                })
                event.preventDefault()
            }
        })
    }

}
// Sets Default Status

export default chat