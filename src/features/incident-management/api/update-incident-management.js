import { apiClient } from 'lib/api-client';
import { incidentManagementQueryKeys } from 'lib/query-keys';
import { queryClient } from 'lib/react-query';
import { useMutation } from '@tanstack/react-query';

export const updateIncidentManagement = (incidentId, data) =>
  apiClient.put(`/reporting/report`, data, {
    params: {
      report_id: incidentId,
    },
  });

export const updateCommentIncidentManagement = (incidentId, data) =>
  apiClient.put(`/reporting/report/update_comment`, data, {
    params: {
      report_id: incidentId,
    },
  });

export const useUpdateIncidentManagement = ({ incidentId, onSuccess }) => {
  const { mutate, isPending } = useMutation({
    mutationFn: (data) => updateIncidentManagement(incidentId, data),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries([incidentManagementQueryKeys.incident.one(incidentId)]);
      onSuccess?.(data);
    },
  });

  return {
    submit: mutate,
    isLoading: isPending,
  };
};
