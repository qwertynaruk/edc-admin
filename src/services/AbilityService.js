import fetchMaster from 'axios/FetchMaster';
import { sanitizeService } from 'utils/serviceHelper';

const systemAdmin = sanitizeService(fetchMaster.system_admin);
const AbilityService = {
  get: async (params, data) => {
    return systemAdmin({
      method: 'get',
      url: '/abilities',
      params,
      data,
    });
  },
  permissions: async (options = {}) => {
    return systemAdmin({
      method: 'get',
      url: '/permissions',
      ...options,
    });
  },
};

export default AbilityService;
