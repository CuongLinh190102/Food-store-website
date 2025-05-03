import { model, Schema } from 'mongoose';
import { OrderStatus } from '../constants/orderStatus.js';
import { FoodModel } from './food.model.js';

// Schema lưu trữ tọa độ địa chỉ giao hàng
export const LatLngSchema = new Schema(
  {
    lat: { type: String, require: true }, // Vĩ độ
    lng: { type: String, require: true }, // Kinh độ
  },
  {
    _id: false, // Không tạo _id cho schema này
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
    _id: false, // Không tạo _id riêng cho schema này
  }
);

OrderItemSchema.pre('validate', function (next) {
  this.price = this.food.price * this.quantity; // Cập nhật giá dựa trên số lượng
  next();
});

// Schema chính của đơn hàng
const orderSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    addressLatLng: { type: LatLngSchema, require: true }, // Tọa độ địa chỉ giao hàng
    paymentId: { type: String }, 
    totalPrice: { type: Number, required: true },
    items: { type: [OrderItemSchema], required: true }, // Danh sách các món trong đơn hàng
    status: { type: String, default: OrderStatus.NEW }, // Trạng thái đơn hàng, mặc định là "NEW"
    user: { type: Schema.Types.ObjectId, required: true, ref: 'user' }, // Tham chiếu đến người dùng đã đặt hàng
  },
  {
    timestamps: true, 
    toJSON: {
      virtuals: true, 
    },
    toObject: {
      virtuals: true, 
    },
  }
);

export const OrderModel = model('order', orderSchema);