import { Button, Card, Dropdown, Menu, notification } from 'antd';
import { useDeleteRoles, useGetRoles } from '../hooks';
import { useEffect, useMemo, useState } from 'react';

import DialogPopup from 'components/shared-components/DialogPopup';
import { GuardHandlesV2 } from 'components/shared-components/Guarded';
import SearchMultiverse from 'components/shared-components/SearchMultiverse';
import TableHeros from 'components/shared-components/TableHeros';
import { useNavigate } from 'react-router-dom';
import useUser from 'hooks/services/useUser';

export function RolesList() {
  const { canCreate, canDelete, canUpdate } = GuardHandlesV2({
    group: 'System Administration',
    type: 'สิทธิ์การใช้งาน',
  });
  const navigate = useNavigate();
  const [keywords, setKeywords] = useState('');
  const [pages, setPages] = useState(1);

  const { organizations } = useUser();

  const { data, isLoading } = useGetRoles({
    params: {
      limit: 10,
      page: pages,
      organization_id: organizations?._id,
    },
  });
  const { mutate } = useDeleteRoles({
    onSuccess: () => {
      notification.success({
        message: 'สำเร็จ',
        description: 'ลบรายการสำเร็จ',
      });
    },
    onError: () => {
      notification.error({
        message: 'เกิดข้อผิดพลาด',
        description: 'ข้อมูลกำลังพลถูกบันทึกเรียบร้อยแล้ว',
      });
    },
  });

  const onDeleteItems = (items) => {
    return DialogPopup.delete({
      title: 'บทบาท',
      name: items.name_th,
      confirmAction: () => {
        mutate(items?._id);
      },
    });
  };

  useEffect(() => {
    console.warn('node env:', process.env.NODE_ENV);
  }, []);

  const columns = [
    {
      title: 'Role',
      key: 'role',
      width: 250,
      fixed: 'left',
      render: (items) => {
        const nameTh = items?.name_th ? `(${items.name_th})` : '';
        return [items?.name_en, nameTh].filter((ss) => ss).join(' ');
      },
    },
    {
      title: 'Description',
      dataIndex: 'description_th',
      key: 'description',
      width: 300,
      render: (items) => items || '-',
    },
    {
      title: 'จำนวนผู้ใช้งาน',
      key: 'count',
      width: 150,
      dataIndex: 'count',
      render: (items) => items || '0',
    },
    {
      title: '',
      key: 'action',
      width: 50,
      fixed: 'right',
      render: (items) => {
        const menuItems = [
          { key: 'edit', label: canUpdate ? 'แก้ไข' : 'ดูรายละเอียด' },
          { key: 'delete', label: 'ลบ' },
        ];

        return (
          <Dropdown
            overlay={
              <Menu
                items={!canDelete ? menuItems.filter((ss) => ss.key !== 'delete') : menuItems}
                onClick={(value) => {
                  if (value.key === 'delete') {
                    onDeleteItems(items);
                  }

                  if (value.key === 'edit') {
                    navigate(items?._id);
                  }
                }}
              />
            }
            placement="bottomRight"
            trigger={['click']}
          >
            <i className="gx-icon-btn icon icon-ellipse-v" />
          </Dropdown>
        );
      },
    },
  ];

  const dataSource = useMemo(() => {
    try {
      const filters = data?.data?.filter(
        (ss) =>
          ss?.name_th?.includes(keywords) || ss?.name_en?.includes(keywords) || ss?.description?.includes(keywords)
      );

      return filters;
    } catch (error) {
      return [];
    }
  }, [keywords, data]);

  return (
    <>
      <Card>
        <SearchMultiverse mode="auto" nodeData={[]} onSetNodeData={(_, searchs) => setKeywords(searchs)} />
      </Card>
      <Card
        title={
          canCreate ? (
            <Button type="primary" onClick={() => navigate('create')}>
              เพิ่มสิทธิ์การเข้าถึง
            </Button>
          ) : (
            <></>
          )
        }
      >
        <TableHeros
          loading={isLoading}
          dataSource={dataSource}
          columns={columns}
          pagination={{
            pageSize: 10,
            total: keywords ? dataSource?.length : data?.count,
            onChange: (ss) => setPages(ss),
          }}
        />
      </Card>
    </>
  );
}
