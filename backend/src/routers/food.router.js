import { Router } from 'express';
import { FoodModel } from '../models/food.model.js';
import handler from 'express-async-handler';
import admin from '../middleware/admin.mid.js';

const router = Router();

/**
 * @swagger
 * /api/foods/:
 *   get:
 *     summary: Get list of all foods
 *     tags: [Food]
 *     responses:
 *       200:
 *         description: Returns the list of foods
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
 * /api/foods/:
 *   post:
 *     summary: Add new food (Admin)
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
 *         description: The food has been successfully added.
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
 * /api/foods/:
 *   put:
 *     summary: Update food information (Admin)
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
 *         description: The food has been updated
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
 * /api/foods/{foodId}:
 *   delete:
 *     summary: Delete food (Admin)
 *     tags: [Food]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: foodId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the food to delete
 *     responses:
 *       200:
 *         description: The food has been deleted
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
 * /api/foods/tags:
 *   get:
 *     summary: Get list of food tags
 *     tags: [Food]
 *     responses:
 *       200:
 *         description: Returns a list of tags and the number of foods by tag
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
 * /api/foods/search/{searchTerm}:
 *   get:
 *     summary: Search for foods by name
 *     tags: [Food]
 *     parameters:
 *       - in: path
 *         name: searchTerm
 *         required: true
 *         schema:
 *           type: string
 *         description: Search keywords
 *     responses:
 *       200:
 *         description: Returns a list of matching foods
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
 * /api/foods/tag/{tag}:
 *   get:
 *     summary: Get list of foods by tag
 *     tags: [Food]
 *     parameters:
 *       - in: path
 *         name: tag
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag name
 *     responses:
 *       200:
 *         description: Returns a list of foods by tag
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
 * /api/foods/{foodId}:
 *   get:
 *     summary: Get details of a food
 *     tags: [Food]
 *     parameters:
 *       - in: path
 *         name: foodId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the food
 *     responses:
 *       200:
 *         description: Returns food details
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
