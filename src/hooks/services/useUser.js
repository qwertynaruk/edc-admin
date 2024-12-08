import UserService from 'services/UserService';
import UserStore from 'mobx/UserStore';
import _ from 'lodash';
import { isSWRLoading } from 'utils/swrHelper';
import useSWR from 'swr';

const fetcher = (id) => UserService.get_user(id);

const getName = (user) => {
  return () => [_.get(user, 'prefix_name', ''), _.get(user, 'first_name', ''), _.get(user, 'last_name', '')].join(' ');
};

const useUser = (options) => {
  const { auth_id: authId } = UserStore.accessAuthen;

  const { data, error, mutate } = useSWR(authId, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const loading = isSWRLoading(error, data);

  const user = data?.response;
  const roles = data?.data?.role;
  const organizations = data?.data?.organization;

  return { user, roles, organizations, error, loading, mutate, getName: getName(user), fetcher };
};

export default useUser;
