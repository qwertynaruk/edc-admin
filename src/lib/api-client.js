import { API_ONE_LIFE_ENDPOINT_URL } from 'configs/AppConfig';
import Axios from 'axios';
import UserStore from 'mobx/UserStore';
import { handleError } from './handle-error';
import { notification } from 'antd';

export const apiClient = Axios.create({
  baseURL: API_ONE_LIFE_ENDPOINT_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = UserStore.accessAuthen.id_token;
    if (token && config?.headers?.Authorization !== null) {
      config.headers.Authorization = token;
    }
    if (config?.headers?.Authorization === null) {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    let message =
      error?.response?.data?.response?.error_message ||
      error.response?.data?.errorMessage ||
      error.response?.data?.message ||
      error.response?.data?.Message ||
      error.message ||
      error;

    message = handleError(error, message);

    if (message === 'Network Error' || message?.toLowerCase()?.includes('auth')) {
      window.location.href = '/auth/login' + '?redirect=' + window.location.pathname + window.location.search;
      return Promise.reject(error);
    }

    if (error.response?.status === 404) {
      return Promise.reject(error);
    }

    notification.error({
      message: 'เกิดข้อผิดพลาด',
      description: message,
    });

    return Promise.reject(error);
  }
);
