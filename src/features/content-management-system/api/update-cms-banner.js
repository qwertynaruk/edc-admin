import { useMutation } from '@tanstack/react-query';

import { apiClient } from 'lib/api-client';
import { API_ONE_LIFE_ENDPOINT_URL } from 'configs/AppConfig';
import { cmsQueryKeys } from 'lib/query-keys';
import { queryClient } from 'lib/react-query';

export const updateCmsBanner = (banner_id, data) =>
  apiClient.put(`/cms/banner`, data, {
    baseURL: API_ONE_LIFE_ENDPOINT_URL,
    params: {
      banner_id,
    },
  });

export const useUpdateCmsBanner = ({ bannerId, onSuccess }) => {
  const { mutate, isPending } = useMutation({
    mutationFn: (data) => updateCmsBanner(bannerId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries([cmsQueryKeys.banner.all]);
      await queryClient.invalidateQueries([cmsQueryKeys.banner.one(bannerId)]);
      onSuccess?.();
    },
  });

  return {
    submit: mutate,
    isLoading: isPending,
  };
};
