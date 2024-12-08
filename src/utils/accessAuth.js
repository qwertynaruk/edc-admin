import EnvRoute from 'utils/EnvRoute';
import { TIME_REFRESH_TOKEN } from 'configs/AppConfig';
import _ from 'lodash';
import axios from 'axios';

export const checkTimeOutAccessToken = async (error, refreshTokenStatus) => {
  const findStatusCode = JSON.stringify(error).search('403');
  const findStatusCode401 = JSON.stringify(error).search('401');
  const networkErrorCode = JSON.stringify(error).search('Network Error');
  // console.log(
  //   'error',
  //   JSON.stringify(error),
  //   'status',
  //   findStatusCode,
  //   findStatusCode401,
  //   networkErrorCode,
  //   'refreshTokenStatus',
  //   refreshTokenStatus
  // );
  if (findStatusCode >= 0 || findStatusCode401 >= 0 || networkErrorCode >= 0) {
    if (!refreshTokenStatus) {
      const getParse = localStorage.getItem('user-store') || null;
      const userStore = JSON.parse(getParse);
      const checkTimeOut = checkTimeOutToken(userStore);
      // console.log('checkTimeOut', checkTimeOut);
      if (userStore?.accessAuthen?.refresh_token && checkTimeOut) {
        refreshTokenStatus = true;

        await axios
          .post(`${EnvRoute.ROOT_MASTER_BASEURL}${EnvRoute.ROOT_AUTHENTICATION}/refresh_token`, {
            refresh_token: userStore?.accessAuthen?.refresh_token,
          })
          .then(function (response) {
            SetAccessAuth({ ...userStore?.accessAuthen, ...response?.data?.data });
          })
          .catch(function (error) {
            console.log('error', error);
          })
          .finally(() => {
            refreshTokenStatus = false;
          });
      }
    }
  }
  return refreshTokenStatus;
};

export const checkTimeOutToken = (userStore) => {
  if (!_.isEmpty(userStore)) {
    const currentDate = new Date();
    const toMiliTime = currentDate.getTime();
    return toMiliTime > (userStore?.accessAuthen?.expires_at || 0);
  } else {
    return false;
  }
};

export const SetAccessAuth = (accessAuthen = null) => {
  if (!_.isEmpty(accessAuthen)) {
    const signDate = new Date();
    signDate.setSeconds(signDate.getSeconds() + _.get(accessAuthen, 'expires_in', TIME_REFRESH_TOKEN));
    accessAuthen.expires_at = signDate.getTime();
    const userLocalStore = localStorage.getItem('user-store') || {};
    const userLocalStoreJSON = JSON.parse(userLocalStore);
    userLocalStoreJSON.accessAuthen = accessAuthen;
    axios.defaults.headers.common.Authorization = accessAuthen?.access_token;
    if (userLocalStoreJSON) {
      localStorage.setItem('user-store', JSON.stringify(userLocalStoreJSON));
    }
  }
};
