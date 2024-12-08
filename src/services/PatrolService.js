import service from 'axios/FetchMaster';
import { sanitizeService } from 'utils/serviceHelper';

const patrol = sanitizeService(service.patrol);
const PatrolService = {
  patrolTransactionList: (options) => patrol({ method: 'GET', url: '/patrol/transaction/list', ...options }),
  list: (options) => patrol({ method: 'GET', url: '/patrol/list', ...options }),
  typeList: (options) => patrol({ method: 'GET', url: '/patrol/type/list', ...options }),
  createTypeDetail: (options) => patrol({ method: 'POST', url: '/patrol/type', ...options }),
  typeDetail: (options) => patrol({ method: 'GET', url: '/patrol/type', ...options }),
  updateTypeDetail: (options) => patrol({ method: 'PUT', url: '/patrol/type', ...options }),
  createPatrol: (options) => patrol({ method: 'POST', url: '/patrol', ...options }),
  readPatrol: (options) => patrol({ method: 'GET', url: '/patrol', ...options }),
  updatePatrol: (options) => patrol({ method: 'PUT', url: '/patrol', ...options }),
};

export default PatrolService;
