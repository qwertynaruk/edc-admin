import fetch from 'axios/FetchMaster';
import { sanitizeService } from 'utils/serviceHelper';

const attributes = sanitizeService(fetch.upload);

const UploadAttactmentService = {
  fetchDrugType: async () => {
    return attributes({
      method: 'get',
      url: '/drug-type/list',
    });
  },
  fetchDrugGroupType: async () => {
    return attributes({
      method: 'get',
      url: '/drug/list',
    });
  },
  fetchFirearmType: async () => {
    return attributes({
      method: 'get',
      url: '/weapon-type/list',
    });
  },
  fetchFirearmGroupType: async () => {
    return attributes({
      method: 'get',
      url: '/weapon/list',
    });
  },
};

export default UploadAttactmentService;
