import { ReviewModel } from '../../../backend/src/models/review.model.js';

describe('Review Model', () => {
  describe('calculateAvgStars()', () => {
    beforeEach(() => {
      ReviewModel.aggregate = jest.fn();
    });

    test('should return 0 when no reviews', async () => {
      ReviewModel.aggregate.mockResolvedValue([]);
      const result = await ReviewModel.calculateAvgStars('food123');
      expect(result).toBe(0);
    });

    test('should calculate correct average with rounding', async () => {
      ReviewModel.aggregate.mockResolvedValue([{
        _id: null,
        avgStars: 4.26,
        count: 5
      }]);
      
      const result = await ReviewModel.calculateAvgStars('food123');
      expect(result).toBe(4.3);
    });

    test('should handle MongoDB aggregate error', async () => {
      ReviewModel.aggregate.mockRejectedValue(new Error('DB error'));
      await expect(ReviewModel.calculateAvgStars('food123'))
        .rejects.toThrow('DB error');
    });
  });
});