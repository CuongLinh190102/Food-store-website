// Import mã lỗi HTTP 401 (Unauthorized) từ file hằng số
import { UNAUTHORIZED } from '../constants/httpStatus.js';

// Import middleware xác thực người dùng (JWT)
import authMid from './auth.mid.js';

// Middleware kiểm tra quyền admin
const adminMid = (req, res, next) => {
  // Nếu người dùng không phải admin, trả về HTTP 401 (Unauthorized)
  if (!req.user.isAdmin) res.status(UNAUTHORIZED).send();

  // Nếu là admin, tiếp tục xử lý request
  return next();
};

// Xuất ra một mảng middleware: 
// - `authMid`: Kiểm tra và xác thực JWT trước 
// - `adminMid`: Kiểm tra xem người dùng có quyền admin hay không
export default [authMid, adminMid];