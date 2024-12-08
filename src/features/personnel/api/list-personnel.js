import { useQuery } from '@tanstack/react-query';

import { API_PERSONNEL_ENDPOINT_URL } from 'configs/AppConfig';
import { apiClient } from 'lib/api-client';
import { personnelQueryKeys } from 'lib/query-keys';

export const listPersonnel = async ({ ...params }) => {
  const response = await apiClient.get('/personnel', {
    baseURL: API_PERSONNEL_ENDPOINT_URL,
    params,
  });

  return response?.response;
};

export const useListPersonnel = ({ ...params }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [personnelQueryKeys.personnel.all, params],
    queryFn: () => listPersonnel({ ...params }),
  });

  return {
    data,
    isLoading,
    isError,
  };
};
