import service from 'axios/FetchMaster';
import produce from 'immer';
import _ from 'lodash';
import useSWR from 'swr';
import { sanitizeService } from 'utils/serviceHelper';
import { isSWRLoading } from 'utils/swrHelper';

const fetcher = (options) => sanitizeService(service.personnel)(options);

const conditionalFetching = (params) => {
  if (!params._id) {
    return { method: 'get', url: '/personnel', params: _.omit(params, '_id') };
  }
  if (_.isEmpty(params._id)) return null;
  return {
    method: 'get',
    url: '/personnel',
    params: produce(params, (draft) => {
      if (Array.isArray(params._id)) {
        const idSet = new Set(params._id);
        draft._id = Array.from(idSet).join(',');
      }
      if (typeof params._id === 'string') {
        draft._id = params._id;
      }
    }),
  };
};

const usePersonnel = (options = {}) => {
  const { params = {} } = options;
  const { data, error, mutate: _mutate } = useSWR(conditionalFetching(params), fetcher);

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

export default usePersonnel;
