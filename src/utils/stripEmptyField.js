import _ from 'lodash';

export const stripEmptyField = (payload = {}, onlyNullish = false) => {
  return _.pickBy(payload, (value) => {
    if (value === null || typeof value === 'undefined') {
      return false;
    }
    if (onlyNullish) {
      return true;
    }
    if (typeof value === 'string' && value.trim() === '') {
      return false;
    }
    if (Array.isArray(value) && value.length <= 0) {
      return false;
    }
    if (typeof value === 'object' && Object.keys(value).length <= 0) {
      return false;
    }
    return true;
  });
};
export default stripEmptyField;
