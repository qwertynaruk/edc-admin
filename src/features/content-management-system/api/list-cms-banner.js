import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { apiClient } from 'lib/api-client';
import { API_ONE_LIFE_ENDPOINT_URL } from 'configs/AppConfig';
import { cmsQueryKeys } from 'lib/query-keys';

export const listCmsBanner = async (params) => {
  return await apiClient.get(`/cms/banner`, {
    baseURL: API_ONE_LIFE_ENDPOINT_URL,
    params,
  });
};

export const useListCmsBanner = ({ ...params }) => {
  const { data, isFetching, isFetched, isError } = useQuery({
    queryKey: [cmsQueryKeys.banner.all, params],
    queryFn: () => listCmsBanner({ ...params }),
    placeholderData: keepPreviousData,
  });

  return {
    data,
    isLoading: isFetching && !isFetched,
    isError,
  };
};
