import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appApiSystemAdmin } from 'constants/ApiConstant';
import { roleManagementKeys } from '../keys';
import useHttpClient from 'hooks/useHttpClient';

export function useCreateRoles({ onSuccess, onError }) {
  const { post } = useHttpClient();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: roleManagementKeys.create.queryKey,
    mutationFn: async (payload) => {
      const res = await post({
        url: `${appApiSystemAdmin}/personnel-role`,
        payload,
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
