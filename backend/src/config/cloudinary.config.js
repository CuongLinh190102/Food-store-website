// Import Cloudinary SDK (phiên bản v2) để sử dụng dịch vụ lưu trữ hình ảnh
import { v2 as cloudinary } from 'cloudinary';

// Hàm cấu hình Cloudinary
export const configCloudinary = () => {
  // Thiết lập thông tin cấu hình bằng cách lấy giá trị từ biến môi trường
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Tên tài khoản Cloudinary
    api_key: process.env.CLOUDINARY_API_KEY,       // API key để xác thực
    api_secret: process.env.CLOUDINARY_API_SECRET, // API secret để bảo mật
  });

  // Trả về đối tượng Cloudinary đã được cấu hình
  return cloudinary;
};