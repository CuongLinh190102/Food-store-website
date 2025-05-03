import React, { Children } from 'react';
import { useAuth } from '../../hooks/useAuth';
import NotFound from '../NotFound/NotFound';
import AuthRoute from '../AuthRoute/AuthRoute';

// Bảo vệ route admin, chỉ cho phép admin truy cập
// Nếu không phải admin, chuyển hướng về trang NotFound với thông báo lỗi
function AdminRoute({ children }) {
  const { user } = useAuth();
  return user.isAdmin ? (
    children
  ) : (
    <NotFound
      linkRoute="/dashboard"
      linkText="Go to Dashboard"
      message="You don't have access to this page"
    />
  );
}

const AdminRouteExport = ({ children }) => (
  <AuthRoute>
    <AdminRoute>{children}</AdminRoute>
  </AuthRoute>
);

export default AdminRouteExport;
