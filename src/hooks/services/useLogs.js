import service from 'axios/FetchMaster';
import { MAX_API_LIMIT } from 'constants/ApiConstant';
import useSWR from 'swr';
import { sanitizeService } from 'utils/serviceHelper';
import { isSWRLoading } from 'utils/swrHelper';

// 'https://bqnsjsf7ue.execute-api.ap-southeast-1.amazonaws.com/v1/log?id=6333fe754ee40c971fdedfd8&type=duty'
const fetcher = (options) => sanitizeService(service.log)(options);

const useLog = (options = {}) => {
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
      url: '/log',
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

export default useLog;
