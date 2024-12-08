import fetchMaster from 'axios/FetchMaster';
import { sanitizeService } from 'utils/serviceHelper';

const alarmMonitoring = sanitizeService(fetchMaster.alarm_monitoring);

const AlarmMonitoringService = {
  getOrganizationInfo: async () => {
    return alarmMonitoring({
      method: 'get',
      url: '/organization_info/alarm_monitoring/share',
    });
  },
  getAlarmMonitoringPahtShare: async (path = null, data) => {
    return alarmMonitoring({
      method: 'post',
      url: `/alarm_monitoring/${path}/share`,
      data,
    });
  },
  getAlarmMonitoringID: async (id) => {
    return alarmMonitoring({ method: 'get', url: `/alarm_monitoring/${id}` });
  },
  getAlarmMonitoringListParams: async (
    params = {
      page: 1,
      page_size: 10,
      sort_field: 'created_at',
      sort_value: 'DESC',
    }
  ) => {
    return alarmMonitoring({
      method: 'get',
      url: '/alarm_monitoring',
      params,
    });
  },
};

export default AlarmMonitoringService;
