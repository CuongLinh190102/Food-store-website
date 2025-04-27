import dotenv from 'dotenv';
dotenv.config(); // Tải biến môi trường từ tệp `.env`
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { initSocket } from './socket.js';

// Import các router xử lý API
import foodRouter from './routers/food.router.js';
import userRouter from './routers/user.router.js';
import orderRouter from './routers/order.router.js';
import uploadRouter from './routers/upload.router.js';
import favoriteRouter from './routers/favorite.router.js';
import recipeRouter from './routers/recipe.router.js';
import reviewRouter from './routers/review.router.js';
import swaggerRoutes from './swagger.js';

// Kết nối cơ sở dữ liệu
import { dbconnect } from './config/database.config.js';
import path, { dirname } from 'path';
dbconnect(); // Gọi hàm kết nối database

// Xác định đường dẫn thư mục hiện tại
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);

// Middleware để parse dữ liệu JSON từ request body
app.use(express.json());

// Cấu hình CORS (Cross-Origin Resource Sharing)
app.use(
  cors({
    origin: [
      'https://food-store-website-2.vercel.app/',
      'http://localhost:3000'
    ],
    credentials: true, // Cho phép gửi cookie qua CORS
    optionsSuccessStatus: 200
  })
);
app.use(express.json());

// Định nghĩa các route API
app.use('/api/users', userRouter); // API quản lý người dùng
app.use('/api/foods', foodRouter); // API quản lý thực phẩm
app.use('/api/orders', orderRouter); // API quản lý đơn hàng
app.use('/api/upload', uploadRouter); // API xử lý upload file
app.use('/api/favorites', favoriteRouter); // API quản lý món ăn yêu thích
app.use('/api/recipes', recipeRouter); // API lấy dữ liệu từ Spoonacular
app.use('/api/reviews', reviewRouter); // API quản lý đánh giá món ăn

// Cấu hình Swagger cho tài liệu API
app.use(swaggerRoutes);

// Chỉ định thư mục chứa các file tĩnh (hình ảnh, CSS, JS)
const publicFolder = path.join(__dirname, '../../frontend/public');
app.use(express.static(publicFolder));

// Route mặc định, trả về file `index.html` cho tất cả các request không khớp với API nào
app.get('*', (req, res) => {
  const indexFilePath = path.join(publicFolder, 'index.html');
  res.sendFile(indexFilePath);
});

// Xác định cổng chạy server, mặc định là 5000 nếu không có biến môi trường
const PORT = process.env.PORT || 5000;
initSocket(server);

server.listen(PORT, () => {
  console.log('listening on port ' + PORT);
});