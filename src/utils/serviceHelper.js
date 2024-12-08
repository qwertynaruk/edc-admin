export const serviceWrapper = (caller) => {
  return (options) => {
    const result = {
      options,
      caller,
      call: () => caller(options),
    };
    return result;
  };
};

/**
 * wrap axios instance to sanitize response
 *
 * @param {AxiosInstance} axiosInstance axios instance
 * @returns {function} function that return promise
 */
export const sanitizeService = (axiosInstance) => {
  return async (options) => {
    const proms = await axiosInstance(options);
    if (!proms) {
      return Promise.reject(proms);
    }
    if (proms.status && proms.status !== 200) {
      return Promise.reject(proms);
    }
    if (proms.statusCode && proms.statusCode !== 200) {
      return Promise.reject(proms);
    }
    return Promise.resolve(proms);
  };
};
