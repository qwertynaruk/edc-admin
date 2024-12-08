import service from 'axios/FetchMaster';
import { MAX_API_LIMIT } from 'constants/ApiConstant';
import useSWR from 'swr';
import { sanitizeService } from 'utils/serviceHelper';
import { isSWRLoading } from 'utils/swrHelper';

const fetcher = (options) => sanitizeService(service.personnel)(options);

const useDuties = (options = {}) => {
  const {
    params = {
      limit: MAX_API_LIMIT,
    },
  } = options;
  const {
    data,
    error,
    mutate: _mutate,
  } = useSWR(
    {
      method: 'get',
      url: '/duties',
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

export default useDuties;
