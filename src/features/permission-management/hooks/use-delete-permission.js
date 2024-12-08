import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appApiSystemAdmin } from 'constants/ApiConstant';
import { permissionManagementKeys } from '../keys';
import useHttpClient from 'hooks/useHttpClient';

export function useDeletePermission({ id, onSuccess, onError }) {
  const { deletes } = useHttpClient();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: permissionManagementKeys.delete.queryKey,
    mutationFn: async () => {
      const res = await deletes({
        url: `${appApiSystemAdmin}/permissions-new/${id}`,
      });
      return res;
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: permissionManagementKeys.all._def,
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
