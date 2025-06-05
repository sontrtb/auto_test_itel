import { checkApp } from './checkApp.js'
import { checkWeb } from './checkWeb.js'
import { sendMess } from '../bot/bot-tele.js'

function run() {
    checkApp().then(res => {
        sendMess(res)
    });
    checkWeb().then(res => {
        sendMess(res)
    });
}

export { run }