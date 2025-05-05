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
cd frontend
npm install
```

### Cài đặt backend (Node.js + Express)

```bash
cd ../backend
npm install
```

## Cấu hình biến môi trường

Tạo một file `.env` trong thư mục `backend/` với nội dung như sau:

```env
MONGO_URI=
PORT=
JWT_SECRET=your_jwt_secret_key
SPOONACULAR_API_KEY=
RESEND_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**Lưu ý**: Nếu bạn sử dụng MongoDB Atlas thay cho MongoDB local, hãy thay `MONGO_URL` bằng chuỗi kết nối từ Atlas.

## Khởi chạy hệ thống

Mở hai terminal:

- Tại thư mục `backend/`, khởi chạy backend:

  ```bash
  npm start
  ```

- Tại thư mục `frontend/`, khởi chạy frontend:

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
├── frontend/         # Source code giao diện người dùng (React)
├── backend/         # Source code backend API (Node.js + Express + MongoDB)
└── README.md       # File tài liệu dự án
```

--- 

## Tài liệu API (test local)
Truy cập: http://localhost:5000/api-docs
