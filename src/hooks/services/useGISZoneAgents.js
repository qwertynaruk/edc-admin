import GISService from 'services/GISService';
import useSWR from 'swr';
import { getOptions, isSWRLoading } from 'utils/swrHelper';

const useGISZoneAgents = (options) => {
  const { data, error, mutate } = useSWR(getOptions({ name: 'useGISZoneAgents' })(options), GISService.zoneAgents);

  const loading = isSWRLoading(error, data);

  return { data: data && data.data, error, loading, mutate };
};

export default useGISZoneAgents;
