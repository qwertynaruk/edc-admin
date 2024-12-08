import { API_PERSONNEL_ENDPOINT_URL } from 'configs/AppConfig';
import { apiClient } from 'lib/api-client';
import { personnelQueryKeys } from 'lib/query-keys';
import { queryClient } from 'lib/react-query';
import { useMutation } from '@tanstack/react-query';

export const createPersonnel = (data) =>
  apiClient.post('/personnel', data, {
    baseURL: API_PERSONNEL_ENDPOINT_URL,
  });

export const useCreatePersonnel = ({ onSuccess }) => {
  const { mutate, isPending } = useMutation({
    mutationFn: (data) => createPersonnel(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries([personnelQueryKeys.personnel.all]);
      onSuccess?.();
    },
  });

  return {
    submit: mutate,
    isLoading: isPending,
  };
};
