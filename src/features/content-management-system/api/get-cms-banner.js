import { useQuery } from '@tanstack/react-query';

import { apiClient } from 'lib/api-client';
import { API_ONE_LIFE_ENDPOINT_URL } from 'configs/AppConfig';
import { cmsQueryKeys } from 'lib/query-keys';

export const getCmsBanner = async (params) => {
  return await apiClient.get(`/cms/banner`, {
    baseURL: API_ONE_LIFE_ENDPOINT_URL,
    params,
  });
};

export const useGetCmsBanner = (banner_id) => {
  const { data, isFetching, isFetched, isError } = useQuery({
    queryKey: [cmsQueryKeys.banner.one(banner_id)],
    queryFn: () => getCmsBanner({ banner_id }),
  });

  return {
    data,
    isLoading: isFetching && !isFetched,
    isError,
  };
};
