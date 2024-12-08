import { Button, Card, Checkbox, Col, Form, Input, Menu, Skeleton, Space, Typography } from 'antd';
import { first, groupBy, last } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { GuardHandlesV2 } from 'components/shared-components/Guarded';
import LabsContent from 'components/layout-components/LabsContent';
import RowFixed from 'components/shared-components/RowFixed';
import TableHeros from 'components/shared-components/TableHeros';
import { useGetPermission } from 'features/permission-management/hooks';

export default function RolesForm(props) {
  const { form, onSubmit, onCancel, formType = 'create', loading = false, items = undefined } = props;
  const { canUpdate } = GuardHandlesV2({
    group: 'System Administration',
    type: 'สิทธิ์การใช้งาน',
  });

  const [pick, setPick] = useState('');
  const [checked, setChecked] = useState([]);

  const { data, isLoading } = useGetPermission({
    params: {
      limit: 9999,
      page: 1,
    },
  });

  const onClick = (e) => {
    setPick(e?.key || '');
  };

  const permissionList = useMemo(() => {
    try {
      const groupByArrs = (arrs, keys) => {
        const gb = groupBy(arrs, (ss) => ss?.[keys]);
        const o = Object.entries(gb);
        return o;
      };

      const sources = groupByArrs(data, 'module');
      const newSources = sources.map((ss) => ({
        id: first(ss),
        items: groupByArrs(last(ss), 'name_th').map((ss) => ({
          id: first(ss),
          description: first(last(ss))?.description_th,
          items: last(ss),
        })),
      }));

      setPick(first(newSources)?.id);
      return newSources;
    } catch (error) {
      return [];
    }
  }, [data]);

  const chooseAbilities = useCallback(
    (itemId, events) => {
      if (!itemId) {
        return undefined;
      }

      const { checked } = events.target;
      const px = form.getFieldValue('permission_in_role');

      const dataSet = px && Array.isArray(px) ? px : [];
      if (checked) {
        dataSet.push(itemId);
      } else {
        dataSet.splice(
          dataSet.findIndex((ss) => ss === itemId),
          1
        );
      }

      form.setFieldValue('permission_in_role', dataSet);
    },
    [form]
  );

  const AbilitiesCheckbox = ({ record, keyName = '' }) => {
    const hasKeys = record?.items?.find((ss) => ss?.action === keyName);
    if (!hasKeys || !hasKeys?.is_active) {
      return null;
    }

    const rootItemsId = record?.items?.find((ss) => ss?.action === 'read');

    const disable = keyName !== 'read' ? !checked?.includes(rootItemsId?._id) : false;

    const onChangeCheckBox = (events) => {
      chooseAbilities(hasKeys?._id, events);

      const hasData = checked?.filter((ss) => ss === hasKeys?._id)?.length || 0;
      if (hasData > 0) {
        const x = checked?.filter((ss) => ss !== hasKeys?._id);
        setChecked(x);
      } else {
        setChecked((ss) => [...(ss || []), hasKeys?._id]);
      }
    };

    return (
      <div className="checkbox-center" style={{ opacity: disable ? 0.4 : 1 }}>
        <Checkbox
          disabled={keyName === 'read' ? false : disable}
          checked={checked?.includes(hasKeys?._id)}
          onChange={onChangeCheckBox}
        />
      </div>
    );
  };

  useEffect(() => {
    const t = items?.permission_in_role;
    setChecked(t);
  }, [items?.permission_in_role]);

  const columns = [
    {
      title: 'List Menu',
      key: 'name',
      width: 200,
      fixed: 'left',
      render: (record) => (
        <Space direction="vertical">
          <Typography.Text>{record?.id || '-'}</Typography.Text>
          <Typography.Text style={{ opacity: 0.7 }}>{record?.description}</Typography.Text>
        </Space>
      ),
    },
    {
      title: 'อ่าน/ดู',
      key: 'read',
      align: 'center',
      width: 100,
      render: (record) => <AbilitiesCheckbox record={record} keyName="read" />,
    },
    {
      title: 'สร้าง',
      key: 'create',
      align: 'center',
      width: 100,
      render: (record) => <AbilitiesCheckbox record={record} keyName="create" />,
    },
    {
      title: 'แก้ไข',
      key: 'update',
      align: 'center',
      width: 100,
      render: (record) => <AbilitiesCheckbox record={record} keyName="update" />,
    },
    {
      title: 'ลบ',
      key: 'delete',
      align: 'center',
      width: 100,
      render: (record) => <AbilitiesCheckbox record={record} keyName="delete" />,
    },
  ];

  return (
    <Form form={form} onFinish={onSubmit} layout="vertical">
      <Card loading={loading}>
        <Form.Item style={{ display: 'none' }} label="" name="permission_in_role">
          <Input type="hidden" />
        </Form.Item>
        <RowFixed>
          <Col xs={24} sm={12}>
            <Form.Item
              label="ชื่อระดับผู้ใช้งาน (TH)"
              name="name_th"
              rules={[
                {
                  required: true,
                  message: 'กรุณาระบุชื่อสิทธิ์การใช้งาน',
                },
              ]}
            >
              <Input placeholder="กรอกชื่ิอสิทธิ์การใช้งาน" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="ชื่อระดับผู้ใช้งาน (EN)"
              name="name_en"
              rules={[
                {
                  required: true,
                  message: 'กรุณาระบุชื่อสิทธิ์การใช้งาน',
                },
              ]}
            >
              <Input placeholder="กรอกชื่ิอสิทธิ์การใช้งาน" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24}>
            <Form.Item label="Description" name="description_th">
              <Input placeholder="กรอกชื่ิอสิทธิ์การใช้งาน" />
            </Form.Item>
          </Col>
        </RowFixed>
      </Card>
      <LabsContent
        titleContent={'Permission'}
        header={<></>}
        sideContent={
          isLoading ? (
            <Skeleton />
          ) : (
            <Menu
              onClick={onClick}
              selectedKeys={pick}
              mode="inline"
              items={permissionList.map((ss) => ({ label: ss.id, key: ss.id }))}
            />
          )
        }
        footer={
          canUpdate ? (
            <Space className="gx-flex-end">
              <Button loading={loading} onClick={() => onCancel()}>
                ยกเลิก
              </Button>
              <Button loading={loading} type="primary" onClick={() => form.submit()}>
                {formType === 'create' ? 'ยืนยัน' : 'บันทึก'}
              </Button>
            </Space>
          ) : null
        }
      >
        <TableHeros
          columns={columns}
          dataSource={permissionList.find((ss) => ss.id === pick)?.items || []}
          loading={loading}
        />
      </LabsContent>
    </Form>
  );
}
