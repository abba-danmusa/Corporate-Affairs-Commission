import { $, $$ } from './modules/bling'
import Socket from './modules/socket.io'
import typeAhead from './modules/typeAhead'
import search from './modules/adminSearch'
import headUserSearch from './modules/headUserSearch'
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
const pendingButton = $('.total__pendings')

// if (totalButton) {
//     totalButton.on('click', () => {
//         totalTasks.style.display = ''
//         pendingsTasks.style.display = 'none'
//         treatedTasks.style.display = 'none'
//     })

// }

// tell if a user is regular or non regular
const selectUserType = $('#select')

if (selectUserType) {

    selectUserType.on('change', (event) => {

        const select = $$('.elementExist')
        if (event.target.value !== 'headUser') {

            select.forEach(element => element.remove())
        }

        if (event.target.value == 'headUser') {

            if (select.length !== 0) return

            // create a select element
            const isRegularSelect = document.createElement('select')

            // create a label for the element
            const label = document.createElement('label')
            label.setAttribute('class', 'elementExist')
            label.innerHTML = 'SPU Type'

            // name the element
            isRegularSelect.name = 'isRegular'

            // set the element to required
            isRegularSelect.setAttribute('required', 'required')
            isRegularSelect.setAttribute('class', 'elementExist')

            //create two options
            const option1 = document.createElement('option')
            const option2 = document.createElement('option')

            // assign their values
            option1.value = true
            option2.value = false
            option1.innerHTML = 'Regular User'
            option2.innerHTML = 'Non-Regular User'

            // append the options
            isRegularSelect.append(option1, option2)

            // append the select element and it's label to a form group
            $('.isRegular__form-group').append(label)
            $('.isRegular__form-group').append(isRegularSelect)

            // get all the options
            const stateOptions = $$('.select__state')

            stateOptions.forEach(option => {
                if (option.value !== 'FCT')
                    option.setAttribute('disabled', true)
            })

        }
    })
}

// remove flash message after a while
const removeFlash = $('.flash__remove')
const errorFlash = $('.flash--error')

if (removeFlash) {
    if (removeFlash && !errorFlash)
        setTimeout(() => removeFlash.parentElement.remove(), 3000)
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

const markAsTreated = $('.mark')
if (markAsTreated) {
    const overlay = $('.overlay')
    const overlayContent = $('.overlay-content')
    markAsTreated.on('click', () => {
        overlay.style.width = '100%'
        overlayContent.style.display = 'block'
    })
    const cancel = $('.cancel')
    cancel.on('click', (event) => {
        event.preventDefault()
        overlay.style.width = '0'
        overlayContent.style.display = 'none'
    })
}

const loginPage = $('.login__form')
const footer = $('.footer')
if (loginPage) {
    footer.style.display = 'none'
}

const shareButton = $('.share__button')
if (shareButton) {
    const overlay = $('.share__overlay')
    const cancel = $('.share__cancel')
    const shareContent = $('.share__overlay-content')

    shareButton.on('click', () => {

        overlay.style.width = '100%'
        shareContent.style.display = 'block'
            // overlay.style.height = '300px'
    })
    cancel.on('click', (event) => {
        event.preventDefault()
        overlay.style.width = '0'
        shareContent.style.display = 'none'
    })

}

typeAhead($('.search__user'))
search($('.search__admin'))
supervisorSearch($('.search__supervisor'))
headUserSearch($('.head__user--search'))