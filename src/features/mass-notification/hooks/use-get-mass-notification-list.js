import UserStore from 'mobx/UserStore';
import { appApiNotification } from 'constants/ApiConstant';
import { massNotiKeys } from '../keys';
import useHttpClient from 'hooks/useHttpClient';
import { useQuery } from '@tanstack/react-query';

export function useGetMassNotificationLists(props) {
  const { user } = UserStore;
  const { get } = useHttpClient();

  const queryRequest = useQuery({
    queryKey: massNotiKeys.all(props?.params).queryKey,
    enabled: !!user,
    refetchInterval: 10000,
    queryFn: async () =>
      await get({
        url: `${appApiNotification}/notification/mass_notification/list`,
        params: props?.params,
      }),
    select: (res) => {
      const { response } = res;
      return response?.data || [];
    },
    throwOnError: (err) => {
      if (props?.onError) {
        props?.onError?.(err);
      }
    },
  });

  return queryRequest;
}
