# Food Store Website

Website bán đồ ăn trực tuyến được phát triển bằng MERN Stack (MongoDB, Express, React, Node.js).

## Cài đặt dự án

Đầu tiên, clone repository về máy:

```bash
git clone https://github.com/CuongLinh190102/Food-store-website.git
cd Food-store-website
```

Tiến hành cài đặt các thư viện cần thiết cho cả frontend và backend.

### Cài đặt frontend (React)

```bash
cd client
npm install
```

### Cài đặt backend (Node.js + Express)

```bash
cd ../server
npm install
```

## Cấu hình biến môi trường

Tạo một file `.env` trong thư mục `server/` với nội dung như sau:

```env
PORT=5000
MONGO_URL=mongodb://localhost:27017/foodstore
JWT_SECRET=your_jwt_secret_key
```

**Lưu ý**: Nếu bạn sử dụng MongoDB Atlas thay cho MongoDB local, hãy thay `MONGO_URL` bằng chuỗi kết nối từ Atlas.

## Khởi chạy hệ thống

Mở hai terminal:

- Tại thư mục `server/`, khởi chạy backend:

  ```bash
  npm start
  ```

- Tại thư mục `client/`, khởi chạy frontend:

  ```bash
  npm start
  ```

Sau khi khởi chạy thành công, website sẽ chạy tại địa chỉ: [http://localhost:3000](http://localhost:3000)

## Tài khoản mẫu

Bạn có thể đăng ký tài khoản mới trên giao diện frontend. Nếu có tài khoản mẫu, sử dụng để đăng nhập. Ngoài ra, có thể thiết lập tài khoản mẫu trực tiếp trong database.

## Một số lệnh hữu ích

- Cài đặt thêm package:

  ```bash
  npm install <package-name>
  ```

- Build frontend để chuẩn bị production:

  ```bash
  npm run build
  ```

## Cấu trúc thư mục chính

```
Food-store-website/
|
├── client/         # Source code giao diện người dùng (React)
├── server/         # Source code backend API (Node.js + Express + MongoDB)
└── README.md       # File tài liệu dự án
```

---
