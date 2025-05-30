import React from 'react';
import classes from './notFound.module.css';
import { Link } from 'react-router-dom';

// Component này được sử dụng để hiển thị thông báo không tìm thấy trang
export default function NotFound({ message, linkRoute, linkText }) {
  return (
    <div className={classes.container}>
      {message}
      <Link to={linkRoute}>{linkText}</Link>
    </div>
  );
}

NotFound.defaultProps = {
  message: 'Nothing Found!',
  linkRoute: '/',
  linkText: 'Go To Home Page',
};
