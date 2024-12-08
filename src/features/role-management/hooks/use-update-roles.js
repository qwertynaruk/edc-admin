import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appApiSystemAdmin } from 'constants/ApiConstant';
import { roleManagementKeys } from '../keys';
import useHttpClient from 'hooks/useHttpClient';

export function useUpdateRoles({ id, onSuccess, onError }) {
  const { put } = useHttpClient();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: roleManagementKeys.update.queryKey,
    mutationFn: async (payload) => {
      const res = await put({
        url: `${appApiSystemAdmin}/personnel-role/${id}`,
        payload,
      });
      return res;
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: roleManagementKeys.detail(id).queryKey,
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
