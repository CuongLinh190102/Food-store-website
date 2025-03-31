// Import thư viện `form-data`, giúp tạo form để gửi dữ liệu
import FormData from 'form-data';

// Import `mailgun.js`, SDK chính thức của Mailgun để gửi email
import Mailgun from 'mailgun.js';

// Hàm khởi tạo client để gửi email qua Mailgun
export function getClient() {
  // Tạo một instance của Mailgun, sử dụng `FormData` để gửi dữ liệu
  const mailgun = new Mailgun(FormData);

  // Khởi tạo client của Mailgun với thông tin xác thực API
  const client = mailgun.client({
    username: 'api', // Mặc định sử dụng "api" làm username
    key: process.env.MAILGUN_API_KEY, // Lấy API key từ biến môi trường
  });

  // Trả về client đã được cấu hình để sử dụng trong các chức năng gửi email
  return client;
}