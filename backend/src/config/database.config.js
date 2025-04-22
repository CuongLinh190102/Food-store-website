import { connect, set } from 'mongoose';
import { UserModel } from '../models/user.model.js';
import { FoodModel } from '../models/food.model.js';
import { sample_users, sample_foods } from '../data.js';
import bcrypt from 'bcryptjs';

// Số vòng lặp (salt rounds) khi băm mật khẩu
const PASSWORD_HASH_SALT_ROUNDS = 10;

// Cấu hình Mongoose để sử dụng chế độ truy vấn nghiêm ngặt
set('strictQuery', true);

// Hàm kết nối cơ sở dữ liệu MongoDB
const dbconnect = async () => {
  try {
    // Kết nối đến MongoDB bằng URI từ biến môi trường
    connect(process.env.MONGO_URI, {
      useNewUrlParser: true, // Sử dụng bộ phân tích cú pháp URL mới
      useUnifiedTopology: true, // Dùng engine giám sát và khám phá server mới
    });

    // Gọi hàm seed để thêm dữ liệu mẫu vào database
    await seedUsers();
    await seedFoods();

    console.log('connect successfully---');
  } catch (error) {
    console.log(error); // Ghi log lỗi nếu kết nối thất bại
  }
};

// Hàm thêm dữ liệu mẫu cho bảng Users
async function seedUsers() {
  // Kiểm tra xem trong database đã có user nào chưa
  const usersCount = await UserModel.countDocuments();
  if (usersCount > 0) {
    console.log('Users seed is already done!'); // Nếu đã có, không thêm nữa
    return;
  }

  // Duyệt qua danh sách người dùng mẫu và mã hóa mật khẩu trước khi lưu vào database
  for (let user of sample_users) {
    user.password = await bcrypt.hash(user.password, PASSWORD_HASH_SALT_ROUNDS);
    await UserModel.create(user);
  }

  console.log('Users seed is done!'); // Thông báo đã thêm user thành công
}

// Hàm thêm dữ liệu mẫu cho bảng Foods
async function seedFoods() {
  // Kiểm tra xem trong database đã có dữ liệu món ăn chưa
  const foods = await FoodModel.countDocuments();
  if (foods > 0) {
    console.log('Foods seed is already done!'); // Nếu đã có, không thêm nữa
    return;
  }

  // Duyệt qua danh sách món ăn mẫu và cập nhật đường dẫn hình ảnh trước khi lưu vào database
  for (const food of sample_foods) {
    food.imageUrl = `/foods/${food.imageUrl}`;
    await FoodModel.create(food);
  }

  console.log('Foods seed Is Done!'); // Thông báo đã thêm food thành công
}

export { dbconnect, seedUsers, seedFoods }; // Xuất các hàm để sử dụng ở nơi khác