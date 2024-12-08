import UserStore from 'mobx/UserStore';
import { appApiNotification } from 'constants/ApiConstant';
import { massNotiKeys } from '../keys';
import useHttpClient from 'hooks/useHttpClient';
import { useQuery } from '@tanstack/react-query';

export function useGetWarningLists(props) {
  const { user } = UserStore;
  const { get } = useHttpClient();

  const queryRequest = useQuery({
    queryKey: massNotiKeys.warnings.queryKey,
    enabled: !!user,
    queryFn: async () =>
      await get({
        url: `${appApiNotification}/notification/category/list`,
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
