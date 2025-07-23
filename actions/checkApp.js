import { remote } from "webdriverio"
import moment from 'moment'
import { createResponseTimeService } from "../services/b2c-response-time-services.js"

const capabilities = {
    "appium:appPackage": "itelecom.vn.myitel",
    "appium:appActivity": "com.example.my_itel_flutter.MainActivity",
    "appium:udid": "R58M36YRQEB",
    "appium:automationName": "uiautomator2",
    "platformName": "android",
    "appium:noReset": true,
    "appium:autoTerminate": true,
    "appium:autoGrantPermissions": true
}

const wdOpts = {
    hostname: process.env.APPIUM_HOST || 'localhost',
    port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
    logLevel: 'error',
    capabilities,
};

async function checkApp() {
    console.log("Bắt đầu kiểm tra app...")
    let driver = null;

    try {
        driver = await remote(wdOpts);

        await driver.pause(3000);

        const allElement = driver.$('~Tất cả');
        await allElement.click();
        await driver.pause(500);

        const simSoElement = driver.$('~SIM số');
        await simSoElement.click();
        // mua ngay xuất hiện
        const start = performance.now();
        const listSim = driver.$('~Định dạng số:');
        await listSim.waitForDisplayed({ timeout: 60000 });
        const start1 = performance.now();

        const muaNgayElement = driver.$('~Mua ngay');
        await muaNgayElement.click();

        // cuộn thêm 20 đơn vị
        // Cuộn lên 20 pixel bằng W3C Actions
        await driver.performActions([{
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x: 360, y: 800 },
                { type: 'pointerDown', button: 0 },
                { type: 'pointerMove', duration: 300, x: 360, y: 770 },
                { type: 'pointerUp', button: 0 }
            ]
        }]);

        // Giải phóng actions sau khi thực hiện
        await driver.releaseActions();

        const start2 = performance.now();
        const oneThang = driver.$('~1 tháng');
        await oneThang.waitForDisplayed({ timeout: 60000 });
        const start3 = performance.now();

        await driver.pause(500);

        const goiCuocElement = driver.$('~MAY35S\n35.000đ/ 1 tháng');
        await goiCuocElement.scrollIntoView();
        await goiCuocElement.click();

        await driver.pause(500);

        const screenshotCoordinates = { x: 360, y: 1380 };
        await driver.tap(screenshotCoordinates);

        await driver.pause(500);

        const start4 = performance.now();
        const datHangElement = driver.$('~1. Thông tin nhận hàng');
        await datHangElement.waitForDisplayed({ timeout: 60000 });
        const start5 = performance.now();

        await driver.pause(500);

        const fullNameInput = driver.$('//android.widget.ScrollView/android.widget.EditText[1]');
        await fullNameInput.click();
        await fullNameInput.setValue("Họ và tên");
        await driver.hideKeyboard();

        await driver.pause(500);

        const phoneNumberInput = driver.$('//android.widget.ScrollView/android.widget.EditText[2]');
        await phoneNumberInput.click();
        await phoneNumberInput.setValue("0123456789");
        await driver.hideKeyboard();

        await driver.pause(500);

        const nhanHangTaiPGD = driver.$('~Nhận tại phòng giao dịch iTel\nQuý Khách vui lòng đến PGD đã chọn để nhận hàng. iTel sẽ giữ đơn hàng của Quý Khách trong vòng 48h, sau thời điểm trên đơn hàng sẽ bị hủy.');
        await nhanHangTaiPGD.scrollIntoView();
        await nhanHangTaiPGD.click();

        await driver.pause(500);

        const theManorCheck = driver.$('//android.widget.ScrollView/android.widget.RadioButton[1]');
        await theManorCheck.scrollIntoView();
        await theManorCheck.click();

        await driver.pause(500);

        const paymentCheck = driver.$('//android.widget.ImageView[@content-desc="Thẻ thanh toán quốc tế"]/android.widget.RadioButton');
        await paymentCheck.scrollIntoView();
        await paymentCheck.click();

        await driver.pause(500);

        const orderButton = driver.$('~Đặt hàng');
        await orderButton.scrollIntoView();

        const start6 = performance.now();
        await orderButton.click();

        const webViewElement = driver.$('//android.webkit.WebView');
        await webViewElement.waitForDisplayed({ timeout: 60000 });
        const start7 = performance.now();
        await driver.pause(3000);

        // Đóng app và session
        await driver.terminateApp("itelecom.vn.myitel");
        await driver.deleteSession();

        // Tổng hợp thời gian
        // 1. Nhấn vào mua sim => hiện nút mua ngay
        const buyNowTime = start1 - start
        // 2. Nhấn nút mua ngay =>  lúc hiển thị gói
        const packgeTime = start3 - start2
        // 3. Nhấn nút thanh toán => hiện nút Đặt hàng
        const orderTime = start5 - start4
        // 4. Đặt hàng => Hiển thị xong trang của cổng
        const paymentTime = start7 - start6

        console.log("Kết thúc kiểm tra App...")
        console.log(`
        📱 GHI NHẬT TRÌNH TỰ TƯƠNG TÁC ỨNG DỤNG
        🕒 Thời gian ghi: ${moment().format("HH:mm:ss DD/MM/YYYY")}

        1️⃣ Nhấn "Mua sim" 👉 Hiện nút "Mua ngay" ⏱️ ${buyNowTime.toFixed(0)} ms
        2️⃣ Nhấn "Mua ngay" 👉 Hiển thị danh sách gói cước ⏱️ ${packgeTime.toFixed(0)} ms
        3️⃣ Nhấn "Thanh toán" 👉 Hiện nút "Đặt hàng" ⏱️ ${orderTime.toFixed(0)} ms
        4️⃣ Nhấn "Đặt hàng" 👉 Mở trang thanh toán của cổng ⏱️ ${paymentTime.toFixed(0)} ms
        `);

        await createResponseTimeService({
            buyNowTime, packgeTime, orderTime, paymentTime, type: "App"
        });



    } catch (error) {
        console.error("Lỗi trong quá trình kiểm tra app:", error.message);

        // Đảm bảo đóng app và session ngay cả khi có lỗi
        if (driver) {
            try {
                // Cố gắng đóng app
                await driver.terminateApp("itelecom.vn.myitel");
                console.log("Đã đóng app sau khi có lỗi");
            } catch (terminateError) {
                console.error("Lỗi khi đóng app:", terminateError.message);
            }

            try {
                // Cố gắng xóa session
                await driver.deleteSession();
                console.log("Đã xóa session sau khi có lỗi");
            } catch (sessionError) {
                console.error("Lỗi khi xóa session:", sessionError.message);
            }
        }
    }
}

export { checkApp }