import { launch } from 'puppeteer';
import moment from 'moment'
import {createResponseTimeService} from "../services/b2c-response-time-services.js"

const checkWeb = async () => {
    console.log("Bắt đầu kiểm tra web...")
    let browser = null;
    
    try {
        browser = await launch({
            headless: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-blink-features=AutomationControlled',
                `--window-size=${1600},${800}`
            ]
        });

        const page = await browser.newPage();
        await page.setViewport({
            width: 1600,
            height: 700,
        });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        await page.goto('https://itel.vn/', {
            waitUntil: 'networkidle2',
        });

        // nhấn đóng 
        await page.waitForSelector('button.btn.btn-primary.px-10.py-6.rounded-full', {
            visible: true,
        });
        await page.click('button.btn.btn-primary.px-10.py-6.rounded-full');

        const start = performance.now();
        // nhấn sang link mua sim
        await page.waitForSelector('a[href="/mua-sim"]', {
            visible: true,
            timeout: 10000
        });
        await page.click('a[href="/mua-sim"]');

        // Check mua ngay xuất hiện
        await page.waitForFunction(() => {
            const div = document.querySelector('div.flex.gap-4.justify-end');
            if (!div) return false;
            const buttons = div.querySelectorAll('button');
            return Array.from(buttons).some(btn => btn.textContent.trim() === 'Mua ngay');
        });
        const start1 = performance.now();

        // Nhấn nút Mua ngay
        await page.evaluate(() => {
            const div = document.querySelector('div.flex.gap-4.justify-end');
            const buttons = div.querySelectorAll('button');
            const muaNgay = Array.from(buttons).find(btn => btn.textContent.trim() === 'Mua ngay');
            if (muaNgay) muaNgay.click();
        });

        // Gói cước xuất hiện
        await page.waitForSelector('div.flex.gap-2.w-max.transition-all', {
            visible: true,
            timeout: 10000
        });
        const start2 = performance.now();

        // Chọn gói cước
        await page.waitForFunction(() => {
            const div = document.querySelector('div.flex.gap-2.w-max.transition-all');
            if (!div) return false;
            const label = div.querySelectorAll('div.w-full.h-full.flex.flex-col.relative.rounded-2xl.bg-neutral-0.opacity-100');
            return label
        });
        await page.evaluate(() => {
            const div = document.querySelector('div.flex.gap-2.w-max.transition-all');
            const buttons = div.querySelectorAll('div.w-full.h-full.flex.flex-col.relative.rounded-2xl.bg-neutral-0.opacity-100');
            const muaNgay = buttons[0]
            if (muaNgay) muaNgay.click();
        });

        // nhấn thanh toán
        await page.waitForFunction(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            return buttons.some(button => button.textContent.includes('Thanh toán'));
        });

        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const payButton = buttons.find(button =>
                button.textContent.includes('Thanh toán')
            );
            payButton.click();
        });
        const start3 = performance.now();

        // Form thanh toán xuất hiện
        await page.waitForSelector('[name="cart_info.fullName"]', { visible: true });
        const start4 = performance.now();

        // nhập form thanh toán
        await page.type('[name="cart_info.fullName"]', 'Phạm Văn A');
        await page.type('[name="cart_info.ContactPhone"]', '0988988989');

        await page.evaluate(() => {
            const radio = document.querySelector('input[name="cart_info.shipment_type"][value="itel"]');
            if (radio) radio.click();
        });

        await page.waitForSelector('input[type="radio"][name="example"]:first-of-type', { visible: true });
        await page.click('input[type="radio"][name="example"]:first-of-type');

        // chọn hình thức thanh toán
        await page.waitForSelector('input[type="radio"][value="PO9"]', { visible: true });
        await page.click('input[type="radio"][value="PO9"]');

        // submit
        await page.click('button[type="submit"]');
        const start5 = performance.now();

        //
        await page.waitForNavigation({ waitUntil: 'networkidle0' })
        const end = performance.now();

        // Tổng hợp thời gian
        // 1. Nhấn vào mua sim => hiện nút mua ngay
        const buyNowTime = start1 - start
        // 2. Nhấn nút mua ngay =>  lúc hiển thị gói
        const packgeTime = start2 - start1
        // 3. Nhấn nút thanh toán => hiện nút Đặt hàng
        const orderTime = start4 - start3
        // 4. Đặt hàng => Hiển thị xong trang của cổng
        const paymentTime = end - start5

        console.log("Kết thúc kiểm tra web...")

        await browser.close();

        await createResponseTimeService({
            buyNowTime, packgeTime, orderTime, paymentTime, type: "WEB"
        });

        return `
        🌐 GHI NHẬT TRÌNH TỰ TRÊN WEB
        🕒 Thời gian ghi: ${moment().format("HH:mm:ss DD/MM/YYYY")}

        1️⃣ Nhấn "Mua sim" 👉 Hiện nút "Mua ngay" ⏱️ ${buyNowTime.toFixed(0)} ms
        2️⃣ Nhấn "Mua ngay" 👉 Hiển thị danh sách gói cước ⏱️ ${packgeTime.toFixed(0)} ms
        3️⃣ Nhấn "Thanh toán" 👉 Hiện nút "Đặt hàng" ⏱️ ${orderTime.toFixed(0)} ms
        4️⃣ Nhấn "Đặt hàng" 👉 Trang thanh toán hiển thị xong ⏱️ ${paymentTime.toFixed(0)} ms
        `;

    } catch (error) {
        console.error("Lỗi trong quá trình kiểm tra web:", error.message);
        
        // Đảm bảo đóng browser ngay cả khi có lỗi
        if (browser) {
            try {
                await browser.close();
                console.log("Đã đóng browser sau khi có lỗi");
            } catch (closeError) {
                console.error("Lỗi khi đóng browser:", closeError.message);
            }
        }
    }
};

export { checkWeb }