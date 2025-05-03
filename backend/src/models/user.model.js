import { model, Schema } from 'mongoose';

export const UserSchema = new Schema(
  {
    avatar: { type: String, default: '' }, // Đường dẫn đến ảnh đại diện, mặc định là chuỗi rỗng
    name: { type: String, required: true }, 
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false }, // Trạng thái bị chặn, mặc định là `false`
    phone: { type: String, default: '' }, 
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

export const UserModel = model('user', UserSchema);