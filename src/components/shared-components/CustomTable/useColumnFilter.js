import { SearchOutlined } from '@ant-design/icons';
import { Button, Checkbox, Divider, Input, Space, Typography } from 'antd';
import { useRef, useState } from 'react';
import styled from '@emotion/styled';

const { Text } = Typography;
const CheckboxGroup = styled(Checkbox.Group)`
  display: flex !important;
  flex-direction: column;
  .ant-checkbox-group-item {
    margin: 8px 0;
  }
`;

const DropdownFooter = (props) => {
  const { onCancel, onSearch } = props;
  return (
    <>
      <Divider />
      <Space>
        <Button
          ghost
          onClick={onCancel}
          style={{
            width: 90,
          }}
        >
          <Text style={{ color: 'rgba(255,255,255,0.4)' }}>รีเซ็ต</Text>
        </Button>
        <Button
          type="primary"
          onClick={onSearch}
          icon={<SearchOutlined />}
          style={{
            width: 90,
          }}
        >
          ค้นหา
        </Button>
      </Space>
    </>
  );
};

const DropdownContainer = (props) => {
  return (
    <div
      style={{
        padding: 8,
        backgroundColor: 'rgba(40, 49, 66, 1)',
      }}
    >
      {props.children}
    </div>
  );
};

export const getColumnFilterProps = (props = {}) => {
  const { handleSearch, handleReset } = props;

  return (dataIndex, options) => {
    const { filters } = options;
    const onFilter = (value, record) => {
      if (props.onFilter) return props.onFilter(value, record);
      if (!record[dataIndex]) return false;
      return record[dataIndex].toString().toLowerCase() === value.toString().toLowerCase();
      // return record[dataIndex]
      //   .toString()
      //   .toLowerCase()
      //   .includes(value.toString().toLowerCase());
    };
    return {
      onFilter,
      filterDropdown: (filterProps) => {
        const { setSelectedKeys, selectedKeys, confirm, clearFilters } = filterProps;
        return (
          <DropdownContainer>
            <CheckboxGroup
              options={filters}
              value={selectedKeys}
              onChange={(values) => {
                setSelectedKeys(values);
              }}
            />
            <DropdownFooter
              onCancel={handleReset && (() => clearFilters && handleReset(clearFilters, confirm, setSelectedKeys))}
              onSearch={handleSearch && (() => handleSearch(selectedKeys, confirm, dataIndex))}
            />
          </DropdownContainer>
        );
      },
    };
  };
};

export const getColumnSearchProps = (props = {}) => {
  const { searchInput, handleSearch, handleReset } = props;

  return (dataIndex, options) => {
    const { placeholder = 'ค้นหา' } = options;

    const onFilter = (value, record) => {
      if (props.onFilter) return props.onFilter(value, record);
      if (!record[dataIndex]) return false;
      return record[dataIndex].toString().toLowerCase().includes(value.toString().toLowerCase());
    };
    return {
      onFilter,
      filterDropdown: (props) => {
        const { setSelectedKeys, selectedKeys, confirm, clearFilters } = props;
        return (
          <DropdownContainer>
            <Input
              ref={searchInput}
              placeholder={placeholder}
              value={selectedKeys[0]}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={handleSearch && (() => handleSearch(selectedKeys, confirm, dataIndex))}
              style={{
                marginBottom: 8,
                display: 'block',
              }}
            />
            <DropdownFooter
              onCancel={handleReset && (() => clearFilters && handleReset(clearFilters, confirm))}
              onSearch={handleSearch && (() => handleSearch(selectedKeys, confirm, dataIndex))}
            />
          </DropdownContainer>
        );
      },
      filterIcon: (filtered) => (
        <SearchOutlined
          style={{
            color: filtered ? '#1890ff' : undefined,
          }}
        />
      ),
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput?.current?.select(), 100);
        }
      },
    };
  };
};

export const useColumnFilter = (props = {}) => {
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    if (props.handleSearch) return props.handleSearch(selectedKeys, confirm, dataIndex);
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters, confirm) => {
    if (props.handleReset) return props.handleReset(clearFilters, confirm);
    clearFilters();
    setSearchText('');
    confirm();
  };

  const columnSearch = getColumnSearchProps({
    searchInput,
    handleSearch,
    handleReset,
  });

  const columnFilter = getColumnFilterProps({
    handleSearch,
    handleReset,
  });

  return {
    searchInput,
    searchText,
    setSearchText,
    searchedColumn,
    setSearchedColumn,
    handleSearch,
    handleReset,
    columnSearch,
    columnFilter,
  };
};

export default useColumnFilter;
