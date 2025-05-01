import { v2 as cloudinary } from 'cloudinary';

export const configCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Tên tài khoản Cloudinary
    api_key: process.env.CLOUDINARY_API_KEY,       // API key để xác thực
    api_secret: process.env.CLOUDINARY_API_SECRET, // API secret để bảo mật
  });

  return cloudinary;
};