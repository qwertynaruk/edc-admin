import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appApiNotification } from 'constants/ApiConstant';
import { massNotiKeys } from '../keys';
import useHttpClient from 'hooks/useHttpClient';

export function useCreateMassNotification({ onSuccess, onError }) {
  const { post } = useHttpClient();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const res = await post({
        url: `${appApiNotification}/notification/mass_notification`,
        payload,
      });
      return res;
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: massNotiKeys.create.queryKey,
      });

      queryClient.invalidateQueries({
        queryKey: massNotiKeys.all._def,
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