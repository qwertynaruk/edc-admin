import fetchMaster from 'axios/FetchMaster';
import { sanitizeService } from 'utils/serviceHelper';

const systemAdmin = sanitizeService(fetchMaster.system_admin);

const RoleService = {
  create: async (data) => {
    return systemAdmin({
      method: 'POST',
      url: '/roles',
      data,
    });
  },
  update: async (_id, data) => {
    return systemAdmin({
      method: 'PUT',
      url: '/roles',
      params: {
        _id,
      },
      data,
    });
  },
  get: async (options = {}) => {
    return systemAdmin({
      method: 'GET',
      url: '/roles',
      params: options.params,
      data: options.data,
    });
  },
  delete: async (_id) => {
    return systemAdmin({
      method: 'DELETE',
      url: '/roles',
      params: { _id },
    });
  },
  getApproval: async () => {
    return systemAdmin({
      method: 'GET',
      url: '/role_approvals',
    });
  },
};

export default RoleService;
