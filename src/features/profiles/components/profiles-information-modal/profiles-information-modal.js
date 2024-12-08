import { Col, DatePicker, Form, Input, InputNumber, Modal, Row, message } from 'antd';
import { PersonnelGenderSelect, PersonnelPrefixSelect, useUpdatePersonnel } from 'features/personnel';

import dayjs from 'dayjs';
import moment from 'moment';
import { pick } from 'lodash';
import { useEffect } from 'react';
import useOneforce from 'hooks/use-oneforce';

export function ProfilesInformationModal({ items, open, setOpen }) {
  const [form] = Form.useForm();
  const { validateFieldsInput } = useOneforce({ form });
  const updatePersonnel = useUpdatePersonnel({
    personnelId: items?.personnel_id,
    onSuccess: () => {
      message.success('แก้ไขข้อมูลสำเร็จ');
      setOpen(false);
    },
    onError: () => {
      message.error('ไม่สามารถแก้ไขข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
    },
  });

  const onFinish = (values) => {
    const payload = {
      ...pick(items, ['prefix_name', 'first_name', 'last_name', 'image_url', 'phone_number', 'email']),
      ...values,
    };
    updatePersonnel.submit(payload);
  };

  const onCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  useEffect(() => {
    if (open && items) {
      form.setFieldsValue({
        ...items,
        birth_day: items?.birth_day ? moment(items?.birth_day) : undefined,
      });
    }
  }, [open, items]);

  return (
    <Modal
      width={1000}
      visible={open}
      title="แก้ไขข้อมูลผู้ใช้งาน"
      okButtonProps={{
        title: 'บันทึก',
        onClick: () => form.submit(),
        loading: updatePersonnel.isLoading,
      }}
      cancelButtonProps={{
        onClick: () => onCancel(),
        loading: updatePersonnel.isLoading,
      }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row style={{ flexDirection: 'row' }}>
          <Col xs={24} sm={12} lg={4}>
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

          <Col xs={24} sm={12} lg={10}>
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

          <Col xs={24} lg={10}>
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

          <Col xs={24} sm={12} lg={4}>
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

          <Col xs={24} sm={12} lg={10}>
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

          <Col xs={24} lg={10}>
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

          <Col xs={24} lg={8}>
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
          <Col xs={24} lg={4}>
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
          <Col xs={24} lg={4}>
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
          <Col xs={24} lg={8}>
            <Form.Item label="เพศ" name="gender">
              <PersonnelGenderSelect placeholder="เลือกเพศ" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item label="ที่อยู่" name="address" style={{ marginBottom: 0 }}>
              <Input placeholder="กรอกที่อยู่" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
