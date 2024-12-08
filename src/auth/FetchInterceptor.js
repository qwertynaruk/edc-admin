import axios from 'axios';
import { notification } from 'antd';

import EnvRoute from 'utils/EnvRoute';

const service = axios.create({
  baseURL: `https://${EnvRoute.ROOT_AUTHENTICATION}.execute-api.ap-southeast-1.amazonaws.com/v1`,
  timeout: 60000,
});

service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    notification.error({
      message: 'Error',
    });
    Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default service;
