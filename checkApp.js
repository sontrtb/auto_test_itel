import { remote } from "webdriverio"
import moment from 'moment'

const capabilities = {
    "appium:appPackage": "itelecom.vn.myitel",
    "appium:appActivity": "com.example.my_itel_flutter.MainActivity",
    "appium:udid": "e021ca86",
    "appium:automationName": "uiautomator2",
    "platformName": "android",
    "appium:noReset": true,
    "appium:autoTerminate": true
}

const wdOpts = {
    hostname: process.env.APPIUM_HOST || 'localhost',
    port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
    logLevel: 'error',
    capabilities,
};

async function checkApp() {
    console.log("Bắt đầu kiểm tra app...")
    const driver = await remote(wdOpts);

    await driver.pause(5000);

    const simSoElement = driver.$('~SIM số');
    await simSoElement.click();
    // mua ngay xuất hiện
    const start = performance.now();
    const listSim = driver.$('~Định dạng số:');
    await listSim.waitForDisplayed();
    const start1 = performance.now();

    const muaNgayElement = driver.$('~Mua ngay');
    await muaNgayElement.click();

    await driver.pause(500);

    const start2 = performance.now();
    const oneThang = driver.$('~1 tháng');
    await oneThang.waitForDisplayed();
    const start3 = performance.now();

    const goiCuocElement = driver.$('~MAY35S\n35.000đ/ 1 tháng');
    await goiCuocElement.scrollIntoView();
    await goiCuocElement.click();

    const screenshotCoordinates = { x: 540, y: 2140 };
    await driver.tap(screenshotCoordinates);

    const start4 = performance.now();
    const datHangElement = driver.$('~1. Thông tin nhận hàng');
    await datHangElement.waitForDisplayed();
    const start5 = performance.now();

    await driver.pause(300);

    const fullNameInput = driver.$('//android.widget.ScrollView/android.widget.EditText[1]');
    await fullNameInput.click();
    await fullNameInput.setValue("Họ và tên");
    await driver.hideKeyboard();

    const phoneNumberInput = driver.$('//android.widget.ScrollView/android.widget.EditText[2]');
    await phoneNumberInput.click();
    await phoneNumberInput.setValue("0123456789");
    await driver.hideKeyboard();

    const theManorCheck = driver.$('//android.widget.ScrollView/android.widget.RadioButton[1]');
    await theManorCheck.scrollIntoView();
    await theManorCheck.click();

    const paymentCheck = driver.$('//android.widget.ImageView[@content-desc="Thẻ thanh toán quốc tế"]/android.widget.RadioButton');
    await paymentCheck.scrollIntoView();
    await paymentCheck.click();

    const orderButton = driver.$('~Đặt hàng');

    const start6 = performance.now();
    await orderButton.click();

    const webViewElement = driver.$('//android.webkit.WebView');
    await webViewElement.waitForDisplayed();
    const start7 = performance.now();
    await driver.pause(3000);
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

    return `
    📱 GHI NHẬT TRÌNH TỰ TƯƠNG TÁC ỨNG DỤNG
    🕒 Thời gian ghi: ${moment().format("HH:mm:ss DD/MM/YYYY")}

    1️⃣ Nhấn "Mua sim" 👉 Hiện nút "Mua ngay" ⏱️ ${buyNowTime.toFixed(0)} ms
    2️⃣ Nhấn "Mua ngay" 👉 Hiển thị danh sách gói cước ⏱️ ${packgeTime.toFixed(0)} ms
    3️⃣ Nhấn "Thanh toán" 👉 Hiện nút "Đặt hàng" ⏱️ ${orderTime.toFixed(0)} ms
    4️⃣ Nhấn "Đặt hàng" 👉 Mở trang thanh toán của cổng ⏱️ ${paymentTime.toFixed(0)} ms
    `;
}

export { checkApp }