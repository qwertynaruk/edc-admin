import { apiClient } from 'lib/api-client';
import { incidentManagementQueryKeys } from 'lib/query-keys';
import { useQuery } from '@tanstack/react-query';

export const getIncidentManagement = async (incidentId) => {
  const response = await apiClient.get(`/reporting/report`, {
    params: {
      report_id: incidentId,
    },
  });

  return response?.response?.data;
};

export const getIncidentManagementLog = async (incidentId) => {
  const response = await apiClient.get(`/log/audit_log/list`, {
    params: {
      ref_id: incidentId,
    },
  });

  return response?.response?.data;
};

export const getForwardIncidentManagement = async (logId) => {
  const response = await apiClient.get(`/log/audit_log/report_transfer/detail`, {
    params: {
      audit_log_id: logId,
    },
  });

  return response?.response?.data;
};

export const useGetIncidentManagement = (incidentId) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [incidentManagementQueryKeys.incident.one(incidentId)],
    queryFn: () => getIncidentManagement(incidentId),
  });

  return {
    data,
    isLoading,
    isError,
  };
};

export const useGetIncidentForwardManagement = (logId) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [incidentManagementQueryKeys.incident.one(logId)],
    queryFn: () => getForwardIncidentManagement(logId),
  });

  return {
    data,
    isLoading,
    isError,
  };
};

export const useGetIncidentManagementLog = (incidentId) => {
  console.log('incidentId incidentId', incidentId);

  const { data, isLoading, isError } = useQuery({
    // queryKey: [incidentManagementQueryKeys.incident.one(incidentId)],
    queryKey: ['aaaaaaaa'],
    queryFn: () => getIncidentManagementLog(incidentId),
  });

  return {
    data,
    isLoading,
    isError,
  };
};
