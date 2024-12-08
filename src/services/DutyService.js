import fetchMaster from 'axios/FetchMaster';
import { sanitizeService, serviceWrapper } from 'utils/serviceHelper';

const personnel = serviceWrapper(sanitizeService(fetchMaster.personnel));

const DutyService = {};

DutyService.duties = (params = {}) => {
  return personnel({
    method: 'get',
    url: '/personnel_duties',
    params,
  });
};

export default DutyService;
