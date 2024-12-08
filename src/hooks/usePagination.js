import { useState } from 'react';

const usePagination = (options = {}) => {
  const { pageSize = 10, total = 0, current = 1 } = options;
  const [pagination, setPagination] = useState({
    current,
    pageSize,
    total,
  });
  return [pagination, setPagination];
};

export default usePagination;
