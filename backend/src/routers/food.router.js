import { Router } from 'express';
import { FoodModel } from '../models/food.model.js';
import handler from 'express-async-handler';
import admin from '../middleware/admin.mid.js';

const router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Lấy danh sách tất cả món ăn
 *     tags: [Food]
 *     responses:
 *       200:
 *         description: Trả về danh sách món ăn
 */

router.get(
  '/',
  handler(async (req, res) => {
    const foods = await FoodModel.find({});
    res.send(foods);
  })
);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Thêm món ăn mới (Admin)
 *     tags: [Food]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               favorite:
 *                 type: boolean
 *               imageUrl:
 *                 type: string
 *               origins:
 *                 type: array
 *                 items:
 *                   type: string
 *               cookTime:
 *                 type: string
 *     responses:
 *       201:
 *         description: Món ăn đã được thêm thành công
 */

router.post(
  '/',
  admin,
  handler(async (req, res) => {
    const { name, price, tags, favorite, imageUrl, origins, cookTime } =
      req.body;

    const food = new FoodModel({
      name,
      price,
      tags: tags.split ? tags.split(',') : tags,
      favorite,
      imageUrl,
      origins: origins.split ? origins.split(',') : origins,
      cookTime,
    });

    await food.save();

    res.send(food);
  })
);

/**
 * @swagger
 * /:
 *   put:
 *     summary: Cập nhật thông tin món ăn (Admin)
 *     tags: [Food]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               favorite:
 *                 type: boolean
 *               imageUrl:
 *                 type: string
 *               origins:
 *                 type: array
 *                 items:
 *                   type: string
 *               cookTime:
 *                 type: string
 *     responses:
 *       200:
 *         description: Món ăn đã được cập nhật
 */

router.put(
  '/',
  admin,
  handler(async (req, res) => {
    const { id, name, price, tags, favorite, imageUrl, origins, cookTime } =
      req.body;

    await FoodModel.updateOne(
      { _id: id },
      {
        name,
        price,
        tags: tags.split ? tags.split(',') : tags,
        favorite,
        imageUrl,
        origins: origins.split ? origins.split(',') : origins,
        cookTime,
      }
    );

    res.send();
  })
);

/**
 * @swagger
 * /{foodId}:
 *   delete:
 *     summary: Xóa món ăn (Admin)
 *     tags: [Food]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: foodId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của món ăn cần xóa
 *     responses:
 *       200:
 *         description: Món ăn đã được xóa
 */

router.delete(
  '/:foodId',
  admin,
  handler(async (req, res) => {
    const { foodId } = req.params;
    await FoodModel.deleteOne({ _id: foodId });
    res.send();
  })
);

/**
 * @swagger
 * /tags:
 *   get:
 *     summary: Lấy danh sách các tag món ăn
 *     tags: [Food]
 *     responses:
 *       200:
 *         description: Trả về danh sách tag và số lượng món ăn theo tag
 */

router.get(
  '/tags',
  handler(async (req, res) => {
    const tags = await FoodModel.aggregate([
      {
        $unwind: '$tags',
      },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          count: '$count',
        },
      },
    ]).sort({ count: -1 });

    const all = {
      name: 'All',
      count: await FoodModel.countDocuments(),
    };

    tags.unshift(all);

    res.send(tags);
  })
);

/**
 * @swagger
 * /search/{searchTerm}:
 *   get:
 *     summary: Tìm kiếm món ăn theo tên
 *     tags: [Food]
 *     parameters:
 *       - in: path
 *         name: searchTerm
 *         required: true
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm
 *     responses:
 *       200:
 *         description: Trả về danh sách món ăn phù hợp
 */

router.get(
  '/search/:searchTerm',
  handler(async (req, res) => {
    const { searchTerm } = req.params;
    const searchRegex = new RegExp(searchTerm, 'i');

    const foods = await FoodModel.find({ name: { $regex: searchRegex } });
    res.send(foods);
  })
);

/**
 * @swagger
 * /tag/{tag}:
 *   get:
 *     summary: Lấy danh sách món ăn theo tag
 *     tags: [Food]
 *     parameters:
 *       - in: path
 *         name: tag
 *         required: true
 *         schema:
 *           type: string
 *         description: Tên tag
 *     responses:
 *       200:
 *         description: Trả về danh sách món ăn theo tag
 */

router.get(
  '/tag/:tag',
  handler(async (req, res) => {
    const { tag } = req.params;
    const foods = await FoodModel.find({ tags: tag });
    res.send(foods);
  })
);

/**
 * @swagger
 * /{foodId}:
 *   get:
 *     summary: Lấy thông tin chi tiết của một món ăn
 *     tags: [Food]
 *     parameters:
 *       - in: path
 *         name: foodId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của món ăn
 *     responses:
 *       200:
 *         description: Trả về thông tin chi tiết món ăn
 */

router.get(
  '/:foodId',
  handler(async (req, res) => {
    const { foodId } = req.params;
    const food = await FoodModel.findById(foodId);
    res.send(food);
  })
);

export default router;
