import { Pagination as AntdPagination } from 'antd';
import { useEffect, useState } from 'react';

const Pagination = ({ total, current = 0, pageSize = 10, showSizeChanger = true, onChange, ...props }) => {
  useEffect(() => {
    const minSize = current * pageSize - pageSize;
    if (total && minSize > total) {
      onChange?.(1, pageSize);
    }
  }, [current, onChange, pageSize, total]);

  if (!total) return null;
  if (total < 1) return null;
  return (
    <AntdPagination
      className="mt-4 text-right"
      total={total ?? 1}
      current={current ?? 1}
      pageSizeOptions={[10, 20, 30]}
      showSizeChanger={showSizeChanger}
      pageSize={pageSize}
      onChange={onChange}
      {...props}
    />
  );
};

export const usePagination = ({ id, ...props }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(props?.pageSize ?? 10);

  const onPaginationChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize ?? 10);
  };

  return {
    page,
    pageSize,
    onPaginationChange,
    Pagination,
  };
};
