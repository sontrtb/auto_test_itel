import { checkApp } from './checkApp.js'
import { checkWeb } from './checkWeb.js'
import { sendMess } from '../bot/bot-tele.js'

async function run() {
    try {
        const webRes = await checkWeb();
        await sendMess(webRes);

        const appRes = await checkApp();
        await sendMess(appRes);

        throw new Error('Lỗi sau khi gửi tin nhắn');
    } catch (err) {
        console.error("Lỗi trong run():", err.message);
    }
}

export { run }
