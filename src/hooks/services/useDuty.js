import service from 'axios/FetchMaster';
import useSWR from 'swr';
import { sanitizeService } from 'utils/serviceHelper';
import { isSWRLoading } from 'utils/swrHelper';

const fetcher = (options) => sanitizeService(service.personnel)(options);

const useDuty = (options = {}) => {
  const { params = {} } = options;
  const {
    data,
    error,
    mutate: _mutate,
  } = useSWR(
    {
      method: 'get',
      url: '/duty',
      params,
    },
    fetcher
  );

  const mutate = (f, data) => {
    const optimisticData = { data };
    return _mutate(f, {
      optimisticData,
      rollbackOnError: true,
      populateCache: true,
      revalidate: false,
    });
  };

  const loading = isSWRLoading(error, data);

  return { data: data && data.data, error, loading, mutate };
};

export default useDuty;
