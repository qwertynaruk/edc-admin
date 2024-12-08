import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { apiClient } from 'lib/api-client';
import { incidentManagementQueryKeys } from 'lib/query-keys';

export const listIncidentManagement = async ({ ...prams }) => {
  const response = await apiClient.get(`/reporting/report/list`, {
    params: prams,
  });

  return response?.response;
};

export const useListIncidentManagement = ({ ...prams }) => {
  const { data, isFetching, isFetched, isLoading, isError } = useQuery({
    queryKey: [incidentManagementQueryKeys.incident.all, { ...prams }],
    queryFn: () => listIncidentManagement({ ...prams }),
    placeholderData: keepPreviousData,
  });

  return {
    data,
    isLoading: (isFetching && !isFetched) || isLoading,
    isError,
  };
};
