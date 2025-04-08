import { Router } from 'express';
import jwt from 'jsonwebtoken';
const router = Router();
import { OK, BAD_REQUEST } from '../constants/httpStatus.js';
import handler from 'express-async-handler';
import { UserModel } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import auth from '../middleware/auth.mid.js';
import admin from '../middleware/admin.mid.js';
const PASSWORD_HASH_SALT_ROUNDS = 10;

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: User management APIs
 */

/**
 * @swagger
 * /api/users/login:
 *  post:
 *   summary: Login to the system
 *   tags: [Users]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        email:
 *         type: string
 *         example: "jane@gmail.com"
 *        password:
 *         type: string
 *         example: "123456"
 *  responses:
 *   200:
 *    description: Login successful
 *   400:
 *    description: Username or password is invalid
 */

router.post(
  '/login',
  handler(async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(OK).send(generateTokenResponse(user));
      return;
    }

    res.status(BAD_REQUEST).send('Username or password is invalid');
  })
);

/**
 * @swagger
 * /api/users/register:
 *  post:
 *   summary: Register a new user
 *   tags: [Users]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *        - name
 *        - email
 *        - password
 *        - address
 *       properties:
 *        name:
 *         type: string
 *         example: "DP"
 *        email:
 *         type: string
 *         example: "DP@gmail.com"
 *        password:
 *         type: string
 *         example: "123456"
 *        address:
 *         type: string
 *         example: "Vietnam"
 *  responses:
 *   200:
 *    description: Register successful
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        id:
 *         type: string
 *         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *        name:
 *         type: string
 *         example: "DP"
 *        email:
 *         type: string
 *         example: "dp@gmail.com"
 *        address:
 *         type: string
 *         example: "Vietnam"
 *        isAdmin:
 *         type: boolean
 *         example: false
 *        token:
 *         type: string
 *         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *   400:
 *    description: User already exists, please login!
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        message:
 *         type: string
 *         example: "User already exists, please login!"
 */

router.post(
  '/register',
  handler(async (req, res) => {
    const { name, email, password, address } = req.body;

    const user = await UserModel.findOne({ email });

    if (user) {
      res.status(BAD_REQUEST).json('User already exists, please login!');
      return;
    }

    const hashedPassword = await bcrypt.hash(
      password,
      PASSWORD_HASH_SALT_ROUNDS
    );
// CREATE - Tạo user mới
    const newUser = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      address,
    };

    const result = await UserModel.create(newUser);
    res.status(OK).json(generateTokenResponse(result));
  })
);

/**
 * @swagger
 * /api/users/updateProfile:
 *  put:
 *   summary: Update user profile
 *   tags: [Users]
 *   security:
 *    - bearerAuth: []
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        name:
 *         type: string
 *         example: "John Doe"
 *        address:
 *         type: string
 *         example: "123 Main St, HCM City"
 *  responses:
 *    200:
 *     description: Update successful
 *    400:
 *     description: Update failed
 */

// UPDATE - Cập nhật thông tin user
router.put(
  '/updateProfile',
  auth,
  handler(async (req, res) => {
    const { name, address } = req.body;
    const user = await UserModel.findByIdAndUpdate(
      req.user.id,
      { name, address },
      { new: true }
    );

    res.send(generateTokenResponse(user));
  })
);

/**
 * @swagger
 * /api/users/changePassword:
 *  put:
 *   summary: Change user password
 *   tags: [Users]
 *   security:
 *    - bearerAuth: []
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        currentPassword:
 *         type: string
 *         example: "123456"
 *        newPassword:
 *         type: string
 *         example: "654321"
 *  responses:
 *   200:
 *    description: Change password successful
 *   400:
 *    description: Change password failed
 */

router.put(
  '/changePassword',
  auth,
  handler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await UserModel.findById(req.user.id);

    if (!user) {
      res.status(BAD_REQUEST).send('Change Password Failed!');
      return;
    }

    const equal = await bcrypt.compare(currentPassword, user.password);

    if (!equal) {
      res.status(BAD_REQUEST).send('Current Password Is Not Correct!');
      return;
    }

    user.password = await bcrypt.hash(newPassword, PASSWORD_HASH_SALT_ROUNDS);
    await user.save();

    res.send();
  })
);

/**
 * @swagger
 * /api/users/getall/{searchTerm}:
 *  get:
 *   summary: Get all users (optional search)
 *   description: Retrieve a list of all users, optionally filtering by search term.
 *   tags: [Users]
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - name: searchTerm
 *      in: path
 *      description: Search users by name (optional)
 *      required: false
 *      schema:
 *       type: string
 *   responses:
 *    200:
 *     description: List of users retrieved successfully
 *    403:
 *     description: Unauthorized access
 */

router.get(
  '/getall/:searchTerm?',
  admin,
  handler(async (req, res) => {
    const { searchTerm } = req.params;

    const filter = searchTerm
      ? { name: { $regex: new RegExp(searchTerm, 'i') } }
      : {};

    const users = await UserModel.find(filter, { password: 0 });
    res.send(users);
  })
);

/**
 * @swagger
 * /api/users/toggleBlock/{userId}:
 *   put:
 *     summary: Toggle user block status
 *     description: Block or unblock a user account.
 *     tags: ["Users"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to block/unblock
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User block status updated
 *       400:
 *         description: Cannot block yourself
 *       403:
 *         description: Unauthorized access
 */

router.put(
  '/toggleBlock/:userId',
  admin,
  handler(async (req, res) => {
    const { userId } = req.params;

    if (userId === req.user.id) {
      res.status(BAD_REQUEST).send("Can't block yourself!");
      return;
    }

    const user = await UserModel.findById(userId);
    user.isBlocked = !user.isBlocked;
    user.save();

    res.send(user.isBlocked);
  })
);

/**
 * @swagger
 * /api/users/getById/{userId}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve user details by user ID.
 *     tags: ["Users"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       404:
 *         description: User not found
 *       403:
 *         description: Unauthorized access
 */

router.get(
  '/getById/:userId',
  admin,
  handler(async (req, res) => {
    const { userId } = req.params;
    const user = await UserModel.findById(userId, { password: 0 });
    res.send(user);
  })
);

/**
 * @swagger
 * /api/users/update:
 *   put:
 *     summary: Update user information
 *     description: Update name, email, address, and admin status of a user.
 *     tags: ["Users"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "656fd15d9a8a6b001c8e32ef"
 *               name:
 *                 type: string
 *                 example: "Updated Name"
 *               email:
 *                 type: string
 *                 example: "updated@example.com"
 *               address:
 *                 type: string
 *                 example: "123 Updated Street"
 *               isAdmin:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: User information updated
 *       400:
 *         description: Invalid request data
 *       403:
 *         description: Unauthorized access
 */


router.put(
  '/update',
  admin,
  handler(async (req, res) => {
    const { id, name, email, address, isAdmin } = req.body;
    await UserModel.findByIdAndUpdate(id, {
      name,
      email,
      address,
      isAdmin,
    });

    res.send();
  })
);

const generateTokenResponse = user => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    address: user.address,
    isAdmin: user.isAdmin,
    token,
  };
};

export default router;
