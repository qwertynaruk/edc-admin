import { appApiPersonnel } from 'constants/ApiConstant';

import { profilesKeys } from '../keys';
import useHttpClient from 'hooks/useHttpClient';
import { useQuery } from '@tanstack/react-query';

export function useGetUsers(props) {
  const { token, userId, get } = useHttpClient();

  const queryRequest = useQuery({
    queryKey: profilesKeys.users.queryKey,
    enabled: !!token,
    queryFn: async () =>
      await get({
        url: `${appApiPersonnel}/personnel/${userId}`,
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
