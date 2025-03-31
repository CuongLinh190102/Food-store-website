import { model, Schema } from 'mongoose';

// Định nghĩa schema (cấu trúc dữ liệu) cho món ăn (Food)
export const FoodSchema = new Schema(
  {
    name: { type: String, required: true }, // Tên món ăn, bắt buộc
    price: { type: Number, required: true }, // Giá món ăn, bắt buộc
    tags: { type: [String] }, // Danh sách các tag mô tả món ăn (ví dụ: "spicy", "vegan")
    favorite: { type: Boolean, default: false }, // Đánh dấu món ăn yêu thích, mặc định là false
    stars: { type: Number, default: 3 }, // Số sao đánh giá món ăn, mặc định là 3
    imageUrl: { type: String, required: true }, // URL hình ảnh món ăn, bắt buộc
    origins: { type: [String], required: true }, // Xuất xứ món ăn (ví dụ: ["Vietnam", "Thailand"]), bắt buộc
    cookTime: { type: String, required: true }, // Thời gian nấu món ăn, bắt buộc
  },
  {
    toJSON: {
      virtuals: true, // Cho phép thêm các trường ảo vào dữ liệu JSON khi lấy từ database
    },
    toObject: {
      virtuals: true, // Cho phép thêm các trường ảo khi chuyển đổi sang object
    },
    timestamps: true, // Tự động thêm `createdAt` và `updatedAt` cho mỗi document
  }
);

// Tạo model `FoodModel` từ schema trên và liên kết với collection "food"
export const FoodModel = model('food', FoodSchema);