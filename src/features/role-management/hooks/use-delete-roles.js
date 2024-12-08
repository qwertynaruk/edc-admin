import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appApiSystemAdmin } from 'constants/ApiConstant';
import { roleManagementKeys } from '../keys';
import useHttpClient from 'hooks/useHttpClient';

export function useDeleteRoles({ onSuccess, onError }) {
  const { deletes } = useHttpClient();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: roleManagementKeys.delete.queryKey,
    mutationFn: async (id) => {
      const res = await deletes({
        url: `${appApiSystemAdmin}/personnel-role/${id}`,
      });
      return res;
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: roleManagementKeys.all._def,
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
