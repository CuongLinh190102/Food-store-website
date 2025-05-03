import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { initSocket } from './socket.js';
import swaggerRoutes from './swagger.js';
import { dbconnect } from './config/database.config.js';
import path, { dirname } from 'path';
import foodRouter from './routers/food.router.js';
import userRouter from './routers/user.router.js';
import orderRouter from './routers/order.router.js';
import uploadRouter from './routers/upload.router.js';
import favoriteRouter from './routers/favorite.router.js';
import recipeRouter from './routers/recipe.router.js';
import reviewRouter from './routers/review.router.js';

dotenv.config();
dbconnect();

// Xác định đường dẫn thư mục hiện tại
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);

app.use(express.json());

// Cấu hình CORS
app.use(
  cors({
    origin: [
      'https://food-store-website-2.vercel.app',
      'http://localhost:3000'
    ],
    credentials: true, // Cho phép gửi cookie qua CORS
    optionsSuccessStatus: 200
  })
);
app.use(express.json());

// Định nghĩa các route API
app.use('/api/users', userRouter); 
app.use('/api/foods', foodRouter); 
app.use('/api/orders', orderRouter); 
app.use('/api/upload', uploadRouter); // API xử lý upload file
app.use('/api/favorites', favoriteRouter); 
app.use('/api/recipes', recipeRouter); // API lấy dữ liệu từ Spoonacular
app.use('/api/reviews', reviewRouter); 

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