import UserStore from 'mobx/UserStore';
import { appApiSystemAdmin } from 'constants/ApiConstant';
import { roleManagementKeys } from '../keys';
import useHttpClient from 'hooks/useHttpClient';
import { useQuery } from '@tanstack/react-query';

export function useGetDetailRoles(props) {
  const { user } = UserStore;
  const { get } = useHttpClient();

  const queryRequest = useQuery({
    queryKey: roleManagementKeys.detail(props.id).queryKey,
    enabled: !!user && !!props.id,
    queryFn: async () =>
      await get({
        url: `${appApiSystemAdmin}/personnel-role/${props.id}`,
      }),
    select: (res) => {
      return res?.data || undefined;
    },
    throwOnError: (err) => {
      if (props?.onError) {
        props?.onError?.(err);
      }
    },
  });

  return queryRequest;
}
