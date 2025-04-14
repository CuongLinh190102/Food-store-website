import { Router } from 'express';
import handler from 'express-async-handler';
import auth from '../middleware/auth.mid.js';
import { BAD_REQUEST } from '../constants/httpStatus.js';
import { OrderModel } from '../models/order.model.js';
import { OrderStatus } from '../constants/orderStatus.js';
import { UserModel } from '../models/user.model.js';
import { sendEmailReceipt } from '../helpers/mail.helper.js';

const router = Router();
router.use(auth);

/**
 * @swagger
 * tags:
 *   - name: "Order"
 *     description: "APIs for managing orders"
 */

/**
 * @swagger
 * /api/orders/create:
 *   post:
 *     summary: "Create a new order"
 *     tags: [Order]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                    productId:
 *                     type: string
 *                   quantity:
 *                    type: number
 *             example:
 *               items: [{ "productId": "67bdb5feeadd4e1ba0e4e342", "quantity": 2 }]
 *     responses:
 *       200:
 *         description: "Order created successfully"
 *       400:
 *         description: "Cart is empty"
 *       401:
 *         description: "Unauthorized"
 *       500:
 *         description: "Internal server error"
 */

router.post(
  '/create',
  handler(async (req, res) => {
    const order = req.body;

    if (!order.items || order.items.length <= 0) 
      return res.status(BAD_REQUEST).send('Cart Is Empty!');

    await OrderModel.deleteOne({
      user: req.user.id,
      status: OrderStatus.NEW,
    });

    const newOrder = new OrderModel({ ...order, user: req.user.id });
    await newOrder.save();

    res.status(200).send(newOrder);
  })
);

// paymentId do bên Paypal cung cấp nên khó test API bằng Postman
router.put(
  '/pay',
  handler(async (req, res) => {
    const { paymentId } = req.body;
    const order = await getNewOrderForCurrentUser(req);
    if (!order) {
      res.status(BAD_REQUEST).send('Order Not Found!');
      return;
    }

    order.paymentId = paymentId;
    order.status = OrderStatus.PAYED;
    await order.save();

    sendEmailReceipt(order);

    res.send(order._id);
  })
);

/**
 * @swagger
 * /api/orders/track/{orderId}:
 *   get:
 *     summary: "Track an order by ID"
 *     tags: [Order]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID of the order to track"
 *     responses:
 *       200:
 *         description: "Order details"
 *       401:
 *         description: "Unauthorized access"
 */

router.get(
  '/track/:orderId',
  handler(async (req, res) => {
    const { orderId } = req.params;
    const user = await UserModel.findById(req.user.id);

    const filter = {
      _id: orderId,
    };

    if (!user.isAdmin) {
      filter.user = user._id;
    }

    const order = await OrderModel.findOne(filter);

    if (!order) return res.send(UNAUTHORIZED);

    return res.send(order);
  })
);

/**
 * @swagger
 * /api/orders/newOrderForCurrentUser:
 *   get:
 *     summary: "Get the latest order for the current user"
 *     tags: [Order]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: "Latest order"
 *       400:
 *         description: "No order found"
 */

router.get(
  '/newOrderForCurrentUser',
  handler(async (req, res) => {
    const order = await getNewOrderForCurrentUser(req);
    if (order) res.send(order);
    else res.status(BAD_REQUEST).send();
  })
);

/**
 * @swagger
 * /api/orders/allstatus:
 *   get:
 *     summary: "Get all possible order statuses"
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: "List of all order statuses"
 */

router.get('/allstatus', (req, res) => {
  const allStatus = Object.values(OrderStatus);
  res.send(allStatus);
});

/**
 * @swagger
 * /api/orders/{status}:
 *   get:
 *     summary: "Get orders by status"
 *     tags: [Order]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: status
 *         in: path
 *         required: false
 *         schema:
 *           type: string
 *         description: "Filter orders by status"
 *     responses:
 *       200:
 *         description: "List of orders"
 */

router.get(
  '/:status?',
  handler(async (req, res) => {
    const status = req.params.status;
    const user = await UserModel.findById(req.user.id);
    const filter = {};

    if (!user.isAdmin) filter.user = user._id;
    if (status) filter.status = status;

    const orders = await OrderModel.find(filter).sort('-createdAt');
    res.send(orders);
  })
);

const getNewOrderForCurrentUser = async req =>
  await OrderModel.findOne({
    user: req.user.id,
    status: OrderStatus.NEW,
  }).populate('user');
export default router;
