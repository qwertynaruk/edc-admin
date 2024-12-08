import PatrolService from 'services/PatrolService';
import useSWR from 'swr';
import { getOptions, isSWRLoading } from 'utils/swrHelper';

const usePatrolTypes = (options) => {
  const { data, error, mutate } = useSWR(getOptions({ name: 'usePatrolTypes' })(options), PatrolService.typeList);

  const loading = isSWRLoading(error, data);

  return { data: data && data.data, error, loading, mutate };
};

export default usePatrolTypes;
