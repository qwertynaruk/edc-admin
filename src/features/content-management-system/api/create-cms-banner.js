import { useMutation } from '@tanstack/react-query';

import { apiClient } from 'lib/api-client';
import { API_ONE_LIFE_ENDPOINT_URL } from 'configs/AppConfig';
import { cmsQueryKeys } from 'lib/query-keys';
import { queryClient } from 'lib/react-query';

export const createCmsBanner = (data) =>
  apiClient.post(`/cms/banner`, data, {
    baseURL: API_ONE_LIFE_ENDPOINT_URL,
  });

export const useCreateCmsBanner = ({ onSuccess }) => {
  const { mutate, isPending } = useMutation({
    mutationFn: createCmsBanner,
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
