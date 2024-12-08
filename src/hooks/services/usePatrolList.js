import PatrolService from 'services/PatrolService';
import useSWR from 'swr';
import { getOptions, isSWRLoading } from 'utils/swrHelper';

const usePatrolList = (options) => {
  const { data, error, mutate } = useSWR(getOptions({ name: 'usePatrolList' })(options), PatrolService.list);

  const loading = isSWRLoading(error, data);

  return { data: data && data.data, error, loading, mutate };
};

export default usePatrolList;
