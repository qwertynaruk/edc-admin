import UserStore from 'mobx/UserStore';
import { appApiSystemAdmin } from 'constants/ApiConstant';
import { permissionManagementKeys } from '../keys';
import useHttpClient from 'hooks/useHttpClient';
import { useQuery } from '@tanstack/react-query';

export function useGetPermission(props) {
  const { user } = UserStore;
  const { get } = useHttpClient();

  const queryRequest = useQuery({
    queryKey: permissionManagementKeys.all(props?.params).queryKey,
    enabled: !!user,
    refetchInterval: 10000,
    queryFn: async () =>
      await get({
        url: `${appApiSystemAdmin}/permissions-new`,
        params: props?.params,
      }),
    select: (res) => {
      return res?.data || [];
    },
    throwOnError: (err) => {
      if (props?.onError) {
        props?.onError?.(err);
      }
    },
  });

  return queryRequest;
}
