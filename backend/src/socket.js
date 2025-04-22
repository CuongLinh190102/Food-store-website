import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { ReviewModel } from './models/review.model.js';

let io; // Biến lưu trữ instance Socket.io

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
      optionsSuccessStatus: 200
    },
  });

  // Middleware xác thực JWT
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Unauthorized'));

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.error('JWT verify error:', err);
        socket.disconnect(true);
        return next(new Error('Forbidden'));
      }
      socket.user = user;
      next();
    });
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.user.id} connected`);

    // Tham gia phòng theo foodId
    socket.on('subscribe-food', (foodId) => {
      socket.join(`food_${foodId}`);
      console.log(`User ${socket.user.id} joined food_${foodId}`);
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.user.id} disconnected`);
    });
  });

  return io;
}

// Hàm emit event khi có thay đổi review
export const notifyReviewUpdate = async (reviewId, action) => {
  if (!io) {
    console.error('Socket.io not initialized');
    return;
  }

  try {
    const review = await ReviewModel.findById(reviewId).populate('userId', 'name avatar');
    if (!review) return;

    const avgStars = await ReviewModel.calculateAvgStars(review.foodId);

    const data = {
      foodId: review.foodId,
      avgStars,
      review: review.toObject(),
      action, // 'created' | 'updated' | 'deleted'
    };

    // Gửi đến tất cả clients trong phòng food tương ứng
    io.to(`food_${review.foodId}`).emit('review-update', data);
    console.log(`Emitted review-update for food_${review.foodId}`);
  } catch (err) {
    console.error('Socket emit error:', err);
  }
};

export function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}