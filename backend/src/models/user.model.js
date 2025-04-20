import { model, Schema } from 'mongoose';

// Định nghĩa schema cho người dùng (User)
export const UserSchema = new Schema(
  {
    name: { type: String, required: true }, // Tên người dùng, bắt buộc
    email: { type: String, required: true, unique: true }, // Email, bắt buộc và duy nhất
    password: { type: String, required: true }, // Mật khẩu, bắt buộc (cần mã hóa trước khi lưu)
    address: { type: String, required: true }, // Địa chỉ của người dùng, bắt buộc
    isAdmin: { type: Boolean, default: false }, // Quyền admin, mặc định là `false`
    isBlocked: { type: Boolean, default: false }, // Trạng thái bị chặn, mặc định là `false`
    avatar: { type: String, default: '' }, // Đường dẫn đến ảnh đại diện, mặc định là chuỗi rỗng
    phone: { type: String, default: '' }, // Số điện thoại, mặc định là chuỗi rỗng
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

// Tạo model `UserModel` từ schema trên và liên kết với collection "user"
export const UserModel = model('user', UserSchema);