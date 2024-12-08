import UserStore from 'mobx/UserStore';
import { lostFoundKeys } from '../keys';
import useHttpClient from 'hooks/useHttpClient';
import { useQuery } from '@tanstack/react-query';

export function useGetLostFoundList(props) {
  const { user } = UserStore;
  const { get } = useHttpClient();

  const queryRequest = useQuery({
    queryKey: lostFoundKeys.all(props?.params).queryKey,
    enabled: !!user,
    queryFn: async () =>
      await get({
        url: `/lost-and-found/item-management`,
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
