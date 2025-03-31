// Import hàm `verify` từ thư viện `jsonwebtoken` để xác thực và giải mã JWT
import { verify } from 'jsonwebtoken';

// Import mã lỗi HTTP 401 (UNAUTHORIZED) từ file hằng số
import { UNAUTHORIZED } from '../constants/httpStatus.js';

// Xuất mặc định một middleware dùng để xác thực JWT
export default (req, res, next) => {
  // Lấy token từ request header (trường access_token)
  const token = req.headers.access_token;

  // Nếu không có token, trả về HTTP status 401 (Unauthorized)
  if (!token) return res.status(UNAUTHORIZED).send();

  try {
    // Giải mã và xác thực token bằng secret key (lấy từ biến môi trường)
    const decoded = verify(token, process.env.JWT_SECRET);

    // Gán dữ liệu giải mã vào `req.user` để các middleware hoặc route tiếp theo có thể sử dụng
    req.user = decoded;
  } catch (error) {
    // Nếu token không hợp lệ hoặc hết hạn, trả về HTTP status 401
    res.status(UNAUTHORIZED).send();
  }

  // Gọi `next()` để tiếp tục xử lý request
  return next();
};