import { Col, DatePicker, Form, Input, InputNumber, Typography } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

import { BUCKETNAME_SOS } from 'constants/SOSConstant';
import { ImageBannerUpload } from '../../../../components/shared-components/image-banner-upload';
import { ImageUploadIcon } from '../../../shared';
import { PersonnelDepartmentSelect } from '../personnel-department-select';
import { PersonnelGenderSelect } from '../personnel-gender-select';
import { PersonnelOrganizationSelect } from '../personnel-organization-select';
import { PersonnelPositionSelect } from '../personnel-position-select';
import { PersonnelPrefixSelect } from '../personnel-prefix-select';
import { PersonnelRoleSelect } from '../personnel-role-select';
import RowFixed from 'components/shared-components/RowFixed';
import dayjs from 'dayjs';

export const PersonnelForm = ({ form, showPasswordField = true, personnelId = null }) => {
  function validateFieldsInput(event, max = 10, field = 'phone_number') {
    const isNumber = /^\d$/.test(event?.key);
    const isBackspace = event?.key === 'Backspace';
    if (!isNumber && !isBackspace) {
      event?.preventDefault();
    } else {
      if (form.getFieldValue(field)?.length >= max && !isBackspace) {
        event?.preventDefault();
      }
    }
  }

  return (
    <Form
      form={form}
      validateTrigger={['onSubmit', 'onBlur']}
      layout="vertical"
      onValuesChange={(changedValues) => {
        if (changedValues?.birth_day) {
          const age = dayjs().diff(changedValues.birth_day.format(), 'year');
          form?.setFieldsValue({ age });
        }
        if (changedValues?.organization_id) {
          form?.setFieldsValue({
            role_id: undefined,
            department_id: undefined,
            position_id: undefined,
          });
        }
      }}
    >
      <RowFixed>
        <Col xs={24} sm={5}>
          <Form.Item name="image_url">
            <ImageBannerUpload
              value={form.getFieldValue('image_url')}
              module={BUCKETNAME_SOS[0].profile.module}
              group={BUCKETNAME_SOS[0].profile.group}
              bucketName={BUCKETNAME_SOS[0].value}
              fileName={personnelId || ''}
              height={100}
              icon={<ImageUploadIcon />}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={19}>
          <Typography.Title level={5}>ข้อมูล</Typography.Title>
          <RowFixed>
            <Col xs={24} sm={12} md={12} lg={4} xl={4} xxl={4}>
              <Form.Item
                label="คำนำหน้า (TH)"
                name="prefix_name_th"
                rules={[
                  {
                    required: true,
                    message: 'กรุณาเลือกคำนำหน้า (TH)',
                  },
                ]}
              >
                <PersonnelPrefixSelect locale="th" placeholder="คำนำหน้า" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={10} xl={10} xxl={10}>
              <Form.Item
                label="ชื่อ (TH)"
                name="first_name_th"
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกชื่อ (TH)',
                  },
                ]}
              >
                <Input placeholder="กรอกชื่อ" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={10} xl={10} xxl={10}>
              <Form.Item
                label="นามสกุล (TH)"
                name="last_name_th"
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกนามสกุล (TH)',
                  },
                ]}
              >
                <Input placeholder="กรอกนามสกุล" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={12} lg={4} xl={4} xxl={4}>
              <Form.Item
                label="คำนำหน้า (EN)"
                name="prefix_name_en"
                rules={[
                  {
                    required: true,
                    message: 'กรุณาเลือกคำนำหน้า (EN)',
                  },
                ]}
              >
                <PersonnelPrefixSelect locale="en" placeholder="คำนำหน้า" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={10} xl={10} xxl={10}>
              <Form.Item
                label="ชื่อ (EN)"
                name="first_name_en"
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกชื่อ (EN)',
                  },
                ]}
              >
                <Input placeholder="กรอกชื่อ" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={10} xl={10} xxl={10}>
              <Form.Item
                label="นามสกุล (EN)"
                name="last_name_en"
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกนามสกุล (EN)',
                  },
                ]}
              >
                <Input placeholder="กรอกนามสกุล" />
              </Form.Item>
            </Col>
          </RowFixed>
        </Col>
      </RowFixed>
      <RowFixed>
        <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
          <Form.Item
            label="บัตรประจำตัวประชาขน"
            name="person_card_id"
            rules={[
              {
                required: true,
                message: 'กรุณากรอกบัตรประจำตัวประชาขน',
              },
              {
                pattern: /^[0-9]{13}$/,
                message: 'กรุณากรอกบัตรประจำตัวประชาขนให้ถูกต้อง',
              },
            ]}
          >
            <Input
              allowClear
              placeholder="กรอกบัตรประจำตัวประชาขน"
              onKeyDown={(event) => validateFieldsInput(event, 13, 'person_card_id')}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={4} xl={4} xxl={4}>
          <Form.Item
            label="วันเดือนปีเกิด"
            name="birth_day"
            rules={[
              {
                required: true,
                message: 'กรุณาเลือกวันเดือนปีเกิด',
              },
            ]}
          >
            <DatePicker
              className="gx-w-100"
              format="DD/MM/YYYY"
              disabledDate={(current) => {
                const age = dayjs().diff(current, 'year');
                return (current && current > dayjs().endOf('day')) || age < 1;
              }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={4} xl={4} xxl={4}>
          <Form.Item
            label="อายุ"
            name="age"
            rules={[
              {
                validator: (rule, value) => {
                  if (value > 0 || !value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('อายุต้องมากกว่า 0 ปี'));
                },
              },
            ]}
          >
            <InputNumber min={0} max={999} placeholder="เลือกอายุ" style={{ width: '100%' }} disabled />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
          <Form.Item label="เพศ" name="gender">
            <PersonnelGenderSelect placeholder="เลือกเพศ" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
          <Form.Item label="ที่อยู่" name="address">
            <Input placeholder="กรอกที่อยู่" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
          <Form.Item
            label="เบอร์โทร"
            name="phone_number"
            rules={[
              {
                required: true,
                message: 'กรุณากรอกเบอร์โทร',
              },
              {
                pattern: /^0[0-9]{8,9}$/,
                message: 'กรุณากรอกเบอร์โทรให้ถูกต้อง',
              },
            ]}
          >
            <Input
              allowClear
              parser={(value) => {
                return value.substring(0, 2);
              }}
              placeholder="กรอกเบอร์โทร"
              onKeyDown={(event) => validateFieldsInput(event)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
          <Form.Item
            label="องค์กร"
            name="organization_id"
            rules={[
              {
                required: true,
                message: 'กรุณาเลือกองค์กร',
              },
            ]}
          >
            <PersonnelOrganizationSelect placeholder="เลือกองค์กร" disabled={personnelId} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
          <Form.Item
            shouldUpdate={(prevValues, currentValues) => prevValues.organization_id !== currentValues.organization_id}
          >
            {({ getFieldValue }) => {
              return (
                <Form.Item
                  label="บทบาท"
                  name="role_id"
                  rules={[
                    {
                      required: true,
                      message: 'กรุณาเลือกบทบาท',
                    },
                  ]}
                >
                  <PersonnelRoleSelect
                    disabled={!getFieldValue('organization_id')}
                    placeholder="เลือกบทบาท"
                    organizationId={getFieldValue('organization_id')}
                  />
                </Form.Item>
              );
            }}
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
          <Form.Item
            shouldUpdate={(prevValues, currentValues) => prevValues.organization_id !== currentValues.organization_id}
          >
            {({ getFieldValue }) => {
              return (
                <Form.Item label="ฝ่ายงาน" name="department_id">
                  <PersonnelDepartmentSelect
                    disabled={!getFieldValue('organization_id')}
                    placeholder="เลือกฝ่ายงาน"
                    organizationId={getFieldValue('organization_id')}
                  />
                </Form.Item>
              );
            }}
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
          <Form.Item
            shouldUpdate={(prevValues, currentValues) => prevValues.organization_id !== currentValues.organization_id}
          >
            {({ getFieldValue }) => {
              return (
                <Form.Item label="ตำแหน่ง" name="position_id">
                  <PersonnelPositionSelect
                    disabled={!getFieldValue('organization_id')}
                    placeholder="เลือกตำแหน่ง"
                    organizationId={getFieldValue('organization_id')}
                  />
                </Form.Item>
              );
            }}
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
          <Form.Item
            label="อีเมล"
            name="email"
            rules={[
              {
                required: true,
                message: 'กรุณากรอกอีเมล',
              },
              {
                type: 'email',
                message: 'กรุณากรอกอีเมลให้ถูกต้อง',
              },
            ]}
          >
            <Input placeholder="กรอกอีเมล" />
          </Form.Item>
        </Col>
        {showPasswordField && (
          <>
            <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
              <Form.Item
                label="ตั้งรหัสผ่าน"
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'กรุณาตั้งรหัสผ่าน',
                  },
                  {
                    min: 8,
                    message: 'รหัสผ่านต้องมากกว่า 8 ตัว',
                  },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                    message: 'รหัสผ่านต้องประกอบด้วยตัวอักษรพิมพ์ใหญ่ พิมพ์เล็ก ตัวเลข และอักขระพิเศษ',
                  },
                ]}
              >
                <Input.Password
                  placeholder="ตั้งรหัสผ่าน"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
              <Form.Item shouldUpdate={(prevValues, currentValues) => prevValues.password !== currentValues.password}>
                {({ getFieldValue }) => (
                  <Form.Item
                    label="กรอกรหัสผ่านอีกครั้ง"
                    name="confirmPassword"
                    rules={[
                      {
                        required: true,
                        message: 'กรุณากรอกรหัสผ่านอีกครั้ง',
                      },
                      {
                        validator: (rule, value) => {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('รหัสผ่านไม่ตรงกัน'));
                        },
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="กรอกรหัสผ่านอีกครั้ง"
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                  </Form.Item>
                )}
              </Form.Item>
            </Col>
          </>
        )}
      </RowFixed>
    </Form>
  );
};
