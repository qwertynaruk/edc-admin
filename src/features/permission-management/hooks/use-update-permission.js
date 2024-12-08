import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appApiSystemAdmin } from 'constants/ApiConstant';
import { permissionManagementKeys } from '../keys';
import useHttpClient from 'hooks/useHttpClient';

export function useUpdatePermission({ id, onSuccess, onError }) {
  const { put } = useHttpClient();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: permissionManagementKeys.update.queryKey,
    mutationFn: async (payload) => {
      const res = await put({
        url: `${appApiSystemAdmin}/permissions-new/${id}`,
        payload,
      });
      return res;
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: permissionManagementKeys.detail(id).queryKey,
      });

      if (onSuccess) {
        onSuccess(...args);
      }
    },
    onError: (error, ...args) => {
      if (onError) {
        if (!error) return;
        onError(error, ...args);
      }
    },
  });

  return mutation;
}
