import fetchMaster from 'axios/FetchMaster';
import { sanitizeService } from 'utils/serviceHelper';

const massNotification = sanitizeService(fetchMaster.notification);

const MassNotificationService = {
  get: async (params) => {
    return massNotification({
      method: 'GET',
      url: '/notification-config/list',
      params,
    });
  },
  update: async (data) => {
    return massNotification({
      method: 'PUT',
      url: '/notification-config',
      data: {
        data,
      },
    });
  },
  notify: async (data) => {
    return massNotification({
      method: 'POST',
      url: '/notify',
      data: {
        data,
      },
    });
  },
  post: async (data) => {
    return massNotification({
      method: 'POST',
      url: '/notification/mq',
      data: {
        // channel_content_ids: ['lau', 'loa', 'pmm', 'aws_ses', 'mb_sms', 'udc_app', 'udc_mobile_app'],
        channel_content_ids: ['aws_ses', 'mkt_sms', 'pty_app', 'pty_mobile_app'],
        config_type: 'mass_notification',
        status: 'รอส่ง',
        ...data,
      },
    });
  },
};

export default MassNotificationService;
