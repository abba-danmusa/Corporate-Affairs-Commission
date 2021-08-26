import { $, $$ } from './modules/bling'
import Socket from './modules/socket.io'
import typeAhead from './modules/typeAhead'
import search from './modules/adminSearch'
import post from './modules/post.io'

// document.addEventListener('DOMContentLoaded', () => {
//     FilePond.registerPlugin(
//         // FilePondPluginImageResize,
//         // FilePondPluginImagePreview,
//         FilePondPluginFileEncode,
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

//     FilePond.create($('file'), {
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

const totalTasks = $('.totalTasks')
const treatedTasks = $('.treatedTasks')
const pendingsTasks = $('.pendingsTasks')

const totalButton = $('.total')
const treatedButton = $('.treated')
const pendingButton = $('.pendings')

totalButton.on('click', () => {
    const block = totalTasks.style.display
    if (block == '') {
        return
    }
    pendingsTasks.style.display = 'none'
    treatedTasks.style.display = 'none'
    totalTasks.style.display = ''
})
treatedButton.on('click', () => {
    totalTasks.style.display = 'none'
    pendingsTasks.style.display = 'none'
    treatedTasks.style.display = ''
})
pendingButton.on('click', () => {
    totalTasks.style.display = 'none'
    treatedTasks.style.display = 'none'
    pendingsTasks.style.display = ''
})

const shareButton = $('.share__button')
shareButton.on('click', () => {
    alert('You are about to distribute this user task queue to all other user. click okay to continue, or cancel to cancel')
})

typeAhead($('.search__user'))
search($('.search__admin'))
post()