import fetch from 'axios/FetchMaster';
import { sanitizeService } from 'utils/serviceHelper';

const log = sanitizeService(fetch.log);

const LogService = {
  log: async (options = {}) => {
    return log({
      method: 'get',
      url: '/log',
      ...options,
    });
  },
};

export default LogService;
