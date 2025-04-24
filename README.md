 Cài đặt
Clone repository về máy

bash
Copy
Edit
git clone https://github.com/CuongLinh190102/Food-store-website.git
cd Food-store-website
Cài đặt các thư viện cần thiết

Frontend:

bash
Copy
Edit
cd client
npm install
Backend:

bash
Copy
Edit
cd ../server
npm install
🔐 Cấu hình biến môi trường
Tạo file .env trong thư mục server/ với nội dung giống sau:

env
Copy
Edit
PORT=5000
MONGO_URL=mongodb://localhost:27017/foodstore
JWT_SECRET=your_jwt_secret_key
⚠️ Nếu  sử dụng MongoDB Atlas, hãy thay MONGO_URL bằng chuỗi kết nối Atlas.

🚀 Khởi chạy hệ thống
Mở hai terminal:

Chạy backend (từ thư mục server/):

bash
Copy
Edit
npm start
Chạy frontend (từ thư mục client/):

bash
Copy
Edit
npm start
Website sẽ được chạy tại http://localhost:3000

🧪 Tài khoản mẫu để đăng nhập (nếu có)
Nếu không có tài khoản mẫu,   có thể tạo tài khoản mới trên giao diện frontend hoặc thiết lập user mẫu trong database.

🛠 Một số lệnh hữu ích
Cài thêm package:

bash
Copy
Edit
npm install <package-name>
Build frontend:

bash
Copy
Edit
npm run build
📁 Cấu trúc thư mục chính
bash
Copy
Edit
Food-store-website/
│
├── client/         # Giao diện người dùng (React)
├── server/         # API backend (Node.js + Express + MongoDB)
└── README.md       # Tài liệu dự án
