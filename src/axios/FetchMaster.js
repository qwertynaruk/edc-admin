import A2O from 'utils/A2O';
import EnvRoute from 'utils/EnvRoute';
import axios from 'axios';
import { checkTimeOutAccessToken } from 'utils/accessAuth';
import { notification } from 'antd';

const SECONDS = 1000;
const timeout = 60 * SECONDS;

let refreshTokenStatus = false;

export const service = {
  local: axios.create({
    baseURL: `${EnvRoute.ROOT_MASTER_BASEURL}`,
    timeout,
  }),
  main: axios.create({
    baseURL: `${EnvRoute.ROOT_MASTER_BASEURL}${EnvRoute.ROOT_INVESTIGATIVE_CASE}`,
    timeout,
  }),
  master_indices: axios.create({
    baseURL: `${EnvRoute.ROOT_MASTER_BASEURL}${EnvRoute.ROOT_MASTER_INDICES}`,
    timeout,
  }),
  incident_report: axios.create({
    baseURL: `${EnvRoute.ROOT_MASTER_BASEURL}${EnvRoute.ROOT_INCIDENT_REPORT}`,
    timeout,
  }),
  incident_reporting: axios.create({
    baseURL: `${EnvRoute.ROOT_MASTER_BASEURL}${EnvRoute.ROOT_INCIDENT_REPORTING}`,
    timeout,
  }),
  one_command: axios.create({
    baseURL: `${EnvRoute.ROOT_MASTER_BASEURL}${EnvRoute.ROOT_ONE_COMMAND}`,
    timeout,
  }),
  system_admin: axios.create({
    baseURL: `${EnvRoute.ROOT_MASTER_BASEURL}${EnvRoute.ROOT_SYSTEM_ADMIN}`,
    timeout,
  }),
  system_admin_act: axios.create({
    baseURL: `${EnvRoute.ROOT_MASTER_BASEURL}${EnvRoute.ROOT_SYSTEM_ADMIN}`,
    timeout,
  }),
  asset: axios.create({
    baseURL: `${EnvRoute.ROOT_MASTER_BASEURL}${EnvRoute.ROOT_ASSET_MANAGEMENT}`,
    timeout,
  }),
  personnel: axios.create({
    baseURL: `${EnvRoute.ROOT_MASTER_BASEURL}${EnvRoute.ROOT_PERSONNEL}`,
    timeout,
  }),
  upload: axios.create({
    baseURL: `${EnvRoute.ROOT_MASTER_BASEURL}${EnvRoute.ROOT_UPLOAD}`,
    timeout,
  }),
  notification: axios.create({
    baseURL: `${EnvRoute.ROOT_MASTER_BASEURL}${EnvRoute.ROOT_NOTIFICATION}`,
    timeout,
  }),
  authentication: axios.create({
    baseURL: `${EnvRoute.ROOT_MASTER_BASEURL}${EnvRoute.ROOT_AUTHENTICATION}`,
    timeout,
  }),
  authentication_access_token: axios.create({
    baseURL: `${EnvRoute.ROOT_MASTER_BASEURL}${EnvRoute.ROOT_AUTHENTICATION}`,
    timeout,
  }),
  signUp: axios.create({
    baseURL: `${EnvRoute.ROOT_MASTER_BASEURL}${EnvRoute.ROOT_AUTHENTICATION}`,
    timeout,
  }),
  evidence: axios.create({
    baseURL: `${EnvRoute.ROOT_MASTER_BASEURL}${EnvRoute.ROOT_EVIDENCE}`,
    timeout,
  }),
  queue: axios.create({
    baseURL: `${EnvRoute.ROOT_MASTER_BASEURL}${EnvRoute.ROOT_QUEUE}`,
    timeout,
  }),
  advanceSearch: axios.create({
    baseURL: `${EnvRoute.ROOT_MASTER_BASEURL}${EnvRoute.ROOT_ADVANCE_SAERCH}`,
    timeout,
  }),
  log: axios.create({
    baseURL: `${EnvRoute.ROOT_MASTER_BASEURL}${EnvRoute.ROOT_ENV_LOG}`,
    timeout,
  }),
  gis: axios.create({
    baseURL: `${EnvRoute.ROOT_MASTER_BASEURL}${EnvRoute.ROOT_GIS}`,
    timeout,
  }),
  patrol: axios.create({
    baseURL: `${EnvRoute.ROOT_MASTER_BASEURL}${EnvRoute.ROOT_PATROL}`,
    timeout,
  }),
  alarm_monitoring: axios.create({
    baseURL: `${EnvRoute.ROOT_MASTER_BASEURL}${EnvRoute.ROOT_ALARM_MONITORING}`,
    timeout,
  }),
  user: axios.create({
    baseURL: `${EnvRoute.ROOT_MASTER_BASEURL}${EnvRoute.ROOT_USER}`,
    timeout,
  }),
};

