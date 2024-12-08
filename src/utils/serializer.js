import _ from 'lodash';

// https://dev.to/jordanholtdev/get-the-extension-of-a-filename-using-javascript-3449
export const fileNameAndExtensionSerializer = (str) => [
  str.slice(0, str.lastIndexOf('.')),
  str.slice(str.lastIndexOf('.')),
];

export const getWithQuery = (object, query, defaultValue = '-', seperator = ', ') => {
  if (!object || !query) return defaultValue;
  const keys = query.split(',').map((key) => key.trim());
  if (keys.length < 2) return _.get(object, query, defaultValue);
  const founds = keys.map((key) => _.get(object, key, defaultValue)).filter((x) => x !== defaultValue);
  if (founds.length === 0) return defaultValue;
  return founds
    .map((found) => {
      if (Array.isArray(found)) {
        return found.join(seperator);
      }
      if (_.isPlainObject(found)) {
        return JSON.stringify(found);
      }
      if (_.isFunction(found)) {
        return found();
      }
      return found;
    })
    .join(seperator);
};
