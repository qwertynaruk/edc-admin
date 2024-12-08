import EmptyDisplay from 'utils/EmptyDisplay';
import { Table } from 'antd';
import styled from '@emotion/styled';

const TablePointerOnRowClick = styled(Table)`
  ${(props) => {
    const onRowImplementation = props.onRow && props.onRow({});
    if (onRowImplementation?.onClick) {
      return `
        tbody tr:hover {
          cursor: pointer;
        }
        `;
    }
  }}
  .ant-table-header {
    background: #1c2536 !important;
  }
  .disabled {
    opacity: 0.4;
  }
  .ant-checkbox-disabled {
    opacity: 0.4;
  }
`;

export const ClickableCellStyled = {
  cursor: 'pointer',
  color: '#FF3744',
};

const CustomTable = (props) => {
  const { value, rowSelection, customRowKey = '_id', ...otherProps } = props;
  return (
    <TablePointerOnRowClick
      rowKey={customRowKey}
      locale={EmptyDisplay.byLocale}
      {...{
        rowSelection: rowSelection && {
          selectedRowKeys: value,
          ...rowSelection,
        },
      }}
      {...otherProps}
    />
  );
};

export default CustomTable;
