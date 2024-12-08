import fetchMaster from 'axios/FetchMaster';
import { sanitizeService } from 'utils/serviceHelper';

const oneCommand = sanitizeService(fetchMaster.one_command);

const OneCommandService = {
  getEmbededUrl: async (qsId) => {
    return oneCommand({
      method: 'get',
      url: 'dashboard/get_url',
      params: {
        DashboardId: qsId,
      },
    });
  },
};

export default OneCommandService;
