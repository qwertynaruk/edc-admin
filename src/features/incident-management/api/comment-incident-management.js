import { updateCommentIncidentManagement, updateIncidentManagement } from '../api/update-incident-management';

import { getIncidentManagement } from '../api/get-incident-management';
import { incidentManagementQueryKeys } from 'lib/query-keys';
import { queryClient } from 'lib/react-query';
import { useMutation } from '@tanstack/react-query';

export const commentIncidentManagement = async (incidentId, data) => {
  const incidentData = await getIncidentManagement(incidentId);
  return updateIncidentManagement(incidentId, {
    ...incidentData,
    ...data,
  });
};

export const commentIncidentManagementV2 = async (incidentId, data) => {
  // const incidentData = await getIncidentManagement(incidentId);
  return updateCommentIncidentManagement(incidentId, {
    // ...incidentData,
    ...data,
  });
};

export const useCommentIncidentManagement = ({ incidentId, onSuccess }) => {
  const { mutate, isPending } = useMutation({
    mutationFn: (data) => commentIncidentManagement(incidentId, data),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries([incidentManagementQueryKeys.incident.one(incidentId)]);
      await queryClient.invalidateQueries([incidentManagementQueryKeys.incident.all]);
      onSuccess?.(data);
    },
  });

  return {
    submit: mutate,
    isLoading: isPending,
  };
};

export const useCommentIncidentManagementV2 = ({ incidentId, onSuccess }) => {
  const { mutate, isPending } = useMutation({
    mutationFn: (data) => commentIncidentManagementV2(incidentId, data),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries([incidentManagementQueryKeys.incident.one(incidentId)]);
      await queryClient.invalidateQueries([incidentManagementQueryKeys.incident.all]);
      onSuccess?.(data);
    },
  });

  return {
    submit: mutate,
    isLoading: isPending,
  };
};
