import { model, Schema } from 'mongoose';

export const FavoriteSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    foodId: { type: Schema.Types.ObjectId, ref: 'Food', required: true },
  },
  { 
    timestamps: true,
    // Đảm bảo mỗi cặp userId + foodId là duy nhất
    statics: {
      async isFavorite(userId, foodId) {
        return await this.exists({ userId, foodId });
      }
    } 
  }
);

// Đảm bảo mỗi cặp (userId, foodId) là duy nhất
FavoriteSchema.index({ userId: 1, foodId: 1 }, { unique: true });

export const FavoriteModel = model('Favorite', FavoriteSchema);