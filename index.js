import { checkApp } from './checkApp.js'
import { checkWeb } from './checkWeb.js'
import {sendMess} from './bot-tele.js'

function run() {
    checkWeb().then(res => {
        sendMess(res)
    });
    checkApp().then(res => {
        sendMess(res)
    }); 
}

run();