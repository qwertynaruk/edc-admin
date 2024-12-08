import { Button, Dropdown, Input, Menu, Table } from 'antd';
import { useMemo, useState } from 'react';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';

export default function TableUserOrganization() {
  const [searchUserList, setSearchUserList] = useState([]);
  const [keySearch, setKeySearch] = useState('');
  const token = 11111;
  const { data: dataSourceUserListApi, isLoading } = useQuery({
    queryKey: ['record-sos-data-detail'],
    enabled: !!token,
    queryFn: async () => {
      const response = await axios.get(`https://dummyjson.com/users`);
      return response?.data?.users || null;
    },
  });

  const dataUserList = useMemo(() => {
    if (keySearch) {
      return searchUserList;
    }
    return dataSourceUserListApi?.map((item) => {
      return {
        ...item,
        key: item.id,
      };
    });
  }, [dataSourceUserListApi, searchUserList, keySearch]);

  const menuActionItemList = (record) => {
    return [
      { key: 'view', label: 'ดูข้อมูล', uq: uuidv4() },
      { key: 'update', label: 'อัพเดทสถานะ', uq: uuidv4() },
    ];
  };
  const columnsUserList = [
    {
      title: 'รูปภาพ',
      dataIndex: 'image',
      key: 'image',
      render: (text, record) => {
        return <img src={record?.image} alt="avatar" style={{ width: 50, height: 50 }} />;
      },
    },
    {
      title: 'คำนำหน้า',
      dataIndex: 'eyeColor',
      key: 'eyeColor',
    },
    {
      title: 'ชื่อ - นามสกุล',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        return `${record?.firstName} ${record?.lastName}`;
      },
    },
    {
      title: 'อีเมล',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'เบอร์โทรศัพท์',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'ระดับผู้ใช้งาน',
      dataIndex: 'bloodGroup',
      key: 'bloodGroup',
    },
    {
      title: 'สถานะ',
      dataIndex: 'age',
      key: 'age',
      render: (text, record) => {
        return record?.age > 40 ? (
          <Button style={{ borderColor: 'green', backgroundColor: 'unset' }} block>
            ใช้งาน
          </Button>
        ) : (
          <Button style={{ borderColor: 'red', backgroundColor: 'unset' }} block>
            ไม่ใช้งาน
          </Button>
        );
      },
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => {
        return (
          <>
            {(menuActionItemList || []).length > 0 && (
              <Dropdown
                overlay={
                  <Menu
                    items={menuActionItemList(record)}
                    onClick={({ key }) => console.log('key, record', key, record)}
                  />
                }
                placement="bottomRight"
                trigger={['click']}
              >
                <i className="gx-icon-btn icon icon-ellipse-v" />
              </Dropdown>
            )}
          </>
        );
      },
    },
  ];

  const onSearch = (value) => {
    setKeySearch(value);
    const findData = dataSourceUserListApi.filter((item) => {
      return JSON.stringify(Object.values(item)).toLowerCase().indexOf(value.toLowerCase()) > -1;
    });
    setSearchUserList(findData);
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button type="primary" className="gx-px-5">
          เพิ่ม
        </Button>
        <span>
          <Input.Search placeholder="input search text" onSearch={onSearch} allowClear style={{ width: 250 }} />
        </span>
      </div>
      <Table loading={isLoading} rowKey={(record) => record.id} dataSource={dataUserList} columns={columnsUserList} />
    </>
  );
}
