// tests/backend/config/database.config.test.js
import { seedUsers, seedFoods } from '../../../backend/src/config/database.config.js';
import { UserModel } from '../../../backend/src/models/user.model.js';
import { FoodModel } from '../../../backend/src/models/food.model.js';

// Mock tất cả dependencies
jest.mock('../../../backend/src/models/user.model');
jest.mock('../../../backend/src/models/food.model');

describe('Database Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test seedUsers()
  describe('seedUsers()', () => {
    test('should NOT seed users if already exists', async () => {
      UserModel.countDocuments.mockResolvedValue(1); // Giả lập đã có data
      await seedUsers();
      expect(UserModel.create).not.toHaveBeenCalled(); // Không gọi create
    });

    test('should seed users if DB is empty', async () => {
      UserModel.countDocuments.mockResolvedValue(0);
      await seedUsers();
      expect(UserModel.create).toHaveBeenCalled();
    });
  });

  // Test seedFoods() 
  describe('seedFoods()', () => {
    test('should NOT seed foods if already exists', async () => {
      FoodModel.countDocuments.mockResolvedValue(1);
      await seedFoods();
      expect(FoodModel.create).not.toHaveBeenCalled();
    });

    test('should modify imageUrl and seed foods if empty', async () => {
      FoodModel.countDocuments.mockResolvedValue(0);
      await seedFoods();
      expect(FoodModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          imageUrl: expect.stringMatching(/^\/foods\//) // Kiểm tra đã thêm prefix
        })
      );
    });
  });
});