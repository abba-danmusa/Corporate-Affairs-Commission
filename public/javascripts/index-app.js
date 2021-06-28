import { $, $$ } from './modules/bling'
import Socket from './modules/socket.io'
import typeAhead from './modules/typeAhead'


if (document.querySelector("#live")) {
    new Socket()
}
typeAhead($('.search'))