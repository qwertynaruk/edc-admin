import UserStore from 'mobx/UserStore';
import { appApiSystemAdmin } from 'constants/ApiConstant';
import { roleManagementKeys } from '../keys';
import useHttpClient from 'hooks/useHttpClient';
import { useQuery } from '@tanstack/react-query';

export function useGetRoles(props) {
  const { user } = UserStore;
  const { get } = useHttpClient();

  const queryRequest = useQuery({
    queryKey: roleManagementKeys.all(props?.params).queryKey,
    enabled: !!user,
    refetchInterval: 10000,
    queryFn: async () =>
      await get({
        url: `${appApiSystemAdmin}/personnel-role`,
        params: props?.params,
      }),
    select: (res) => {
      return {
        data: res?.data || [],
        count: res?.count || 10,
      };
    },
    throwOnError: (err) => {
      if (props?.onError) {
        props?.onError?.(err);
      }
    },
  });

  return queryRequest;
}
