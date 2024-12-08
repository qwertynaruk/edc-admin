import service from 'axios/FetchMaster';
import produce from 'immer';
import _ from 'lodash';
import useSWR from 'swr';
import { sanitizeService } from 'utils/serviceHelper';
import { isSWRLoading } from 'utils/swrHelper';

const fetcher = (options) => sanitizeService(service.system_admin)(options);

const getKey = (params) => {
  if (_.isEmpty(params)) return;
  if (typeof params._id !== 'undefined' && _.isEmpty(params._id)) return;
  return {
    method: 'get',
    url: '/users',
    params: produce(params, (draft) => {
      if (params._id && Array.isArray(params._id)) {
        draft._id = params._id.join(',');
      }
      if (params._id && typeof params._id === 'string') {
        draft._id = params._id;
      }
    }),
  };
};

const useUsers = (options = {}) => {
  const { params = {} } = options;
  const { data, error, mutate: _mutate } = useSWR(getKey(params), fetcher);

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

export default useUsers;
