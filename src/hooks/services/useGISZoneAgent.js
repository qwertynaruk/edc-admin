import GISService from 'services/GISService';
import useSWR from 'swr';
import { getOptions, isSWRLoading } from 'utils/swrHelper';

const useGISZoneAgent = (options) => {
  const { data, error, mutate, isValidating } = useSWR(
    getOptions({ name: 'useGISZoneAgent' })(options),
    GISService.zoneAgent
  );

  const loading = isSWRLoading(error, data);

  return { data: data && data.data, error, loading, mutate, isValidating };
};

export default useGISZoneAgent;
