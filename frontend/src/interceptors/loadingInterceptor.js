import axios from 'axios';

// interceptor này được sử dụng để hiển thị và ẩn các chỉ báo tải trong khi yêu cầu API.
export const setLoadingInterceptor = ({ showLoading, hideLoading }) => {
  axios.interceptors.request.use(
    req => {
      if (!(req.data instanceof FormData)) showLoading();
      return req;
    },
    error => {
      hideLoading();
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    res => {
      hideLoading();
      return res;
    },
    error => {
      hideLoading();
      return Promise.reject(error);
    }
  );
};

export default setLoadingInterceptor;
