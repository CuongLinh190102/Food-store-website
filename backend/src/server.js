import dotenv from 'dotenv';
dotenv.config();
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import foodRouter from './routers/food.router.js';
import userRouter from './routers/user.router.js';
import orderRouter from './routers/order.router.js';
import uploadRouter from './routers/upload.router.js';
import swaggerRoutes from './swagger.js';

import { dbconnect } from './config/database.config.js';
import path, { dirname } from 'path';
dbconnect();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
  })
);

app.use('/api/foods', foodRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/upload', uploadRouter);

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


// Setup Swagger
app.use(swaggerRoutes);

const publicFolder = path.join(__dirname, '../../frontend/public');
app.use(express.static(publicFolder));

app.get('*', (req, res) => {
  const indexFilePath = path.join(publicFolder, 'index.html');
  res.sendFile(indexFilePath);
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('listening on port ' + PORT);
});