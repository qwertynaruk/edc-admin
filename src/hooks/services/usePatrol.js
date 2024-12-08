import PatrolService from 'services/PatrolService';
import useSWR from 'swr';
import { getOptions, isSWRLoading } from 'utils/swrHelper';

const usePatrol = (options) => {
  const { data, error, mutate } = useSWR(getOptions({ name: 'usePatrol' })(options), PatrolService.readPatrol);

  const loading = isSWRLoading(error, data);

  return { data: data && data.data, error, loading, mutate };
};

export default usePatrol;
