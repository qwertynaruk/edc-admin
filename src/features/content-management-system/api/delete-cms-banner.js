import { useMutation } from '@tanstack/react-query';

import { apiClient } from 'lib/api-client';
import { API_ONE_LIFE_ENDPOINT_URL } from 'configs/AppConfig';
import { cmsQueryKeys } from 'lib/query-keys';
import { queryClient } from 'lib/react-query';

export const deleteCmsBanner = (banner_id) =>
  apiClient.delete(`/cms/banner`, {
    baseURL: API_ONE_LIFE_ENDPOINT_URL,
    params: {
      banner_id,
    },
  });

export const useDeleteCmsBanner = ({ onSuccess }) => {
  const { mutate, isPending } = useMutation({
    mutationFn: deleteCmsBanner,
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
