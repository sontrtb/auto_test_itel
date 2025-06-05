import axios from 'axios'

const token = '7624395023:AAHTS7nZuQhqarknD-blJ6OIKOr4oKNYy1g';
const chatId = '5387101269';

const proxyConfig = {
    host: '13.212.91.168',
    port: 3128,
    auth: {
        username: 'teleproxy',
        password: 'uZfmvdzQLMfe2dRgcKhAn5CmM5f9foQz',
    },
    protocol: 'http'
};

function sendMess(mess) {
    axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: chatId,
        text: mess,
    },
        { proxy: proxyConfig }
    )
        .then(res => {
            console.log('Gửi tin nhắn thành công');
        })
        .catch(err => {
            console.error('Lỗi khi gửi tin nhắn', err);
        });
}

export { sendMess }