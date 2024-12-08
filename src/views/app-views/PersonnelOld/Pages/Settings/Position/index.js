import 'styles/sweetalert/index.scss';

import { Button, Col, Form, Input, Menu, Typography } from 'antd';

import CardLeftRightComponent from 'components/layout-components/CardLeftRightComponent';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import RowFixed from 'components/shared-components/RowFixed';
import { SearchOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';

export const GLOBALS_PROPS = {
  confirmButtonColor: '#1B2531',
  confirmButtonText: 'ยืนยัน',
  cancelButtonText: 'ยกเลิก',
};

const { Title } = Typography;

const SettingPosition = () => {
  const [form] = Form.useForm();
  const items = [
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

  const onSearch = (value) => {
    console.log('value', value);
  };

  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'สิทธิ์การใช้งาน', subpath: 'ตำแหน่ง' }} />
      <CardLeftRightComponent
        leftHeder={<span>ตำแหน่ง</span>}
        leftContent={
          <>
            <div style={{ display: 'flex', alignItems: 'stretch' }}>
              <Button type="primary" style={{ flexGrow: 8 }}>
                เพิ่ม
              </Button>
              <Button type="primary" icon={<SearchOutlined />} />
            </div>
            <div style={{ marginTop: 10 }}>
              <Input.Search placeholder="ค้นหา" onSearch={onSearch} allowClear />
            </div>
            <Menu
              onClick={onClick}
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              mode="inline"
              items={items}
            />
          </>
        }
        rightContent={
          <>
            <Title level={5}>ข้อมูลพื้นฐาน</Title>
            <Form form={form} layout="vertical" autoComplete="off">
              <RowFixed>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item rules={[{ required: true, message: '' }]} label="ชื่อตำแหน่ง (TH)" name="name">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={4}>
                  <Form.Item rules={[{ required: true }]} label="ชื่อย่อ (TH)" name="name1">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item rules={[{ required: true }]} label="ชื่อตำแหน่ง (EN)" name="name2">
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
            <Button type="primary">บันทึก</Button>
          </>
        }
      />
    </>
  );
};

export default observer(SettingPosition);
