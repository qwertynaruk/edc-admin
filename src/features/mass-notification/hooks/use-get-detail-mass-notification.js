import UserStore from 'mobx/UserStore';
import { appApiNotification } from 'constants/ApiConstant';
import { massNotiKeys } from '../keys';
import useHttpClient from 'hooks/useHttpClient';
import { useQuery } from '@tanstack/react-query';

export function useGetDetailMassNotification(props) {
  const { user } = UserStore;
  const { get } = useHttpClient();

  const queryRequest = useQuery({
    queryKey: massNotiKeys.detail(props.id).queryKey,
    enabled: !!user && !!props.id,
    queryFn: async () =>
      await get({
        url: `${appApiNotification}/notification/mass_notification`,
        params: {
          id: props.id,
        },
      }),
    select: (res) => {
      const { response } = res;
      return response || undefined;
    },
    throwOnError: (err) => {
      if (props?.onError) {
        props?.onError?.(err);
      }
    },
  });

  return queryRequest;
}
