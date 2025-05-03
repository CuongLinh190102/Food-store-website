import axios from 'axios';

//Đặt URL cơ sở cho các yêu cầu axios
axios.interceptors.request.use(
  req => {
    const user = localStorage.getItem('user');
    const token = user && JSON.parse(user).token;
    if (token) {
      req.headers['Authorization'] = `Bearer ${token}`;
    }
    return req;
  },
  error => {
    return Promise.reject(error);
  }
);
