import { model, Schema } from 'mongoose';

const ReviewSchema = new Schema(
  {
    foodId: { type: Schema.Types.ObjectId, ref: 'food', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    stars: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 500, trim: true },
  },
  { 
    timestamps: true,
    statics: {
      // Hàm tính toán avgStars có thể tái sử dụng
      async calculateAvgStars(foodId) {
        const result = await this.aggregate([
          { $match: { foodId } },
          { 
            $group: {
              _id: null,
              avgStars: { $avg: "$stars" },
              count: { $sum: 1 }
            }
          }
        ]);
        
        return result[0] 
          ? Math.round(result[0].avgStars * 10) / 10 || 0 
          : 0;
      }
    }
  }
);

// Middleware xử lý cập nhật avgStars
const updateFoodStars = async function(review) {
  try {
    const avgStars = await this.constructor.calculateAvgStars(review.foodId);
    await model('food').findByIdAndUpdate(
      review.foodId, 
      { stars: avgStars },
      { new: true }
    );
  } catch (error) {
    console.error('Failed to update food stars:', error);
  }
};

// Xử lý sau khi tạo/chỉnh sửa review
ReviewSchema.post('save', async function(doc) {
  await updateFoodStars.call(this, doc);
});

// Xử lý sau khi xóa review
ReviewSchema.post(['deleteOne', 'findOneAndDelete'], async function(doc) {
  if (doc) {
    await updateFoodStars.call(this, doc);
  }
});

// Thêm compound index để đảm bảo mỗi user chỉ review 1 lần cho 1 món ăn
ReviewSchema.index({ foodId: 1, userId: 1 }, { unique: true });

export const ReviewModel = model('review', ReviewSchema);