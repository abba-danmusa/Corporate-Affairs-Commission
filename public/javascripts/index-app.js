import { $, $$ } from './modules/bling'
import Socket from './modules/socket.io'
import typeAhead from './modules/typeAhead'
import search from './modules/adminSearch'
import supervisorSearch from './modules/supervisorSearch'

// document.addEventListener('DOMContentLoaded', () => {
//     FilePond.registerPlugin(
//         FilePondPluginFileEncode,
//         FilePondPluginImageResize,
//         FilePondPluginImagePreview,
//         FilePondPluginFileValidateType,
//         FilePondPluginFileValidateSize,
//         FilePondPluginFilePoster
//     )

//     FilePond.setOptions({
//         stylePanelAspectRatio: 40 / 100,
//         imageResizeTargetWidth: 100,
//         imageResizeTargetHeight: 50
//     })
//     FilePond.parse(document.body)
//     FilePond.maxFileSize = '60kb'

//     FilePond.create($('.file'), {
//         acceptedFileTypes: ['application/pdf'],
//         fileValidateTypeDetectType: (source, type) =>
//             new Promise((resolve, reject) => {
//                 // Do custom type detection here and return with promise

//                 resolve(type)
//             }),
//         FilePondPluginFileValidateSize: {
//             maxFileSize: '60kb'
//         }
//     })

// })

if (document.querySelector("#live")) {
    new Socket()
}

const markAsTreated = $('.mark')
if (markAsTreated) {
    const overlay = $('.overlay')
    markAsTreated.on('click', () => {
        overlay.style.width = '200px'
    })
    const cancel = $('.cancel')
    cancel.on('click', (event) => {
        event.preventDefault()
        overlay.style.width = '0px'
    })
}

const changeDate = $('#changeDate')
if (changeDate) {
    changeDate.on('click', function(e) {
        e.preventDefault()
        if (this.value == 'EDIT DATE') {
            $('.dateOfReg').setAttribute('name', '')
            $('#hide').style.display = 'none'
            $('#editDate').style.display = 'block'
            $('.editDateOfReg').setAttribute('name', 'dateOfReg')
            this.value = 'RESTORE DATE'
        } else if (this.value == 'RESTORE DATE') {
            $('.editDateOfReg').setAttribute('name', '')
            $('#editDate').style.display = 'none'
            $('#hide').style.display = 'block'
            $('.dateOfReg').setAttribute('name', 'dateOfReg')
            this.value = 'EDIT DATE'
        }
    })
}

// supervisor 
const totalTasks = $('.totalTasks')
const treatedTasks = $('.treatedTasks')
const pendingsTasks = $('.pendingsTasks')

// task queue table
const totalButton = $('.total__received')
const treatedButton = $('.treated')
const pendingButton = $('.pendings')

if (totalButton) {
    totalButton.on('click', () => {
        totalTasks.style.display = ''
        pendingsTasks.style.display = 'none'
        treatedTasks.style.display = 'none'
    })

}

if (treatedButton) {
    treatedButton.on('click', () => {
        treatedTasks.style.display = ''
        totalTasks.style.display = 'none'
        pendingsTasks.style.display = 'none'
    })

}

if (pendingButton) {
    pendingButton.on('click', () => {
        pendingsTasks.style.display = ''
        totalTasks.style.display = 'none'
        treatedTasks.style.display = 'none'
    })

}

const shareButton = $('.share__button')

if (shareButton) {
    shareButton.on('click', () => {
        alert('You are about to distribute this user task queue to all other user. click okay to continue, or cancel to cancel')
    })

}

typeAhead($('.search__user'))
search($('.search__admin'))
supervisorSearch($('.search__supervisor'))