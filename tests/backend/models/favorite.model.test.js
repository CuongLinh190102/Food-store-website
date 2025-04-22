import { FavoriteModel } from '../../../backend/src/models/favorite.model.js';

describe('Favorite Model', () => {
  describe('isFavorite() static method', () => {
    let mockExists;

    beforeEach(() => {
      mockExists = jest.fn();
      FavoriteModel.exists = mockExists;
    });

    test('should call exists() with correct query', async () => {
      const userId = 'user123';
      const foodId = 'food456';
      
      await FavoriteModel.isFavorite(userId, foodId);
      
      expect(mockExists).toHaveBeenCalledWith({ 
        userId: 'user123', 
        foodId: 'food456' 
      });
    });

    test('should return true when favorite exists', async () => {
      mockExists.mockResolvedValue(true);
      const result = await FavoriteModel.isFavorite('user123', 'food456');
      expect(result).toBe(true);
    });

    test('should return false when favorite not exists', async () => {
      mockExists.mockResolvedValue(false);
      const result = await FavoriteModel.isFavorite('user123', 'food456');
      expect(result).toBe(false);
    });
  });
});