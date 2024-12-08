import { useMutation, useQueryClient } from '@tanstack/react-query';

import { lostFoundKeys } from '../keys';
import useHttpClient from 'hooks/useHttpClient';

export function useUpdateLostFound({ itemId, onSuccess, onError }) {
  const { put } = useHttpClient();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const res = await put({
        url: `/lost-and-found/item-management/${itemId}`,
        payload,
      });
      return res;
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: lostFoundKeys.update.queryKey,
      });

      queryClient.invalidateQueries({
        queryKey: lostFoundKeys.all._def,
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
