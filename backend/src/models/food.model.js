import { model, Schema } from 'mongoose';

export const FoodSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    tags: { type: [String] }, // Mảng các thẻ (tags) mô tả món ăn
    stars: { type: Number, min: 0, max: 5, default: 0 },
    imageUrl: { type: String, required: true }, // Đường dẫn đến hình ảnh món ăn
    origins: { type: [String], required: true }, // Nguồn gốc món ăn 
    cookTime: { type: String, required: true }, 
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
    versionKey: false,
  }
);

export const FoodModel = model('food', FoodSchema);
