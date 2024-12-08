import { Table } from 'antd';
import styled from '@emotion/styled';
import { sum } from 'lodash';

const CustomTable = styled(Table)({
  maxWidth: 'unset',
  borderTop: '1px solid #000',
  table: {
    borderRadius: 0,
  },
  '.ant-table-thead': {
    backgroundColor: '#181D28',
    th: {
      background: '#181D28 !important',
      borderRightColor: '#181D28 !important',
      borderBottomColor: '#000 !important',
    },
  },
  '.ant-table-thead > tr > th:not(:last-child), .ant-table-tbody > tr > td:not(:last-child)': {
    borderRight: 'unset',
    borderRadius: '0 !important',
  },
  '.checkbox-center': {
    display: 'flex',
    justifyContent: 'center',
  },
  '.ant-table-tbody': {
    backgroundColor: '#1C2536',
  },
});

export default function TableHeros(props) {
  const columnx = props.columns.map((ss) => ss?.width || 100);

  return (
    <CustomTable
      {...props}
      rowKey={props?.rowKey || '_id'}
      scroll={{
        x: sum(columnx),
      }}
    />
  );
}
