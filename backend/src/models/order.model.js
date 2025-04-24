import { model, Schema } from 'mongoose';
import { OrderStatus } from '../constants/orderStatus.js';
import { FoodModel } from './food.model.js';

// Schema lưu trữ tọa độ (latitude, longitude) của địa chỉ giao hàng
export const LatLngSchema = new Schema(
  {
    lat: { type: String }, // Vĩ độ (latitude)
    lng: { type: String }, // Kinh độ (longitude)
  },
  {
    _id: false, // Không tạo `_id` riêng cho schema này
  }
);

// Schema lưu thông tin một món ăn trong đơn hàng
export const OrderItemSchema = new Schema(
  {
    food: { type: FoodModel.schema, required: true }, // Thông tin món ăn, lấy từ FoodModel
    price: { type: Number, required: true }, // Giá của món ăn tại thời điểm đặt hàng
    quantity: { type: Number, required: true }, // Số lượng món ăn đặt
  },
  {
    _id: false, // Không tạo `_id` riêng cho từng mục trong đơn hàng
  }
);

// Middleware tự động tính giá của từng món trong đơn hàng trước khi validate
OrderItemSchema.pre('validate', function (next) {
  this.price = this.food.price * this.quantity; // Cập nhật giá dựa trên số lượng
  next();
});

// Schema chính của đơn hàng
const orderSchema = new Schema(
  {
    name: { type: String, required: true }, // Tên khách hàng đặt hàng
    address: { type: String, required: true }, // Địa chỉ giao hàng
    addressLatLng: { type: LatLngSchema }, // Tọa độ địa chỉ giao hàng
    paymentId: { type: String }, // ID thanh toán (ví dụ: từ PayPal, Stripe, v.v.)
    totalPrice: { type: Number, required: true }, // Tổng giá trị đơn hàng
    items: { type: [OrderItemSchema], required: true }, // Danh sách các món trong đơn hàng
    status: { type: String, default: OrderStatus.NEW }, // Trạng thái đơn hàng, mặc định là "NEW"
    user: { type: Schema.Types.ObjectId, required: true, ref: 'user' }, // Tham chiếu đến người dùng đã đặt hàng
  },
  {
    timestamps: true, // Tự động thêm `createdAt` và `updatedAt`
    toJSON: {
      virtuals: true, // Bao gồm các thuộc tính ảo khi chuyển đổi sang JSON
    },
    toObject: {
      virtuals: true, // Bao gồm các thuộc tính ảo khi chuyển đổi sang Object
    },
  }
);

// Tạo model `OrderModel` từ schema trên và liên kết với collection "order"
export const OrderModel = model('order', orderSchema);