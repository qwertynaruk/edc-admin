import GISService from 'services/GISService';
import useSWR from 'swr';
import { getOptions, isSWRLoading } from 'utils/swrHelper';

const useGISZones = (options) => {
  const { data, error, mutate } = useSWR(getOptions({ name: 'useGISZones' })(options), GISService.zones);

  const loading = isSWRLoading(error, data);

  return { data: data && data.data, error, loading, mutate };
};

export default useGISZones;
