import { Button, Card, Col, Divider, Form, Image, Radio, Row, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import AccountService from 'services/AccountService';
import DialogNotification from 'components/shared-components/DialogNotification';
import Guarded from 'components/shared-components/Guarded';
import LabelShowText from 'components/shared-components/LabelShowText';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import _ from 'lodash';
import { observer } from 'mobx-react';
import produce from 'immer';
import usePopup from 'hooks/usePopup';
import useService from 'hooks/useService';

const PeopleDetail = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { data: person = {}, loading, mutate } = useService(AccountService.peopleDetail, { params: { _id: id } });
  const [state, setState] = useState({
    actionLoading: false,
  });
  const [formChange, setFormChange] = useState(false);
  const [fire] = usePopup({
    onConfirm: () => navigate(-1),
  });

  const onCancel = () => {
    if (formChange) {
      // if (form.isFieldTouched()) {
      return fire();
    }
    navigate(-1);
  };

  const onSubmit = (values) => {
    setState(
      produce((draft) => {
        draft.actionLoading = true;
      })
    );
    AccountService.peopleUpdate({ params: { _id: id }, data: values })
      .call()
      .then(() => {
        DialogNotification('success', 'แก้ไขข้อมูลสำเร็จ');
        mutate();
      })
      .catch(() => {
        DialogNotification('error', 'แก้ไขข้อมูลไม่สำเร็จ');
      })
      .finally(() => {
        setState(
          produce((draft) => {
            draft.actionLoading = false;
          })
        );
      });
  };

  useEffect(() => {
    if (person) {
      form.setFieldsValue(person);
    }
  }, [form, person]);

  return (
    <Form form={form} layout="vertical" onFinish={onSubmit} onValuesChange={() => setFormChange(true)}>
      <PageBreadcrumb pageLabel={{ master: 'ตั้งค่าผู้ใช้งาน', subpath: 'เรียกดูผู้ใช้งาน' }} />
      <Card loading={loading}>
        <Row gutter={[16, 16]} className="gx-flex-row">
          <Col span={4}>
            <Image
              style={{ width: '100%', height: 'auto' }}
              src={person.profile || ''}
              preview={false}
              fallback="/img/thumb-avatar/personel.png"
            />
          </Col>
          <Col span={20}>
            <Row className="gx-flex-row">
              <Col span={24} style={{ marginBottom: '1rem' }}>
                <Typography.Text strong>ข้อมูลผู้ใช้งาน</Typography.Text>
              </Col>
              <Col span={24}>
                <Space>
                  <LabelShowText labelText="เบอร์โทรศัพท์" value={person.phone_number} />
                  <LabelShowText labelText="อีเมล" value={person.email} />
                </Space>
              </Col>
              <Col span={24}>
                <Space direction="vertical">
                  <Form.Item label="สถานะปัจจุบัน" name="is_active">
                    <Radio.Group defaultValue={true} className="gx-mb-2">
                      <Radio value={true}>ใช้งาน</Radio>
                      <Radio value={false}>ระงับการใช้งาน</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Space>
              </Col>
              {/* <Col span={12}>
                <Form.Item name="patrol_name" label="ตู้จุดตรวจที่เกี่ยวข้อง">
                  <Select placeholder="เลือกตู้จุดตรวจ">
                    <Select.Option value="ตู้จุดตรวจที่ 1">ตู้จุดตรวจที่ 1</Select.Option>
                    <Select.Option value="ตู้จุดตรวจที่ 2">ตู้จุดตรวจที่ 2</Select.Option>
                    <Select.Option value="ตู้จุดตรวจที่ 3">ตู้จุดตรวจที่ 3</Select.Option>
                    <Select.Option value="ตู้จุดตรวจที่ 4">ตู้จุดตรวจที่ 4</Select.Option>
                    <Select.Option value="ตู้จุดตรวจที่ 5">ตู้จุดตรวจที่ 5</Select.Option>
                    <Select.Option value="ตู้จุดตรวจที่ 6">ตู้จุดตรวจที่ 6</Select.Option>
                    <Select.Option value="ตู้จุดตรวจที่ 7">ตู้จุดตรวจที่ 7</Select.Option>
                    <Select.Option value="ตู้จุดตรวจที่ 8">ตู้จุดตรวจที่ 8</Select.Option>
                    <Select.Option value="ตู้จุดตรวจที่ 9">ตู้จุดตรวจที่ 9</Select.Option>
                    <Select.Option value="ตู้จุดตรวจที่ 10">ตู้จุดตรวจที่ 10</Select.Option>
                    <Select.Option value="ตู้จุดตรวจที่ 11">ตู้จุดตรวจที่ 11</Select.Option>
                    <Select.Option value="ตู้จุดตรวจที่ 12">ตู้จุดตรวจที่ 12</Select.Option>
                    <Select.Option value="ตู้จุดตรวจที่ 13">ตู้จุดตรวจที่ 13</Select.Option>
                    <Select.Option value="ตู้จุดตรวจที่ 14">ตู้จุดตรวจที่ 14</Select.Option>
                    <Select.Option value="ตู้จุดตรวจที่ 15">ตู้จุดตรวจที่ 15</Select.Option>
                    <Select.Option value="ตู้จุดตรวจที่ 16">ตู้จุดตรวจที่ 16</Select.Option>
                    <Select.Option value="ตู้จุดตรวจที่ 17">ตู้จุดตรวจที่ 17</Select.Option>
                    <Select.Option value="ตู้จุดตรวจที่ 18">ตู้จุดตรวจที่ 18</Select.Option>
                    <Select.Option value="ตู้จุดตรวจที่ 19">ตู้จุดตรวจที่ 19</Select.Option>
                    <Select.Option value="ตู้จุดตรวจที่ 20">ตู้จุดตรวจที่ 20</Select.Option>
                  </Select>
                </Form.Item>
              </Col> */}
            </Row>
          </Col>
          <Col span={24}>
            <Typography.Text strong>ข้อมูลพื้นฐาน</Typography.Text>
          </Col>
          <Col span={24}>
            <LabelShowText labelText="เลขบัตรประจำตัวประชาชน" value={person.person_card_id} className="gx-mb-0" />
          </Col>
          <Col span={6}>
            <LabelShowText labelText="คำนำหน้าชื่อภาษาไทย" value={person.prefix_th} className="gx-mb-0" />
          </Col>
          <Col span={6}>
            <LabelShowText labelText="ชื่อต้นภาษาไทย" value={person.first_name_th} className="gx-mb-0" />
          </Col>
          <Col span={6}>
            <LabelShowText labelText="นามสกุลภาษาไทย" value={person.last_name_th} className="gx-mb-0" />
          </Col>
          <Col span={6}></Col>
          <Col span={6}>
            <LabelShowText labelText="คำนำหน้าชื่ออังกฤษ" value={person.prefix_eng} className="gx-mb-0" />
          </Col>
          <Col span={6}>
            <LabelShowText labelText="ชื่อต้นภาษาอังกฤษ" value={person.first_name_eng} className="gx-mb-0" />
          </Col>
          <Col span={6}>
            <LabelShowText labelText="นามสกุลภาษาอังกฤษ" value={person.last_name_eng} className="gx-mb-0" />
          </Col>
          <Col span={6}>
            <LabelShowText
              labelText="เพศ"
              value={
                ['นาง', 'นางสาว', 'ด.ญ.', 'เด็กหญิง', 'น.', 'น.ส.'].includes(_.get(person, 'prefix_th') || '-')
                  ? 'หญิง'
                  : 'ชาย'
              }
              className="gx-mb-0"
            />
          </Col>
          <Col span={6}>
            <LabelShowText labelText="ความเชื่อทางศาสนา" value={person.religion_th} className="gx-mb-0" />
          </Col>
          {/* <Col span={12}></Col> */}
          <Col span={6}>
            <LabelShowText labelText="วันเดือนปีเกิด (พ.ศ)" value={person.date_of_birth_th} className="gx-mb-0" />
          </Col>
          <Col span={6}>
            <LabelShowText labelText="วันเดือนปีเกิด (ค.ศ)" value={person.date_of_birth_eng} className="gx-mb-0" />
          </Col>
          <Col span={6}>
            <LabelShowText labelText="วันที่สมัครบัตร (พ.ศ)" value={person.date_of_issue_th} className="gx-mb-0" />
          </Col>
          <Col span={6}>
            <LabelShowText labelText="วันที่สมัครบัตร (ค.ศ)" value={person.date_of_issue_en} className="gx-mb-0" />
          </Col>
          <Col span={6}>
            <LabelShowText labelText="วันหมดอายุ (พ.ศ)" value={person.date_of_expiry_th} className="gx-mb-0" />
          </Col>
          <Col span={24} className="gx-mt-4">
            <Typography.Text strong>ที่อยู่ตามทะเบียนบ้าน</Typography.Text>
          </Col>
          <Col span={6}>
            <LabelShowText labelText="เลขที่" value={person.address_th} className="gx-mb-0" />
          </Col>
          <Col span={6}>
            <LabelShowText labelText="หมู่ที่" value={'-'} className="gx-mb-0" />
          </Col>
          <Col span={6}>
            <LabelShowText labelText="ซอย" value={'-'} className="gx-mb-0" />
          </Col>
          <Col span={6}>
            <LabelShowText labelText="ตรอก" value={'-'} className="gx-mb-0" />
          </Col>
          <Col span={6}>
            <LabelShowText labelText="ถนน" value={'-'} className="gx-mb-0" />
          </Col>
          <Col span={6}>
            <LabelShowText labelText="แยก (1)" value={'-'} className="gx-mb-0" />
          </Col>
          <Col span={6}>
            <LabelShowText labelText="แยก (2)" value={'-'} className="gx-mb-0" />
          </Col>
          <Col span={6}>
            <LabelShowText labelText="ตำบล/แขวง" value={person.sub_district_th} className="gx-mb-0" />
          </Col>
          <Col span={6}>
            <LabelShowText labelText="อำเภอ/เขต" value={person.district_th} className="gx-mb-0" />
          </Col>
          <Col span={6}>
            <LabelShowText labelText="จังหวัด" value={person.province_th} className="gx-mb-0" />
          </Col>
          <Col span={6}>
            <LabelShowText labelText="รหัสไปรษณีย์" value={'-'} className="gx-mb-0" />
          </Col>
          {/* <Col span={24} className="gx-mt-4">
            <Typography.Text strong>ที่อยู่ปัจจุบัน</Typography.Text>
          </Col>
          <Col span={6}>
            <LabelShowText labelText="เลขที่" value={person.address_th} className="gx-mb-0" />
          </Col>
          <Col span={6}>
            <LabelShowText labelText="หมู่ที่" value={'-'} className="gx-mb-0" />
          </Col>
          <Col span={6}>
            <LabelShowText labelText="ซอย" value={'-'} className="gx-mb-0" />
          </Col>
          <Col span={6}>
            <LabelShowText labelText="ตรอก" value={'-'} className="gx-mb-0" />
          </Col>
          <Col span={6}>
            <LabelShowText labelText="ถนน" value={'-'} className="gx-mb-0" />
          </Col>
          <Col span={6}>
            <LabelShowText labelText="แยก (1)" value={'-'} className="gx-mb-0" />
          </Col>
          <Col span={6}>
            <LabelShowText labelText="แยก (2)" value={'-'} className="gx-mb-0" />
          </Col>
          <Col span={6}>
            <LabelShowText labelText="ตำบล/แขวง" value={person.sub_district_th} className="gx-mb-0" />
          </Col>
          <Col span={6}>
            <LabelShowText labelText="อำเภอ/เขต" value={person.district_th} className="gx-mb-0" />
          </Col>
          <Col span={6}>
            <LabelShowText labelText="จังหวัด" value={person.province_th} className="gx-mb-0" />
          </Col>
          <Col span={6}>
            <LabelShowText labelText="รหัสไปรษณีย์" value={'-'} className="gx-mb-0" />
          </Col>
          <Col span={6}>
            <LabelShowText labelText="ละติจูล" value={'-'} className="gx-mb-0" />
          </Col>
          <Col span={6}>
            <LabelShowText labelText="ลองติจูล" value={'-'} className="gx-mb-0" />
          </Col> */}
        </Row>
        <Guarded query={{ group: 'System Administration', type: 'ผู้ใช้งาน', action: 'update' }}>
          <>
            <Divider />
            <Space direction="vertical" align="end">
              <Space>
                <Button onClick={onCancel}>ยกเลิก</Button>
                <Button type="primary" htmlType="submit" loading={state.actionLoading}>
                  บันทึก
                </Button>
              </Space>
            </Space>
          </>
        </Guarded>
      </Card>
    </Form>
  );
};

export default observer(PeopleDetail);
