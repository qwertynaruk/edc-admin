import _ from 'lodash';

export const isSWRLoading = (error, data) => {
  return !error && !data;
};

export const getOptions = (f) => {
  return (options) => {
    if (_.isFunction(options)) {
      return options();
    }
    return options && { name: f?.name || f, ...options };
  };
};
