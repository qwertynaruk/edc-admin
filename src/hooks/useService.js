import _ from 'lodash';
import useSWR from 'swr';
import { isSWRLoading } from 'utils/swrHelper';

export const getOptions = (service) => {
  if (_.isFunction(service)) {
    return service();
  }
  const f = () => {};
  return service || f;
};

export function getSWRKey(options, serviceOptions) {
  if (!options && !serviceOptions) {
    return null;
  }
  if (typeof options === 'string' || typeof options === 'number') {
    options = options.toString();
  }
  if (typeof serviceOptions === 'string' || typeof serviceOptions === 'number') {
    serviceOptions = serviceOptions.toString();
  }
  if (_.isFunction(options)) {
    options = options();
  }
  if (_.isFunction(serviceOptions)) {
    serviceOptions = serviceOptions();
  }
  if (typeof options === 'string' && typeof serviceOptions === 'string') {
    return options + serviceOptions;
  }
  if (options && serviceOptions) {
    if (typeof options === 'string' && typeof serviceOptions === 'object') {
      return options + JSON.stringify(serviceOptions);
    }
    if (typeof serviceOptions === 'string' && typeof options === 'object') {
      return JSON.stringify(options) + serviceOptions;
    }
    return { ...options, ...serviceOptions };
  }
  return options || serviceOptions;
}

export default function useService(service = {}, serviceOptions) {
  const { options, caller } = getOptions(service);
  const key = getSWRKey(options, serviceOptions);
  const { data, error, ...rest } = useSWR(key, caller);
  return {
    data: data && data.data,
    raw: data,
    error,
    loading: key ? isSWRLoading(error, data) : false,
    ...rest,
  };
}
