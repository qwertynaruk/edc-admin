import fetchMaster from 'axios/FetchMaster';
import { sanitizeService, serviceWrapper } from 'utils/serviceHelper';

const systemAdmin = serviceWrapper(sanitizeService(fetchMaster.system_admin));

const AccountService = {};

AccountService.peopleList = (params = {}) => {
  return systemAdmin({
    method: 'get',
    url: '/accounts',
    params,
  });
};

AccountService.peopleDetail = (params = {}) => {
  return systemAdmin({
    method: 'get',
    url: '/accounts/detail',
    params,
  });
};

AccountService.peopleUpdate = (options = {}) => {
  return systemAdmin({
    method: 'put',
    url: '/accounts',
    ...options,
  });
};

export default AccountService;
