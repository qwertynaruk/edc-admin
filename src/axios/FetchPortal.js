import axios from 'axios';
const ONE_FORCE_WEBFORM_BASE_URL = 'https://3ulz9p9wf9.execute-api.ap-southeast-1.amazonaws.com/v1';

const service = axios.create({
  baseURL: ONE_FORCE_WEBFORM_BASE_URL,
  timeout: 60000,
});

// API respone interceptor
service.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { service };
