import { Router } from 'express';
import admin from '../middleware/admin.mid.js';
import multer from 'multer';
import handler from 'express-async-handler';
import { BAD_REQUEST } from '../constants/httpStatus.js';
import { configCloudinary } from '../config/cloudinary.config.js';

const router = Router();
const upload = multer();

/**
 * @swagger
 * tags:
 *   - name: "Upload"
 *     description: "APIs for uploading files"
 */

/**
 * @swagger
 * /api/upload/:
 *   post:
 *     summary: Upload image to Cloudinary
 *     description: Upload an image file and get its Cloudinary URL.
 *     tags: ["Upload"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imageUrl:
 *                   type: string
 *                   example: "https://res.cloudinary.com/demo/image/upload/sample.jpg"
 *       400:
 *         description: No image file provided
 *       403:
 *         description: Unauthorized access
 */

router.post(
  '/',
  admin,
  upload.single('image'),
  handler(async (req, res) => {
    const file = req.file;
    if (!file) {
      res.status(BAD_REQUEST).send();
      return;
    }

    const imageUrl = await uploadImageToCloudinary(req.file?.buffer);
    res.send({ imageUrl });
  })
);

const uploadImageToCloudinary = imageBuffer => {
  const cloudinary = configCloudinary();

  return new Promise((resolve, reject) => {
    if (!imageBuffer) reject(null);

    cloudinary.uploader
      .upload_stream((error, result) => {
        if (error || !result) reject(error);
        else resolve(result.url);
      })
      .end(imageBuffer);
  });
};

export default router;
