import { useMutation } from '@tanstack/react-query';

import { apiClient } from 'lib/api-client';
import { API_ONE_LIFE_ENDPOINT_URL } from 'configs/AppConfig';
import { cmsQueryKeys } from 'lib/query-keys';
import { queryClient } from 'lib/react-query';

export const updateCmsBannerOrders = ({ data, ...params }) =>
  apiClient.put('/cms/banner/order', data, {
    baseURL: API_ONE_LIFE_ENDPOINT_URL,
    params,
  });

export const useUpdateCmsBannerOrders = ({ onSuccess, ...params }) => {
  const { mutate, isPending } = useMutation({
    mutationFn: (data) =>
      updateCmsBannerOrders({
        data,
        ...params,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries([cmsQueryKeys.banner.all]);
      onSuccess?.();
    },
  });

  return {
    submit: mutate,
    isLoading: isPending,
  };
};
