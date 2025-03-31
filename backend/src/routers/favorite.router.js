import { Router } from 'express';
import { FavoriteModel } from '../models/favorite.model.js';
import { FoodModel } from '../models/food.model.js';
import handler from 'express-async-handler';
import auth from '../middleware/auth.mid.js';

const router = Router();

// Lấy danh sách món ăn yêu thích của user
router.get(
  '/',
  auth,
  handler(async (req, res) => {
    const favorites = await FavoriteModel.find({ userId: req.user.id })
      .populate('foodId')
      .exec();
    res.send(favorites.map(fav => fav.foodId)); // Trả về danh sách food
  })
);

// Thêm món ăn vào danh sách yêu thích
router.post(
  '/:foodId',
  auth,
  handler(async (req, res) => {
    const { foodId } = req.params;

    // Kiểm tra food có tồn tại không
    const food = await FoodModel.findById(foodId);
    if (!food) {
      return res.status(404).send({ message: 'Food not found' });
    }

    // Kiểm tra đã có trong favorite chưa
    const existingFavorite = await FavoriteModel.findOne({ 
      userId: req.user.id, 
      foodId 
    });

    if (existingFavorite) {
      return res.status(400).send({ message: 'Food already in favorites' });
    }

    // Tạo favorite mới
    const favorite = await FavoriteModel.create({
      userId: req.user.id,
      foodId
    });

    res.status(201).send(favorite);
  })
);

// Xóa khỏi favorite
router.delete(
  '/:foodId',
  auth,
  handler(async (req, res) => {
    await FavoriteModel.deleteOne({ 
      userId: req.user.id, 
      foodId: req.params.foodId 
    });
    res.sendStatus(204);
  })
);

export default router;