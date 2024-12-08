import { LockOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Radio, Row, Space, Spin, Typography } from 'antd';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import AlertErrorMessage from 'components/shared-components/AlertErrorMessage';
import InputTextNumber from 'components/shared-components/InputTextNumber';
import LabelShowText from 'components/shared-components/LabelShowText';
import MasterSelectWidget from 'components/shared-components/MasterSelectWidget';
import SingleImageUpload from 'components/shared-components/SingleImageUpload';
import { observer } from 'mobx-react';
import { rules } from 'mobx/UserStore';

const { Text } = Typography;

const UserEditor = ({
  form,
  onSubmit,
  onCancel,
  history,
  contentLoading = false,
  actionLoading = false,
  subpath = 'เพิ่มผู้ใช้งาน',
  edit = false,
  errorMessage,
}) => {
  return (
    <Spin spinning={contentLoading}>
      <div className="gx-main-content">
        <PageBreadcrumb history={history} pageLabel={{ master: 'ตั้งค่าผู้ใช้งาน', subpath }} />
        <Card>
          <Form layout="vertical" form={form} onFinish={onSubmit}>
            <Row gutter={[16, 16]} className="gx-flex-row">
              <Col span={4}>
                <Form.Item name="s3_upload_key" hidden noStyle>
                  <Input type="hidden" />
                </Form.Item>
                <Form.Item name="cover_image_file">
                  <SingleImageUpload form={form} bucketName="md-organization" fieldName="cover_image_file" />
                </Form.Item>
              </Col>
              <Col span={20}>
                <Row gutter={[16, 16]} className="gx-flex-row">
                  <Col span={24}>
                    <Text strong>ข้อมูลพื้นฐาน</Text>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name="is_active"
                      initialValue={true}
                      label={'สถานะปัจจุบัน'}
                      className="gx-flex-row gx-align-items-end gx-mb-0"
                      style={{ gap: '1rem' }}
                    >
                      <Radio.Group>
                        <Radio value={true}>ใช้งาน</Radio>
                        <Radio value={false}>ไม่ใช้งาน</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    {edit && (
                      <LabelShowText labelText="เลขประจำตัวประชาชน" value={form.getFieldValue('person_card_id')} />
                    )}

                    <Form.Item
                      noStyle={edit}
                      hidden={edit}
                      name="person_card_id"
                      label={'เลขประจำตัวประชาชน'}
                      rules={rules.personCardId}
                    >
                      <InputTextNumber placeholder="กรอกเลขประจำตัวประชาชน" className="gx-full-width" maxLength={13} />
                    </Form.Item>
                  </Col>
                  <Col span={16} style={{ display: 'flex', alignItems: 'center' }}>
                    {/* {!edit && <Button>ดึงรายละเอียดจากข้อมูลกำลังพล</Button> } */}
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="email"
                      label={'อีเมลสำหรับการเข้าใช้งาน'}
                      rules={[
                        {
                          required: true,
                          message: 'กรุณากรอกอีเมลสำหรับการเข้าใช้งาน',
                        },
                      ]}
                    >
                      <Input placeholder="กรอกอีเมลสำหรับการเข้าใช้งาน" />
                    </Form.Item>
                  </Col>
                  {!edit && (
                    <>
                      <Col span={8}>
                        <Form.Item name="password" label={'รหัสผ่าน'} rules={rules.password}>
                          <Input.Password
                            placeholder="กรอกรหัสผ่าน"
                            suffix={<LockOutlined className="text-primary" />}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name="password_confirmation"
                          dependencies={['password']}
                          label={'ยืนยันรหัสผ่าน'}
                          rules={rules.passwordConfirm}
                        >
                          <Input.Password
                            placeholder="กรอกรหัสผ่านอีกครั้ง"
                            suffix={<LockOutlined className="text-primary" />}
                          />
                        </Form.Item>
                      </Col>
                    </>
                  )}
                </Row>
              </Col>
            </Row>
            <Row gutter={[16, 16]} className="gx-flex-row">
              <Col span={4}>
                <Form.Item
                  name="prefix_name"
                  label={'คำนำหน้า'}
                  rules={[
                    {
                      required: true,
                      message: 'กรุณาเลือกคำนำหน้า',
                    },
                  ]}
                >
                  <MasterSelectWidget showSearch placeholder="เลือกคำนำหน้า" category="29" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="first_name"
                  label={'ชื่อ'}
                  rules={[
                    {
                      required: true,
                      message: 'กรุณากรอกชื่อ',
                    },
                  ]}
                >
                  <Input placeholder="กรอกชื่อ" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="middle_name" label={'ชื่อกลาง'}>
                  <Input placeholder="กรอกชื่อกลาง" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="last_name"
                  label={'นามสกุล'}
                  rules={[
                    {
                      required: true,
                      message: 'กรุณากรอกนามสกุล',
                    },
                  ]}
                >
                  <Input placeholder="กรอกนามสกุล" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]} className="gx-flex-row">
              <Col span={8}>
                <Form.Item
                  label="เบอร์โทรศัพท์"
                  name="phone_number"
                  rules={[
                    {
                      required: true,
                      message: 'กรุณากรอกเบอร์โทรศัพท์',
                    },
                  ]}
                >
                  <InputTextNumber placeholder="กรอกเบอร์โทรศัพท์" />
                </Form.Item>
              </Col>
            </Row>
            {errorMessage && (
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <AlertErrorMessage message={errorMessage} />
                </Col>
              </Row>
            )}
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Space className="gx-full-width gx-flex-end">
                  <Button onClick={onCancel}>ยกเลิก</Button>
                  <Button type="primary" htmlType="submit" loading={actionLoading}>
                    บันทึก
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    </Spin>
  );
};

export default observer(UserEditor);
