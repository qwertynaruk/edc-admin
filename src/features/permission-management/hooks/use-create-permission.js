import { permissionManagementKeys } from '../keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appApiSystemAdmin } from 'constants/ApiConstant';
import useHttpClient from 'hooks/useHttpClient';

export function useCreatePermission({ onSuccess, onError }) {
  const { post } = useHttpClient();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: permissionManagementKeys.create.queryKey,
    mutationFn: async (payload) => {
      const res = await post({
        url: `${appApiSystemAdmin}/permissions-new`,
        payload,
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
