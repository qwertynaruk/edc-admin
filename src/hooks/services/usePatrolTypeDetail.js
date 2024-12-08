import PatrolService from 'services/PatrolService';
import useSWR from 'swr';
import { getOptions, isSWRLoading } from 'utils/swrHelper';

const usePatrolTypeDetail = (options) => {
  const { data, error, mutate } = useSWR(getOptions({ name: 'usePatrolType' })(options), PatrolService.typeDetail);

  const loading = isSWRLoading(error, data);

  return { data: data && data.data, error, loading, mutate };
};

export default usePatrolTypeDetail;
