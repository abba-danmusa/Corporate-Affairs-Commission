import { $, $$ } from './modules/bling'
import Socket from './modules/socket.io'
import typeAhead from './modules/typeAhead'
import post from './modules/post.io'

document.addEventListener('DOMContentLoaded', () => {
    FilePond.registerPlugin(
        FilePondPluginImageResize,
        FilePondPluginImagePreview,
        FilePondPluginFileEncode,
        // FilePondPluginFileValidateSize,
        // FilePondPluginFileValidateType
    )

    FilePond.setOptions({
        stylePanelAspectRatio: 150 / 100,
        imageResizeTargetWidth: 100,
        imageResizeTargetHeight: 150,
        maxFileSize: '50kb'
    })
    FilePond.parse(document.body)
    FilePond.maxFileSize = '60kb'
})
if (document.querySelector("#live")) {
    new Socket()
}
typeAhead($('.search'))
post()