const RequestInterceptor = {
  _config: (config) => {
    const { method, data, authorized = {}, headersKey = 'Authorization' } = config;
    const { enable = true, key_name = 'id_token' } = authorized;

    const getParse = localStorage.getItem('user-store') || null;
    const { accessAuthen = {} } = JSON.parse(getParse);
    const { id_token = '', access_token = '', queue_access_token = '' } = accessAuthen;

    const accessType = {
      id_token,
      access_token,
      queue_access_token,
    };

    if (enable) {
      config.headers[headersKey] = accessType[key_name];
    }

    const newConfig = {
      ...config,
      data: ['post', 'put'].includes(method) && data ? A2O.TRIMNULL(data) : data,
    };

    return newConfig;
  },
  _error: (error) => {
    notification.error({
      message: 'Error',
    });
    Promise.reject(error);
  },
};

const ResponseInterceptor = {
  _response: (response) => {
    return response.data;
  },
  _error: async (error) => {
    refreshTokenStatus = await checkTimeOutAccessToken(error, refreshTokenStatus);
    return Promise.reject(error?.response?.data);
  },
};

// API Request interceptor
service.main.interceptors.request.use(
  (config) => RequestInterceptor._config(config),
  (error) => RequestInterceptor._error(error)
);
service.master_indices.interceptors.request.use(
  (config) => RequestInterceptor._config(config),
  (error) => RequestInterceptor._error(error)
);
service.incident_report.interceptors.request.use(
  (config) => RequestInterceptor._config(config),
  (error) => RequestInterceptor._error(error)
);
service.incident_reporting.interceptors.request.use(
  (config) => RequestInterceptor._config(config),
  (error) => RequestInterceptor._error(error)
);
service.one_command.interceptors.request.use(
  (config) => RequestInterceptor._config(config),
  (error) => RequestInterceptor._error(error)
);
service.system_admin.interceptors.request.use(
  (config) => RequestInterceptor._config(config),
  (error) => RequestInterceptor._error(error)
);
service.asset.interceptors.request.use(
  (config) => RequestInterceptor._config(config),
  (error) => RequestInterceptor._error(error)
);
service.personnel.interceptors.request.use(
  (config) => RequestInterceptor._config(config),
  (error) => RequestInterceptor._error(error)
);
service.upload.interceptors.request.use(
  (config) => RequestInterceptor._config(config),
  (error) => RequestInterceptor._error(error)
);
service.notification.interceptors.request.use(
  (config) => RequestInterceptor._config(config),
  (error) => RequestInterceptor._error(error)
);
service.authentication.interceptors.request.use(
  (config) =>
    RequestInterceptor._config({
      ...config,
      authorized: {
        enable: false,
        key_name: 'id_token',
      },
    }),
  (error) => RequestInterceptor._error(error)
);
service.authentication_access_token.interceptors.request.use(
  (config) =>
    RequestInterceptor._config({
      ...config,
      authorized: {
        key_name: 'access_token',
      },
    }),
  (error) => RequestInterceptor._error(error)
);
service.signUp.interceptors.request.use(
  (config) => RequestInterceptor._config(config),
  (error) => RequestInterceptor._error(error)
);
service.evidence.interceptors.request.use(
  (config) => RequestInterceptor._config(config),
  (error) => RequestInterceptor._error(error)
);
service.queue.interceptors.request.use(
  (config) =>
    RequestInterceptor._config({
      ...config,
      headersKey: 'access_token',
      authorized: {
        key_name: 'queue_access_token',
      },
    }),
  (error) => RequestInterceptor._error(error)
);
service.advanceSearch.interceptors.request.use(
  (config) => RequestInterceptor._config(config),
  (error) => RequestInterceptor._error(error)
);
service.log.interceptors.request.use(
  (config) => RequestInterceptor._config(config),
  (error) => RequestInterceptor._error(error)
);
service.gis.interceptors.request.use(
  (config) => RequestInterceptor._config(config),
  (error) => RequestInterceptor._error(error)
);
service.patrol.interceptors.request.use(
  (config) => RequestInterceptor._config(config),
  (error) => RequestInterceptor._error(error)
);
service.alarm_monitoring.interceptors.request.use(
  (config) =>
    RequestInterceptor._config({
      ...config,
      authorized: {
        key_name: 'access_token',
      },
    }),
  (error) => RequestInterceptor._error(error)
);
service.user.interceptors.request.use(
  (config) =>
    RequestInterceptor._config({
      ...config,
      authorized: {
        key_name: 'access_token',
      },
    }),
  (error) => RequestInterceptor._error(error)
);
service.system_admin_act.interceptors.request.use(
  (config) =>
    RequestInterceptor._config({
      ...config,
      authorized: {
        key_name: 'access_token',
      },
    }),
  (error) => RequestInterceptor._error(error)
);

