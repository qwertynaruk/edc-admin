import PatrolService from 'services/PatrolService';
import useSWR from 'swr';
import { getOptions, isSWRLoading } from 'utils/swrHelper';

const usePatrolTransactionList = (options) => {
  const { data, error, mutate } = useSWR(
    getOptions({ name: 'usePatrolTransactionList' })(options),
    PatrolService.patrolTransactionList
  );

  const loading = isSWRLoading(error, data);

  return { data: data && data.data, error, loading, mutate };
};

export default usePatrolTransactionList;
