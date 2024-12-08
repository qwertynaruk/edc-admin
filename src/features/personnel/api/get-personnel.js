import { useQuery } from '@tanstack/react-query';

import { apiClient } from 'lib/api-client';
import { API_PERSONNEL_ENDPOINT_URL } from 'configs/AppConfig';
import { personnelQueryKeys } from 'lib/query-keys';

export const getPersonnel = async (personnelId) => {
  const response = await apiClient.get(`/personnel/detail`, {
    baseURL: API_PERSONNEL_ENDPOINT_URL,
    params: {
      _id: personnelId,
    },
  });

  return response?.response;
};

export const useGetPersonnel = (personnelId) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: personnelQueryKeys.personnel.one(personnelId),
    queryFn: () => getPersonnel(personnelId),
  });

  return {
    data,
    isLoading,
    isError,
  };
};
