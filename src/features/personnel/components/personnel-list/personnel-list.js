/* eslint-disable prettier/prettier */
import { Avatar, Button, Dropdown, Menu, Typography } from 'antd';
import { MoreOutlined, UserOutlined } from '@ant-design/icons';

import { Badges } from 'components/shared-components/badges';
import { FallbackError } from 'components/util-components/fallback-error';
import Flex from 'components/shared-components/Flex';
import { GuardHandlesV2 } from 'components/shared-components/Guarded';
import TableHeros from 'components/shared-components/TableHeros';
import { useListPersonnel } from '../../api/list-personnel';
import { usePagination } from '../../../shared';

const getStatusFilterParams = (status) => {
  if (status === 'กำลังพลทั้งหมด') return {};
  return {
    status: status === 'ใช้งาน',
  };
};

export const PersonnelList = ({ status, search, onEdit, onDelete, organization }) => {
  const { page, pageSize, onPaginationChange, Pagination } = usePagination({});
  const { canDelete, canUpdate } = GuardHandlesV2({ group: 'Personnel', type: 'กำลังพล' });

  const { data, isLoading, isError } = useListPersonnel({
    ...getStatusFilterParams(status),
    page,
    page_size: pageSize,
    search: search || undefined,
    organization_id: organization !== 'all' && organization ? organization : undefined,
  });

  if (isError) {
    return <FallbackError />;
  }

  const actionMenu = (personalData) => (
    <Menu
      style={{
        width: 100,
      }}
      items={[
        canUpdate
          ? {
            label: 'แก้ไข',
            key: 'edit',
            onClick: () => onEdit?.(personalData),
          }
          : undefined,
        canDelete
          ? {
            label: 'ลบ',
            key: 'delete',
            onClick: () => onDelete?.(personalData),
          }
          : undefined,
      ]}
    />
  );

  const columns = [
    {
      title: 'รูปภาพ',
      dataIndex: 'image',
      width: 100,
      align: 'center',
      render: (_, data) => {
        return (
          <Avatar
            style={{
              backgroundColor: '#1B2531',
              border: '1px solid #fff',
            }}
            icon={<UserOutlined />}
            src={data?.image_url}
          />
        );
      },
    },
    {
      title: 'คำนำหน้า',
      dataIndex: 'prefix_name',
      key: 'prefix_name',
      width: 100,
    },
    {
      title: 'ชื่อ - นามสกุล',
      key: 'name',
      width: 300,
      render: (text, record) => {
        return (
          <Typography.Text
            style={{
              cursor: 'pointer',
            }}
            className='gx-text-danger'
            onClick={() => onEdit?.(record)}
          >{`${record.first_name} ${record.last_name}`}</Typography.Text>
        );
      },
    },
    {
      title: 'อีเมล',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: 'เบอร์โทร',
      dataIndex: 'phone_number',
      key: 'phone_number',
      width: 150,
    },
    {
      title: 'ระดับผู้ใช้งาน',
      dataIndex: ['role_info', 'name_th'],
      width: 150,
      align: 'center',
    },

    {
      title: 'สถานะ',
      dataIndex: 'is_active',
      width: 125,
      align: 'center',
      render: (records) => {
        const style = records
          ? { borderColor: 'green', backgroundColor: 'unset', color: 'green' }
          : {
            borderColor: 'red',
            backgroundColor: 'unset',
            color: 'red',
          };

        return (
          <Button
            style={{
              ...style,
              width: 100,
            }}
          >
            {records ? 'ใช้งาน' : 'ไม่ใช้งาน'}
          </Button>
        );
      },
    },
    {
      title: 'สิทธิ์การเข้าถึง',
      dataIndex: 'organizations',
      key: 'organizations',
      width: 250,
      render: (organizations) => {
        const badgeItems = organizations.map((org) => ({
          key: org.id,
          label: org.full_name_th,
        }));
        return <Badges maxWidth={230} items={badgeItems} />;
      },
    },
    {
      key: 'action',
      width: 50,
      align: 'center',
      fixed: 'right',
      render: (personalData) => canUpdate || canDelete ? (
        <Dropdown overlay={actionMenu(personalData)}>
          <MoreOutlined
            style={{
              cursor: 'pointer',
            }}
          />
        </Dropdown>
      ) : null,
    },
  ];

  return (
    <>
      <TableHeros
        dataSource={data?.data}
        loading={isLoading}
        pagination={false}
        columns={columns}
        tableLayout="fixed"
        rowKey="id"
      />
      <Flex justifyContent="end" className="gx-mt-4">
        <Pagination current={page} pageSize={pageSize} total={data?.total_record} onChange={onPaginationChange} />
      </Flex>
    </>
  );
};
