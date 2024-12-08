import fetch from 'axios/FetchMaster';
import { MAX_API_LIMIT } from 'constants/ApiConstant';
import { sanitizeService } from 'utils/serviceHelper';

const systemAdmin = sanitizeService(fetch.system_admin);
const main = sanitizeService(fetch.main);

const TeamService = {
  getMainAgencyTeam: async () => {
    return systemAdmin({
      method: 'get',
      url: '/attributes',
      params: {
        attribute_type_id: 78,
        limit: MAX_API_LIMIT,
      },
    });
  },

  getInvestigationTeam: async () => {
    return main({
      method: 'get',
      url: '/investigation_team',
    });
  },

  createInvestigationTeam: async (payload) => {
    return main({
      method: 'post',
      url: '/investigation_team',
      data: payload,
    });
  },

  updateInvestigationTeam: async (payload, _id) => {
    return main({
      method: 'put',
      url: `/investigation_team`,
      params: {
        _id,
      },
      data: payload,
    });
  },
};

export default TeamService;
