import { Col, Divider, Form, Grid, Input, InputNumber, Row, Typography } from 'antd';
import { css, cx } from '@emotion/css';
import { useEffect, useState } from 'react';

import BoxRoute from 'components/shared-components/BoxRoute';
import DatePicker from 'components/shared-components/DatePicker';
import DatePickerISOHoC from 'components/shared-components/DatePickerISOHoC';
import IconCustom from '@ant-design/icons';
import MasterSelectWidget from 'components/shared-components/MasterSelectWidget';
import OrganizationTree from './OrganizationTree';
import { ReactComponent as PersonelIcon } from 'assets/images/personel.svg';
import PersonnelService from 'services/PersonelService';
import PlaceLocalWidget from 'components/shared-components/PlaceLocalWidget';
import _ from 'lodash';
import moment from 'moment';
import password from 'secure-random-password';
import { serviceWrapper } from 'utils/serviceHelper';
import useService from 'hooks/useService';

const { useBreakpoint } = Grid;
const RowFixed = ({ className, ...props }) => {
  return (
    <Row
      className={cx([
        className,
        'gx-flex-row',
        css`
          margin: 0 -1rem !important;
          height: 100%;
          align-content: flex-start;
          ${props?.margintop ? `margin-top: ${props.margintop}px !important;` : ''}
        `,
      ])}
      {...props}
    />
  );
};

const PasswordTooltip = () => {
  return (
    <>
      <Typography.Title level={5}>วิธีการสร้างรหัสผ่าน</Typography.Title>
      <ul>
        <li>ต้องมีอักษรภาษาอังกฤษ อักษรพิเศษ และตัวเลข รวมกันอย่างน้อย 8 ตัว</li>
        <li>ต้องมีอักษรภาษาอังกฤษตัวพิมใหญ่ในรหัสผ่านอย่างน้อย 1 ตัว</li>
        <li>ต้องมีอักษรภาษาอังกฤษตัวพิมเล็กในรหัสผ่านอย่างน้อย 1 ตัว</li>
        <li>ต้องมีอักษรพิเศษอย่างน้อย 1 ตัว (เช่น * # @ % - +)</li>
        <li>ต้องมีตัวเลขอย่างน้อย 1 ตัว</li>
      </ul>
    </>
  );
};

function InternalInformationTab({ manager }) {
  const screens = useBreakpoint();
  return (
    <RowFixed>
      <Col sm={23} lg={14} className="gx-p-0">
        <Row gutter={16} className={cx(['gx-flex-row'])}>
          <Col xs={24} sm={12} lg={12}>
            <Form.Item dependencies={[]}>
              {({ setFieldsValue }) => {
                return (
                  <Form.Item
                    label="ครองยศ"
                    name="dominate"
                    rules={[
                      {
                        required: true,
                        message: 'กรุณาเลือกครองยศ',
                      },
                    ]}
                  >
                    <MasterSelectWidget
                      placeholder="เลือกครองยศ"
                      category="82"
                      onChange={(_, selected) => {
                        setFieldsValue({
                          dominate_abbreviation: selected.code,
                        });
                      }}
                      showSearch
                    />
                  </Form.Item>
                );
              }}
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={12}>
            <Form.Item label="ตัวย่อยศ" name="dominate_abbreviation">
              <Input readOnly />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={12}>
            <Form.Item
              label="สถานีตำรวจ"
              name="station"
              rules={[
                {
                  required: true,
                  message: 'กรุณาเลือกสถานีตำรวจ',
                },
              ]}
            >
              <MasterSelectWidget placeholder="เลือกสถานีตำรวจ" category="6" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={12}>
            <Form.Item
              label="ดำรงตำแหน่งครั้งแรก"
              name="first_position_date_time"
              // rules={[
              //   {
              //     required: true,
              //     message: "กรุณาเลือกวันที่",
              //   },
              // ]}
            >
              <DatePickerISOHoC>
                <DatePicker style={{ width: '100%' }} placeholder="เลือกวันที่" picker="date" />
              </DatePickerISOHoC>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={12}>
            <Form.Item
              label="เป็นนายตำรวจ"
              name="police_position_date_time"
              // rules={[
              //   {
              //     required: true,
              //     message: "กรุณาเลือกวันที่",
              //   },
              // ]}
            >
              <DatePickerISOHoC>
                <DatePicker style={{ width: '100%' }} placeholder="เลือกวันที่" picker="date" />
              </DatePickerISOHoC>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={12}>
            <Form.Item
              label="รับราชการ"
              name="government_date_time"
              // rules={[
              //   {
              //     required: true,
              //     message: "กรุณาเลือกวันที่",
              //   },
              // ]}
            >
              <DatePickerISOHoC>
                <DatePicker style={{ width: '100%' }} placeholder="เลือกวันที่" picker="date" />
              </DatePickerISOHoC>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={12}>
            <Form.Item
              label="เบิกลด"
              name="withdraw_money"
              // rules={[
              //   {
              //     required: true,
              //     message: "กรุณากรอกเบิกลด",
              //   },
              // ]}
            >
              <InputNumber
                className="gx-w-100"
                min={0}
                type="number"
                style={{ width: '100%' }}
                placeholder="กรอกเบิกลด"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={12}>
            <Form.Item
              label="เงินประจำตำแหน่ง"
              name="position_allowance"
              // rules={[
              //   {
              //     required: true,
              //     message: "กรุณากรอกเงินประจำตำแหน่ง",
              //   },
              // ]}
            >
              <InputNumber
                className="gx-w-100"
                min={0}
                type="number"
                style={{ width: '100%' }}
                placeholder="กรอกเงินประจำตำแหน่ง"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={12}>
            <Form.Item
              label="เงินเพิ่มพิเศษสำหรับการสู้รบ"
              name="extra_battle_money"
              // rules={[
              //   {
              //     required: true,
              //     message: "กรุณากรอกเงินเพิ่มพิเศษสำหรับการสู้รบ",
              //   },
              // ]}
            >
              <InputNumber
                min={0}
                type="number"
                style={{ width: '100%' }}
                placeholder="กรอกเงินเพิ่มพิเศษสำหรับการสู้รบ"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={12}>
            <Form.Item
              label="เงินเพิ่มพิเศษสำหรับปราบปรามผู้กระทำความผิด"
              name="offenders_additional_money"
              // rules={[
              //   {
              //     required: true,
              //     message: "กรุณากรอกเงินเพิ่มพิเศษสำหรับปราบปรามผู้กระทำความผิด",
              //   },
              // ]}
            >
              <InputNumber
                className="gx-w-100"
                min={0}
                type="number"
                style={{ width: '100%' }}
                placeholder="กรอกเงินเพิ่มพิเศษสำหรับปราบปรามผู้กระทำความผิด"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} lg={24}>
            <Form.Item
              label="หมายเหตุ"
              name="note"
              // rules={[
              //   {
              //     required: true,
              //     message: "กรุณากรอกหมายเหตุ",
              //   },
              // ]}
            >
              <Input placeholder="กรอกหมายเหตุ" className="gx-w-100" />
            </Form.Item>
          </Col>
        </Row>
      </Col>
      {screens.lg ? (
        <Col
          sm={1}
          lg={1}
          className={cx([
            'gx-p-0 gx-h-100',
            css`
              display: flex;
              justify-content: center;
            `,
          ])}
        >
          <Divider
            type="vertical"
            className={css`
              height: calc(100% + 37px);
              top: -18px;
              margin: 0;
            `}
          />
        </Col>
      ) : null}
      <Col
        sm={24}
        lg={9}
        className={css`
          overflow-x: scroll;
        `}
      >
        <Typography.Title level={5}>แผนผังองค์กร</Typography.Title>
        <Form.Item noStyle shouldUpdate>
          {({ getFieldsValue, resetFields }) => {
            return <OrganizationTree manager={manager} value={getFieldsValue()} onNavigate={resetFields} />;
          }}
        </Form.Item>
      </Col>
    </RowFixed>
  );
}