// API respone interceptor
service.main.interceptors.response.use(
  (response) => ResponseInterceptor._response(response),
  (error) => ResponseInterceptor._error(error)
);
service.master_indices.interceptors.response.use(
  (response) => ResponseInterceptor._response(response),
  (error) => ResponseInterceptor._error(error)
);
service.incident_report.interceptors.response.use(
  (response) => ResponseInterceptor._response(response),
  (error) => ResponseInterceptor._error(error)
);
service.one_command.interceptors.response.use(
  (response) => ResponseInterceptor._response(response),
  (error) => ResponseInterceptor._error(error)
);
service.system_admin.interceptors.response.use(
  (response) => ResponseInterceptor._response(response),
  (error) => ResponseInterceptor._error(error)
);
service.asset.interceptors.response.use(
  (response) => ResponseInterceptor._response(response),
  (error) => ResponseInterceptor._error(error)
);
service.personnel.interceptors.response.use(
  (response) => ResponseInterceptor._response(response),
  (error) => ResponseInterceptor._error(error)
);
service.upload.interceptors.response.use(
  (response) => ResponseInterceptor._response(response),
  (error) => ResponseInterceptor._error(error)
);
service.notification.interceptors.response.use(
  (response) => ResponseInterceptor._response(response),
  (error) => ResponseInterceptor._error(error)
);
service.evidence.interceptors.response.use(
  (response) => ResponseInterceptor._response(response),
  (error) => ResponseInterceptor._error(error)
);
service.authentication.interceptors.response.use(
  (response) => ResponseInterceptor._response(response),
  (error) => ResponseInterceptor._error(error)
);
service.authentication_access_token.interceptors.response.use(
  (response) => ResponseInterceptor._response(response),
  (error) => ResponseInterceptor._error(error)
);
service.signUp.interceptors.response.use(
  (response) => ResponseInterceptor._response(response),
  (error) => ResponseInterceptor._error(error)
);
service.advanceSearch.interceptors.response.use(
  (response) => ResponseInterceptor._response(response),
  (error) => ResponseInterceptor._error(error)
);
service.log.interceptors.response.use(
  (response) => ResponseInterceptor._response(response),
  (error) => ResponseInterceptor._error(error)
);
service.gis.interceptors.response.use(
  (response) => ResponseInterceptor._response(response),
  (error) => ResponseInterceptor._error(error)
);
service.patrol.interceptors.response.use(
  (response) => ResponseInterceptor._response(response),
  (error) => ResponseInterceptor._error(error)
);
service.alarm_monitoring.interceptors.response.use(
  (response) => ResponseInterceptor._response(response),
  (error) => ResponseInterceptor._error(error)
);
service.user.interceptors.response.use(
  (response) => ResponseInterceptor._response(response),
  (error) => ResponseInterceptor._error(error)
);
service.system_admin_act.interceptors.response.use(
  (response) => ResponseInterceptor._response(response),
  (error) => ResponseInterceptor._error(error)
);

export default service;
