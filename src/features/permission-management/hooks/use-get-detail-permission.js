import { permissionManagementKeys } from '../keys';

import UserStore from 'mobx/UserStore';
import { appApiSystemAdmin } from 'constants/ApiConstant';
import useHttpClient from 'hooks/useHttpClient';
import { useQuery } from '@tanstack/react-query';

export function useGetDetailPermission(props) {
  const { user } = UserStore;
  const { get } = useHttpClient();

  const queryRequest = useQuery({
    queryKey: permissionManagementKeys.detail(props.id).queryKey,
    enabled: !!user && !!props.id,
    queryFn: async () =>
      await get({
        url: `${appApiSystemAdmin}/permissions-new`,
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
