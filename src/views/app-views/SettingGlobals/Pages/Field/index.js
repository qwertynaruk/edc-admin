import { SettingOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, Form, Input, InputNumber, Menu, Row, Space, Typography } from 'antd';
import LabsContent from 'components/layout-components/LabsContent';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import DialogNotification from 'components/shared-components/DialogNotification';
import LabelShowText from 'components/shared-components/LabelShowText';
import usePopup from 'hooks/usePopup';

const { Title } = Typography;

const fields = [
  {
    key: 'กล่องฟิล์ดข้อมูล 1',
    label: 'กล่องฟิล์ดข้อมูล 1',
  },
  {
    key: 'กล่องฟิล์ดข้อมูล 2',
    label: 'กล่องฟิล์ดข้อมูล 2',
  },
  {
    key: 'กล่องฟิล์ดข้อมูล 3',
    label: 'กล่องฟิล์ดข้อมูล 3',
  },
];
const Field = (props) => {
  const [form] = Form.useForm();
  const [fireConfirm] = usePopup();
  const onCancel = () => {
    if (form.isFieldsTouched()) {
      fireConfirm();
    }
  };
  const onSubmit = () => {
    form.validateFields().then((values) => {
      Math.random() < 0.5
        ? DialogNotification('error', 'แก้ไขฟิล์ดไม่สำเร็จ')
        : DialogNotification('success', 'แก้ไขฟิล์ดสำเร็จ');
    });
  };
  return (
    <>
      <Form form={form} layout="vertical">
        <PageBreadcrumb history={props.history} pageLabel={{ master: 'ตั้งค่า', subpath: 'ฟิล์ดข้อมูล' }} />
        <LabsContent
          titleContent={
            <Space>
              <SettingOutlined style={{ fontSize: 24 }} />
              <Title level={5} className="gx-mb-0">
                ฟิล์ดข้อมูล
              </Title>
            </Space>
          }
          header={<div />}
          sideContent={
            <>
              <Row className="gx-mt-2 gx-px-2 gx-flex-row" gutter={[8, 8]}>
                <Col span={24}>
                  <Button className="gx-full-width" type="primary" onClick={() => console.log('hello')}>
                    เพิ่ม
                  </Button>
                </Col>
              </Row>
              <Menu onClick={(e) => {}} defaultSelectedKeys={fields[0].key} mode="inline" items={fields} />
            </>
          }
        >
          <Card className="gx-m-4">
            <Title level={3}>กล่องฟิล์ดข้อมูล</Title>
            <LabelShowText labelText="ชื่อภายในระบบ" value={'กล่องฟิล์ดข้อมูลรายงาน'} />
            <LabelShowText labelText="ประเภทของฟิลด์ข้อมูล" value={'ประเภทของฟิลด์ข้อมูล'} />
            <LabelShowText labelText="คำอธิบายภายในระบบ" value={'คำอธิบายข้อมูลฟิล์ดข้อมูล'} />
            <LabelShowText labelText="จำนวนอักขระขั้นต่ำ" value={'1'} />
            <LabelShowText labelText="จำนวนอักขระสูงสุด" value={'265'} />
            <LabelShowText labelText="สามารถซ่อนฟิลด์ได้ ?" value={'สามารถซ่อนฟิลด์ได้?'} />
            <Row gutter={[16, 16]} className="gx-flex-row">
              <Col span={8}>
                <Form.Item name="name" label="ชื่อที่แสดง">
                  <Input placeholder="กรอกชื่อที่แสดง" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="minimum" label="อักขระขั้นต่ำที่ต้อระบุ">
                  <InputNumber type="number" placeholder="0" className="gx-full-width" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="maximum" label="อักขระสูงสุดที่ระบุได้">
                  <InputNumber type="number" placeholder="265" className="gx-full-width" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card className="gx-mx-4">
            <Title level={4}>ชื่อหน้าเว็บฟอร์มใช้งาน</Title>
            <LabelShowText labelText="ชื่อหน้าเว็บฟอร์มใช้งาน" value={'กล่องฟิล์ดข้อมูลรายงาน'} />
            <Form.Item name="active">
              <Checkbox>ใช้งาน</Checkbox>
            </Form.Item>
            <Row gutter={[16, 16]} className="gx-flex-row">
              <Col span={8}>
                <Form.Item name="tooltip" label="ข้อความช่วยเหลือ">
                  <Input placeholder="กรอกข้อความช่วยเหลือ" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="placeholder" label="ข้อความตัวอย่าง">
                  <Input placeholder="กรอกข้อความตัวอย่าง" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <div className="gx-m-4">
            <Space className="gx-full-width gx-flex-end">
              <Button onClick={onCancel}>ยกเลิก</Button>
              <Button type="primary" onClick={onSubmit}>
                บันทึก
              </Button>
            </Space>
          </div>
        </LabsContent>
      </Form>
    </>
  );
};

export default Field;
