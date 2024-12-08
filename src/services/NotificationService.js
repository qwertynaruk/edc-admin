import { useMutation, useQuery } from '@tanstack/react-query';

import fetchMaster from 'axios/FetchMaster';
import { sanitizeService } from 'utils/serviceHelper';

const notification = sanitizeService(fetchMaster.notification);

const NotificationService = {
  get: async (options = {}) => {
    return notification({
      method: 'get',
      url: '/notification/list',
      ...options,
    });
  },
  getCategoryList: async (options = {}) => {
    return notification({
      method: 'get',
      url: '/notification/category/list',
      ...options,
    });
  },
  update: async (id, data) => {
    return notification({
      method: 'put',
      url: '/notification',
      params: { id },
      data,
    });
  },
  useGetNotificationList(props) {
    return useQuery({
      queryKey: ['notification-list', props?.queryParams],
      enabled: !!props?.queryParams?.from,
      refetchInterval: props?.interval || undefined,
      refetchIntervalInBackground: props?.interval ? true : undefined,
      queryFn: async () =>
        await notification({
          method: 'GET',
          url: '/notification/list',
          params: props?.queryParams,
        }),
      select: (response) => {
        return response?.response;
      },
    });
  },
  useReadNotificationAll() {
    return useMutation({
      mutationFn: async () => {
        return await notification({
          method: 'PUT',
          url: `/notification/read_all`,
          data: { is_read: true },
        });
      },
    });
  },
};

export default NotificationService;
