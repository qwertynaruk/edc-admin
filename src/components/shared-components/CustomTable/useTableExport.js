import produce from 'immer';

export const exportColumns = (columns) => {
  return [{ title: 'ลำดับ', dataIndex: 'index' }, ...columns]
    .filter((column) => {
      if (!column.dataIndex) {
        return false;
      }
      if (column.dataIndex === 'cover_image_file') {
        return false;
      }
      if (column.dataIndex === 'action') {
        return false;
      }
      return true;
    })
    .map((column) => ({
      label: column.title,
      key: column.dataIndex,
    }));
};
export const exportDataSource = (dataSource, columns) => {
  return dataSource.map((item, index) => {
    return produce(item, (draft) => {
      draft.index = index + 1;
      columns.forEach((column, index) => {
        if (!column.render) return draft[column.dataIndex];
        const directDatas = column.render(item[column.dataIndex], item, index);
        draft[column.dataIndex] = directDatas?.props?.text || directDatas;
      });
    });
  });
};

export const useTableExport = (columns, dataSource) => {
  if (columns || dataSource) {
    return {
      exportColumns: (x) => exportColumns(x || columns),
      exportDataSource: (y, x) => exportDataSource(y || dataSource, x || columns),
    };
  }
  return {
    exportColumns,
    exportDataSource,
  };
};

export default useTableExport;
