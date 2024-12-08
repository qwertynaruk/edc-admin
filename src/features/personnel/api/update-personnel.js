import { API_PERSONNEL_ENDPOINT_URL } from 'configs/AppConfig';
import { apiClient } from 'lib/api-client';
import { personnelQueryKeys } from 'lib/query-keys';
import { profilesKeys } from 'features/profiles/keys';
import { queryClient } from 'lib/react-query';
import { useMutation } from '@tanstack/react-query';

export const updatePersonnel = ({ personnelId, data }) =>
  apiClient.put(`/personnel`, data, {
    baseURL: API_PERSONNEL_ENDPOINT_URL,
    params: {
      _id: personnelId,
    },
  });

export const useUpdatePersonnel = ({ personnelId, onSuccess, onError }) => {
  const {
    mutate,
    isPending,
    data: dataMut,
    error,
  } = useMutation({
    mutationFn: (data) => updatePersonnel({ personnelId, data }),
    onSuccess: async () => {
      await queryClient.invalidateQueries([personnelQueryKeys.personnel.all]);
      await queryClient.invalidateQueries([personnelQueryKeys.personnel.one(personnelId)]);
      await queryClient.invalidateQueries(profilesKeys.users.queryKey);
      onSuccess?.();
    },
    onError: async () => {
      onError?.();
    },
  });

  return {
    submit: mutate,
    isLoading: isPending,
    dataMut,
    error,
  };
};
