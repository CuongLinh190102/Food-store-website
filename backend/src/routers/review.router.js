import { Router } from 'express';
import { ReviewModel } from '../models/review.model.js';
import { FoodModel } from '../models/food.model.js';
import auth from '../middleware/auth.mid.js';
import handler from 'express-async-handler';
import { BAD_REQUEST, NOT_FOUND, FORBIDDEN } from '../constants/httpStatus.js';
import { notifyReviewUpdate } from '../socket.js';

const router = Router();

// POST - Tạo review mới
router.post(
  '/',
  auth,
  handler(async (req, res) => {
    const { foodId, stars, comment } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!foodId || !stars) {
      return res.status(BAD_REQUEST).send('FoodId and stars are required');
    }

    if (stars < 1 || stars > 5 || !Number.isInteger(stars)) {
      return res.status(BAD_REQUEST).send('Stars must be integer between 1-5');
    }

    // Kiểm tra món ăn tồn tại
    const food = await FoodModel.findById(foodId);
    if (!food) {
      return res.status(NOT_FOUND).send('Food not found');
    }

    // Kiểm tra user đã review món này chưa
    const existingReview = await ReviewModel.findOne({ foodId, userId });
    if (existingReview) {
      return res.status(BAD_REQUEST).send('You already reviewed this food');
    }

    // Tạo review mới
    const review = new ReviewModel({
      foodId,
      userId,
      stars,
      comment: comment || '',
    });

    await review.save();
    await notifyReviewUpdate(review._id, 'created');

    res.status(201).json({
      ...review.toObject(),
      user: req.user, // Trả về thông tin user ngay lập tức
    });
  })
);

// GET - Lấy tất cả reviews của món ăn
router.get(
  '/food/:foodId',
  handler(async (req, res) => {
    const { foodId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Kiểm tra món ăn tồn tại
    const food = await FoodModel.findById(foodId);
    if (!food) {
      return res.status(NOT_FOUND).send('Food not found');
    }

    const reviews = await ReviewModel.find({ foodId })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await ReviewModel.countDocuments({ foodId });

    res.json({
      data: reviews,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  })
);

// PUT - Cập nhật review
router.put(
  '/:id',
  auth,
  handler(async (req, res) => {
    const { id } = req.params;
    const { stars, comment } = req.body;
    const userId = req.user.id;

    // Validate input
    if (stars && (stars < 1 || stars > 5 || !Number.isInteger(stars))) {
      return res.status(BAD_REQUEST).send('Stars must be integer between 1-5');
    }

    const review = await ReviewModel.findById(id);
    if (!review) {
      return res.status(NOT_FOUND).send('Review not found');
    }

    // Chỉ user tạo review mới được sửa
    if (review.userId.toString() !== userId) {
      return res.status(FORBIDDEN).send('Not authorized to update this review');
    }

    // Cập nhật chỉ các trường được phép
    if (stars) review.stars = stars;
    if (comment !== undefined) review.comment = comment;

    await review.save();
    await notifyReviewUpdate(review._id, 'updated');

    res.json(review);
  })
);

// DELETE - Xóa review
router.delete(
  '/:id',
  auth,
  handler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await ReviewModel.findById(id);
    if (!review) {
      return res.status(NOT_FOUND).send('Review not found');
    }

    if (review.userId.toString() !== userId) {
      return res.status(FORBIDDEN).send('Not authorized to delete this review');
    }

    console.log('Deleting review:', review);
    await notifyReviewUpdate(review._id, 'deleted');
    res.sendStatus(204);
  })
);

// GET - Lấy review cụ thể
router.get(
  '/:id',
  handler(async (req, res) => {
    const { id } = req.params;

    const review = await ReviewModel.findById(id).populate(
      'userId',
      'name avatar'
    );

    if (!review) {
      return res.status(NOT_FOUND).send('Review not found');
    }

    res.json(review);
  })
);

export default router;