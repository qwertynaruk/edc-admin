import { API_PERSONNEL_ENDPOINT_URL } from 'configs/AppConfig';
import { apiClient } from 'lib/api-client';
import { personnelQueryKeys } from 'lib/query-keys';
import { queryClient } from 'lib/react-query';
import { useMutation } from '@tanstack/react-query';

// export const deletePersonnel = (personnelId) => apiClient.delete(`/personnel/personnel?_id=${personnelId}`);
export const deletePersonnel = (personnelId) =>
  apiClient.delete(`/personnel?_id=${personnelId}`, {
    baseURL: API_PERSONNEL_ENDPOINT_URL,
  });

export const useDeletePersonnel = ({ onSuccess }) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (personnelId) => deletePersonnel(personnelId),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries([personnelQueryKeys.personnel.all]);
      onSuccess?.(data);
    },
    onError: (error) => {
      console.log('error', error);
      setTimeout(() => {
        console.log('error', error);
      }, 8000);
    },
    onSettled: (value) => {
      setTimeout(() => {
        console.log('value', value);
      }, 10000);
    },
  });

  return {
    submit: mutateAsync,
    isLoading: isPending,
  };
};