function PersonnalInformationTab(props) {
  const { form } = props;
  return (
    <>
      <RowFixed>
        <Col span={12}>
          <Form.Item
            label="วันเดือนปีเกิด"
            name="date_of_birth"
            rules={[
              {
                required: true,
                message: 'กรุณาเลือกวันเดือนปีเกิด',
              },
            ]}
          >
            <DatePickerISOHoC>
              <DatePicker
                style={{ width: '100%' }}
                placeholder="เลือกวันเกิด"
                picker="date"
                defaultPickerValue={moment().subtract(18, 'years')}
              />
            </DatePickerISOHoC>
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item shouldUpdate label="อายุ">
            {({ getFieldValue }) => {
              const date = getFieldValue('date_of_birth');
              return (
                <InputNumber
                  className="gx-w-100"
                  type="number"
                  min={0}
                  readOnly
                  style={{ width: '100%' }}
                  placeholder="กรุณาเลือกวันที่เพื่อคำนวณอายุ"
                  value={date ? moment().diff(moment(date), 'years') : ''}
                />
              );
            }}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="เพศ"
            name="gender"
            rules={[
              {
                required: true,
                message: 'กรุณาเลือกเพศ',
              },
            ]}
          >
            <MasterSelectWidget placeholder="เลือกเพศ" category="30" />
          </Form.Item>
        </Col>
        <PlaceLocalWidget
          form={form}
          level={1}
          fieldProp={{
            province: {
              name: 'domicile',
              label: 'ภูมิลำเนา',
              required: false,
            },
          }}
          className="gx-full-width"
        />
        <Col span={16}>
          <Form.Item label="คุณวุฒิ" name="qualification">
            <Input placeholder="กรอกคุณวุฒิ" />
          </Form.Item>
        </Col>
      </RowFixed>
    </>
  );
}

