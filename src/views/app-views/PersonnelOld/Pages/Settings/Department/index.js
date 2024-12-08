import 'styles/sweetalert/index.scss';

import { Button, Col, Form, Input, Menu, Select, Typography } from 'antd';

import CardLeftRightComponent from 'components/layout-components/CardLeftRightComponent';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import RowFixed from 'components/shared-components/RowFixed';
import { SearchOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import { useState } from 'react';

export const GLOBALS_PROPS = {
  confirmButtonColor: '#1B2531',
  confirmButtonText: 'ยืนยัน',
  cancelButtonText: 'ยกเลิก',
};

const { Title } = Typography;

const Department = () => {
  const [form] = Form.useForm();
  const [search, setSearch] = useState(false);
  const [searchText, setSearchText] = useState('');

  const itemMenu = [
    { label: 'all', key: 'item-all' }, // remember to pass the key prop
    { label: 'item 1', key: 'item-1' }, // remember to pass the key prop
    { label: 'item 2', key: 'item-2' }, // which is required
    {
      label: 'sub menu',
      key: 'submenu',
      children: [{ label: 'item 3', key: 'submenu-item-1' }],
    },
  ];

  const onClick = (e) => {
    console.log('click ', e);
  };

  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'สิทธิ์การใช้งาน', subpath: 'ฝ่ายงาน' }} />
      <CardLeftRightComponent
        leftHeder={<span>ฝ่ายงาน</span>}
        rightHeader={
          <>
            <Select
              defaultValue="lucy"
              options={[
                {
                  value: 'jack',
                  label: 'Jack',
                },
                {
                  value: 'lucy',
                  label: 'Lucy',
                },
                {
                  value: 'disabled',
                  disabled: true,
                  label: 'Disabled',
                },
                {
                  value: 'Yiminghe',
                  label: 'yiminghe',
                },
              ]}
            />
            <Button>ออกรายงาน</Button>
          </>
        }
        leftContent={
          <>
            <div style={{ display: 'flex', alignItems: 'stretch' }}>
              <Button type="primary" style={{ flexGrow: 8 }}>
                เพิ่ม
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setSearch(!search);
                }}
                icon={<SearchOutlined />}
              />
            </div>
            {search && (
              <div style={{ marginTop: 10 }}>
                <Input placeholder="ค้นหา" allowClear />
              </div>
            )}
            <Menu
              onClick={onClick}
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              mode="inline"
              items={itemMenu}
            />
          </>
        }
        rightContent={
          <>
            <Title level={5}>ข้อมูลพื้นฐาน</Title>
            <Form form={form} layout="vertical" onFinish={() => console.log('finish')}>
              <RowFixed>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item rules={[{ required: true }]} label="ชื่อฝ่ายงาน (TH)" name="name">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={4}>
                  <Form.Item rules={[{ required: true }]} label="ชื่อย่อ (TH)" name="name1">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item rules={[{ required: true }]} label="ชื่อฝ่ายงาน (EN)" name="name2">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={4}>
                  <Form.Item rules={[{ required: true }]} label="ชื่อย่อ (EN)" name="name3">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} lg={24}>
                  <Form.Item label="รายละเอียด" name="name4">
                    <Input />
                  </Form.Item>
                </Col>
              </RowFixed>
            </Form>
          </>
        }
        footerContent={
          <>
            <Button>ยกเลิก</Button>
            <Button type="primary" onClick={() => form.submit()}>
              บันทึก
            </Button>
          </>
        }
      />
    </>
  );
};

export default observer(Department);
