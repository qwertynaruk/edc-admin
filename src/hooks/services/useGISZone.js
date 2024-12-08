import GISService from 'services/GISService';
import useSWR from 'swr';
import { getOptions, isSWRLoading } from 'utils/swrHelper';

const useGISZone = (options) => {
  const { data, error, mutate } = useSWR(getOptions({ name: 'useGISZone' })(options), GISService.zone);

  const loading = isSWRLoading(error, data);

  return { data: data && data.data, error, loading, mutate };
};

export default useGISZone;
