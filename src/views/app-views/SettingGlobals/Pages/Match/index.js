import { observer } from 'mobx-react';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import { ArrowLeftOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, Form, Menu, Row, Select, Space, Typography } from 'antd';
import SearchMultiverse from 'components/shared-components/SearchMultiverse';
import LabsContent from 'components/layout-components/LabsContent';
import ContentPlaceholder from 'components/layout-components/ContentPlaceholder';
import { useState } from 'react';
import DialogNotification from 'components/shared-components/DialogNotification';
import usePopup from 'hooks/usePopup';
import { SuffixCheckbox } from 'utils/style-js';

const { Title, Text } = Typography;
const { Option } = Select;

const menu = [
  {
    key: '1',
    label: 'ประเภทการละเมิด',
  },
  {
    key: '2',
    label: 'แอดมินสายตรวจ',
  },
  {
    key: '3',
    label: 'การตอบสนองสิทธิตามคำแนะนำ',
  },
];

const attributeTypes = [
  {
    key: '1',
    value: 'หมวดหมู่การทารุณสัตว์',
  },
  {
    key: '2',
    value: 'ประเภทการละเมิด',
  },
  {
    key: '3',
    value: 'แอดมินสายตรวจ',
  },
];

const codeTypes = [
  {
    key: '1',
    value: 'ประเภทการละเมิน (GA_FAM_V...',
  },
  {
    key: '2',
    value: 'ประเภทการละเมิน (CA_CLETS)',
  },
  {
    key: '3',
    value: 'การควบคุมการเข้าถึง  (MMUCC)',
  },
];

const AddMatchItem = ({ remove, name }) => (
  <Card>
    <Button className="gx-position-absolute" ghost onClick={() => remove(name)}>
      <DeleteOutlined />
    </Button>
    <Title level={5}>การจับคู่คุณลักษณะกับรหัสมาตรฐานภายในระบบ ({name + 1})</Title>
    <Row gutter={[16, 5]} className="gx-flex-row">
      <Col span={8}>
        <Form.Item className="gx-mb-0" label={`ประเภทคุณลักษณะ`} name={`attribute_type_${name}`}>
          <Select placeholder="เลือกประเภทคุณลักษณะ" showSearch>
            {attributeTypes.map(({ value = '', key }) => (
              <Option key={key} value={value} />
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={16}>
        <SuffixCheckbox>
          <Form.Item className="gx-mb-0" name={`is_required_${name}`} valuePropName="checked">
            <Checkbox>จำเป็นต้องระบุ</Checkbox>
          </Form.Item>
        </SuffixCheckbox>
        <Form.Item className="gx-mb-0" label={`ประเภทของรหัส`} name={`code_type_${name}`}>
          <Select placeholder="เลือกประเภทของรหัส" showSearch>
            {codeTypes.map(({ value = '', key }) => (
              <Option key={key} value={value} />
            ))}
          </Select>
        </Form.Item>
      </Col>
    </Row>
  </Card>
);

const MatchAttributeAndCode = (props) => {
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

  const onMenuClick = (e) => {
    form.resetFields();
    setCurrentMenu(e.key);
  };

  return (
    <>
      <div className="gx-main-content">
        <PageBreadcrumb
          history={props.history}
          pageLabel={{ master: 'ตั้งค่า', subpath: 'การจับคู่คุณลักษณะกับรหัสมาตรฐาน' }}
        />
        <Card>
          <SearchMultiverse mode="auto" />
        </Card>
        <LabsContent
          titleContent={
            <Space>
              <SettingOutlined style={{ fontSize: 24 }} />
              <Title level={5} className="gx-mb-0">
                การจับคู่คุณลักษณะ <br />
                กับรหัสมาตรฐาน
              </Title>
            </Space>
          }
          sideContent={
            <>
              <Row className="gx-mt-2 gx-px-2 gx-flex-row" gutter={[8, 8]}>
                <Col span={24}>
                  <Text style={{ paddingLeft: '11px' }}>(ประเภทคุณลักษณะ)</Text>
                </Col>
              </Row>
              <Menu onClick={onMenuClick} mode="inline" items={menu} />
            </>
          }
          header={currentMenu ? <ArrowLeftOutlined onClick={onBackClick} /> : <div></div>}
        >
          {!currentMenu && <ContentPlaceholder message="เลือกการจับคู่คุณลักษณะกับรหัสมาตรฐาน" />}
          {currentMenu && (
            <>
              <div className="gx-p-4">
                <Title level={4}>ข้อมูลการจับคู่คุณลักษณะกับรหัสมาตรฐานภายในระบบ</Title>
                <Form layout="vertical" form={form}>
                  <div className="gx-mt-4">
                    <Form.List name="codes">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name }) => (
                            <AddMatchItem key={key} name={name} remove={remove} />
                          ))}
                          <Row className="gx-mt-4">
                            <Col span={8} style={{ paddingLeft: '0' }}>
                              <Button type="primary" className="gx-full-width" onClick={() => add()}>
                                เพิ่ม
                              </Button>
                            </Col>
                          </Row>
                        </>
                      )}
                    </Form.List>
                  </div>
                  <div style={{ padding: '10px' }}>
                    <Space className="gx-full-width gx-flex-end">
                      <Button onClick={onCancel}>ยกเลิก</Button>
                      <Button type="primary" onClick={onSubmit}>
                        บันทึก
                      </Button>
                    </Space>
                  </div>
                </Form>
              </div>
            </>
          )}
        </LabsContent>
      </div>
    </>
  );
};
export default observer(MatchAttributeAndCode);
