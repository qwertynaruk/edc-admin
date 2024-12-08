import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'lib/react-query';
import { incidentManagementQueryKeys } from 'lib/query-keys';

import { getIncidentManagement } from '../api/get-incident-management';
import { updateIncidentManagement } from '../api/update-incident-management';

export const changeIncidentManagementStatus = async (incidentId, data) => {
  const incidentData = await getIncidentManagement(incidentId);
  return updateIncidentManagement(incidentId, {
    ...incidentData,
    ...data,
  });
};

export const useChangeIncidentManagementStatus = ({ incidentId, onSuccess }) => {
  const { mutate, isPending } = useMutation({
    mutationFn: (data) => changeIncidentManagementStatus(incidentId, data),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries([incidentManagementQueryKeys.incident.all]);
      await queryClient.invalidateQueries([incidentManagementQueryKeys.incident.one(incidentId)]);
      onSuccess?.(data);
    },
  });

  return {
    submit: mutate,
    isLoading: isPending,
  };
};
