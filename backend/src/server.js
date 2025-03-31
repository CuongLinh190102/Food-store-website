import dotenv from 'dotenv';
dotenv.config(); // Tải biến môi trường từ tệp `.env`
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';

// Import các router xử lý API
import foodRouter from './routers/food.router.js';
import userRouter from './routers/user.router.js';
import orderRouter from './routers/order.router.js';
import uploadRouter from './routers/upload.router.js';
import favoriteRouter from './routers/favorite.router.js';
import swaggerRoutes from './swagger.js';

// Kết nối cơ sở dữ liệu
import { dbconnect } from './config/database.config.js';
import path, { dirname } from 'path';
dbconnect(); // Gọi hàm kết nối database

// Xác định đường dẫn thư mục hiện tại
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware để parse dữ liệu JSON từ request body
app.use(express.json());

// Cấu hình CORS (Cross-Origin Resource Sharing)
app.use(
  cors({
    credentials: true, // Cho phép gửi cookie qua CORS
    origin: 'http://localhost:3000', // Chỉ chấp nhận request từ frontend chạy trên cổng 3000
    optionsSuccessStatus: 200
  })
);

// Định nghĩa các route API
app.use('/api/foods', foodRouter); // API quản lý thực phẩm
app.use('/api/users', userRouter); // API quản lý người dùng
app.use('/api/orders', orderRouter); // API quản lý đơn hàng
app.use('/api/upload', uploadRouter); // API xử lý upload file
app.use('/api/favorites', favoriteRouter); // API quản lý món ăn yêu thích

// SPOONACULAR
const recipeIds = [715497, 716429, 644387, 715415, 715538];

app.get('/api/recipes', async (req, res) => {
  try {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    const recipes = [];

    // Gửi request lấy thông tin từng công thức dựa trên ID
    for (const id of recipeIds) {
      const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`);
      const data = await response.json();
      recipes.push(data);
    }

    res.json({ recipes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API lấy chi tiết công thức theo ID
app.get('/api/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const apiKey = process.env.SPOONACULAR_API_KEY;

    const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


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
app.listen(PORT, () => {
  console.log('listening on port ' + PORT);
});