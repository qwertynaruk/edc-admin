import { observer } from 'mobx-react';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import { ArrowLeftOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Menu, Row, Select, Space, Typography } from 'antd';
import SearchMultiverse from 'components/shared-components/SearchMultiverse';
import LabsContent from 'components/layout-components/LabsContent';
import { useState } from 'react';
import ContentPlaceholder from 'components/layout-components/ContentPlaceholder';
import usePopup from 'hooks/usePopup';
import DialogNotification from 'components/shared-components/DialogNotification';

const { Title } = Typography;
const { Option } = Select;

const code = [
  {
    key: '1',
    label: 'ประเภทการละเมิน (GA_FAM_V...',
  },
  {
    key: '2',
    label: 'ประเภทการละเมิน (CA_CLETS)',
  },
  {
    key: '3',
    label: 'การควบคุมการเข้าถึง  (MMUCC)',
  },
];

const codeFrom = [
  {
    key: '1',
    value: 'Test',
  },
  {
    key: '2',
    value: 'test2',
  },
];

const AddCodeItem = ({ remove, name }) => (
  <Card>
    <Button className="gx-position-absolute" ghost onClick={() => remove(name)}>
      <DeleteOutlined />
    </Button>
    <Title level={5}>ข้อมูลรหัสมาตรฐาน ({name + 1})</Title>
    <Row gutter={[16, 5]} className="gx-flex-row">
      <Col span={8}>
        <Form.Item className="gx-mb-0" label={`รหัสมาตรฐาน`} name={`code_${name}`}>
          <Input placeholder="กรอกรหัสมาตรฐาน" />
        </Form.Item>
      </Col>
      <Col span={16}>
        <Form.Item className="gx-mb-0" label={`รายละเอียดของรหัส`} name={`detail_${name}`}>
          <Input placeholder="กรอกรายละเอียดของรหัส" />
        </Form.Item>
      </Col>
    </Row>
  </Card>
);

const StandardCodeManagement = (props) => {
  const [currentMenu, setCurrentMenu] = useState(null);
  const [form] = Form.useForm();
  const [fireConfirmPopup] = usePopup();

  const onSubmit = () => {
    Math.random() < 0.5
      ? DialogNotification('error', 'แก้ไขรหัสมาตรฐานไม่สำเร็จ')
      : DialogNotification('success', 'แก้ไขรหัสมาตรฐานสำเร็จ');
    setCurrentMenu(null);
  };

  const onCancel = () => {
    if (form.isFieldsTouched()) {
      fireConfirmPopup().then((res) => {
        if (res.isConfirmed) {
          setCurrentMenu(null);
          form.resetFields();
        }
      });
      return;
    }
    setCurrentMenu(null);
  };

  const onBackClick = () => {
    setCurrentMenu(null);
  };

  const onCreateClick = () => {
    form.resetFields();
    setCurrentMenu('abe6377e-bead-4960-88cc-b7e3c9b1b247'); // Magic number can be anything that not conflict with other keys
  };

  const onMenuClick = (e) => {
    form.resetFields();
    setCurrentMenu(e.key);
  };
  return (
    <>
      <div className="gx-main-content">
        <PageBreadcrumb history={props.history} pageLabel={{ master: 'ตั้งค่า', subpath: 'คุณลักษณะ' }} />
        <Card>
          <SearchMultiverse mode="auto" />
        </Card>
        <LabsContent
          titleContent={
            <Space>
              <SettingOutlined style={{ fontSize: 24 }} />
              <Title level={5} className="gx-mb-0">
                รหัสมาตรฐาน
              </Title>
            </Space>
          }
          sideContent={
            <>
              <Row className="gx-mt-2 gx-px-2 gx-flex-row" gutter={[8, 8]}>
                <Col span={24}>
                  <Button className="gx-full-width" type="primary" onClick={onCreateClick}>
                    เพิ่ม
                  </Button>
                </Col>
              </Row>
              <Menu onClick={onMenuClick} mode="inline" items={code} />
            </>
          }
          header={currentMenu ? <ArrowLeftOutlined onClick={onBackClick} /> : <div></div>}
        >
          {!currentMenu && <ContentPlaceholder message="เลือกรหัสมาตรฐานเพื่อแสดงข้อมูล" />}
          {currentMenu && (
            <>
              <Form className="gx-p-4" layout="vertical" form={form}>
                <Row gutter={[16, 5]}>
                  <Col span={24}>
                    <Form.Item label="แหล่งที่มาของรหัส" name="code_from">
                      <Select placeholder="เลือกแหล่งที่มาของรหัส" showSearch>
                        {codeFrom.map(({ value = '', key }) => (
                          <Option key={key} value={value} />
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[16, 5]}>
                  <Col span={24}>
                    <Form.Item label="ประเภทของรหัส" name="code_category">
                      <Select
                        placeholder="ประเภทของรหัส"
                        showSearch
                        defaultValue={code.find((x) => x.key === currentMenu)}
                      >
                        {code.map(({ label = '', key }) => (
                          <Option key={key} value={label} />
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[16, 5]}>
                  <Col span={24}>
                    <Form.Item label="ชื่อ" name="code_name">
                      <Input placeholder="กรอกชื่อ" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[16, 5]}>
                  <Col span={24}>
                    <Form.Item label="รายละเอียด" name="code_detail">
                      <Input placeholder="รายละเอียด" />
                    </Form.Item>
                  </Col>
                </Row>
                <Card>
                  <Row className="gx-flex-row" gutter={[16, 24]}>
                    <Col span={24}>
                      <Title level={4} className="gx-mb-0">
                        รหัสมาตรฐาน
                      </Title>
                    </Col>
                  </Row>
                  <div className="gx-mt-4">
                    <Form.List name="codes">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name }) => (
                            <AddCodeItem key={key} name={name} remove={remove} />
                          ))}
                          <Space className="gx-mt-4">
                            <Button type="primary" onClick={() => add()}>
                              เพิ่มรหัสมาตรฐาน
                            </Button>
                          </Space>
                        </>
                      )}
                    </Form.List>
                  </div>
                </Card>
                <div style={{ padding: '10px' }}>
                  <Space className="gx-full-width gx-flex-end">
                    <Button onClick={onCancel}>ยกเลิก</Button>
                    <Button type="primary" onClick={onSubmit}>
                      บันทึก
                    </Button>
                  </Space>
                </div>
              </Form>
            </>
          )}
        </LabsContent>
      </div>
    </>
  );
};
export default observer(StandardCodeManagement);