const PersonnelBasicForm = (props) => {
  const { form, personnel } = props;
  const [organizationId, setOrganizationId] = useState('');

  const manager = useService(serviceWrapper(PersonnelService.getManagerById), () => {
    if (!personnel) return;
    return {
      params: {
        personnel_id: personnel._id,
      },
    };
  });

  const hasUser = _.get(personnel, 'has_user', false);

  const randomPassword = password.randomPassword({
    length: 8,
    characters: [password.lower, password.upper, password.digits, password.symbols],
  });

  useEffect(() => {
    if (!personnel) return;
    form.setFieldsValue(personnel);
  }, [personnel, form]);

  return (
    <>
      <Form
        name="basic"
        layout="vertical"
        initialValues={{
          remember: true,
        }}
        // onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <RowFixed>
          <Col xs={24} sm={5}>
            <BoxRoute onClick={() => console.log('onclick')} style={{ height: '100%', width: '100%' }}>
              <IconCustom component={PersonelIcon} style={{ fontSize: '42px' }} />
              <Typography.Text className="gx-text-center">อัปโหลดรูปภาพ</Typography.Text>
            </BoxRoute>
          </Col>
          <Col xs={24} sm={19}>
            <Typography.Title level={5}>ข้อมูล</Typography.Title>
            <RowFixed>
              <Col sm={6}>
                <Form.Item rules={[{ required: true, message: '' }]} label="คำนำหน้า (TH)" name="prefixTH">
                  <Input placeholder="Auto" />
                </Form.Item>
              </Col>
              <Col sm={9}>
                <Form.Item rules={[{ required: true, message: '' }]} label="ชื่อ (TH)" name="firstNameTH">
                  <Input placeholder="Auto" />
                </Form.Item>
              </Col>
              <Col sm={9}>
                <Form.Item rules={[{ required: true, message: '' }]} label="นามสกุล (TH)" name="lastNameTH">
                  <Input placeholder="Auto" />
                </Form.Item>
              </Col>
              <Col sm={6}>
                <Form.Item rules={[{ required: true, message: '' }]} label="คำนำหน้า (EN)" name="prefixEN">
                  <Input placeholder="Auto" />
                </Form.Item>
              </Col>
              <Col sm={9}>
                <Form.Item rules={[{ required: true, message: '' }]} label="ชื่อ (EN)" name="firstNameEN">
                  <Input placeholder="Auto" />
                </Form.Item>
              </Col>
              <Col sm={9}>
                <Form.Item rules={[{ required: true, message: '' }]} label="นามสกุล (EN)" name="lastNameEN">
                  <Input placeholder="Auto" />
                </Form.Item>
              </Col>
            </RowFixed>
          </Col>
        </RowFixed>
        <RowFixed margintop={20}>
          <Col sm={8}>
            <Form.Item
              label="บัตรประจำตัวประชาขน"
              name="idCard"
              rules={[
                {
                  required: true,
                  message: 'Please input your username!',
                },
              ]}
            >
              <Input placeholder="Auto" />
            </Form.Item>
          </Col>
          <Col sm={6}>
            <Form.Item label="วันเดือนปีเกิด" name="birthDate">
              <Input placeholder="Auto" />
            </Form.Item>
          </Col>
          <Col sm={3}>
            <Form.Item label="อายุ" name="age">
              <Input placeholder="Auto" />
            </Form.Item>
          </Col>
          <Col sm={7}>
            <Form.Item label="เพศ" name="gender">
              <Input placeholder="Auto" />
            </Form.Item>
          </Col>
          <Col sm={17}>
            <Form.Item label="ที่อยู่" name="address">
              <Input placeholder="Auto" />
            </Form.Item>
          </Col>
          <Col sm={7}>
            <Form.Item label="เบอร์โทร" name="phoneNumber">
              <Input placeholder="Auto" />
            </Form.Item>
          </Col>
          <Col sm={8}>
            <Form.Item label="อีเมล" name="email">
              <Input placeholder="Auto" />
            </Form.Item>
          </Col>
          <Col sm={8}>
            <Form.Item label="ตั้งรหัสผ่าน" name="password">
              <Input placeholder="Auto" />
            </Form.Item>
          </Col>
          <Col sm={8}>
            <Form.Item label="กรอกรหัสผ่านอีกครั้ง" name="confirmPassword">
              <Input placeholder="Auto" />
            </Form.Item>
          </Col>
        </RowFixed>
      </Form>
    </>
  );
};

export default PersonnelBasicForm;
