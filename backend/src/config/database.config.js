import { connect, set } from 'mongoose';
import { UserModel } from '../models/user.model.js';
import { FoodModel } from '../models/food.model.js';
import { sample_users, sample_foods } from '../data.js';
import bcrypt from 'bcryptjs';

// Số vòng lặp (salt rounds) khi băm mật khẩu
const PASSWORD_HASH_SALT_ROUNDS = 10;

// Cấu hình Mongoose để sử dụng chế độ truy vấn nghiêm ngặt
set('strictQuery', true);

const dbconnect = async () => {
  try {
    connect(process.env.MONGO_URI, {
      useNewUrlParser: true, // Sử dụng bộ phân tích cú pháp URL mới
      useUnifiedTopology: true, // Dùng engine giám sát và khám phá server mới
    });

    // Gọi hàm seed để thêm dữ liệu mẫu vào database
    await seedUsers();
    await seedFoods();

    console.log('connect successfully---');
  } catch (error) {
    console.log(error);
  }
};

async function seedUsers() {
  const usersCount = await UserModel.countDocuments();
  if (usersCount > 0) {
    console.log('Users seed is already done!'); // Nếu đã có, không thêm nữa
    return;
  }

  // Mã hóa mật khẩu cho từng người dùng 
  for (let user of sample_users) {
    user.password = await bcrypt.hash(user.password, PASSWORD_HASH_SALT_ROUNDS);
    await UserModel.create(user);
  }

  console.log('Users seed is done!');
}

// Hàm thêm dữ liệu mẫu cho bảng Foods
async function seedFoods() {
  const foods = await FoodModel.countDocuments();
  if (foods > 0) {
    console.log('Foods seed is already done!'); // Nếu đã có, không thêm nữa
    return;
  }

  // Cập nhật đường dẫn hình ảnh cho từng món ăn
  for (const food of sample_foods) {
    food.imageUrl = `/foods/${food.imageUrl}`;
    await FoodModel.create(food);
  }

  console.log('Foods seed Is Done!');
}

export { dbconnect, seedUsers, seedFoods };