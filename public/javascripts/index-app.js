import { $, $$ } from './modules/bling'
import Socket from './modules/socket.io'
import typeAhead from './modules/typeAhead'
// import chat from './modules/test'
// chat()
if (document.querySelector("#live")) {
    new Socket()

}
typeAhead($('.search'))