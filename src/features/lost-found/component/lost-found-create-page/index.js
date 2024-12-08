import { Button, Card, Checkbox, Col, DatePicker, Form, Input, Row } from 'antd';
import {
  SpBreadCrumb,
  SpCard,
  SpSelectItemBrand,
  SpSelectItemColor,
  SpSelectItemModel,
  SpSelectItemType,
  useSpSelectItemBrand,
  useSpSelectItemColor,
  useSpSelectItemModel,
  useSpSelectItemType,
  useSpSelectStatusLostFound,
} from 'features/shared';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import DialogNotification from 'components/shared-components/DialogNotification';
import { ItemsBox } from '../items-box';
import { LostFoundRelateItems } from '../lost-found-relate-items';
import { LostFoundUploadImage } from '../lost-found-upload-image';
import { useCreateLostFound } from 'features/lost-found/hooks';

export function LostFoundCreateItemsPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const locations = useLocation();
  const { lookup: itemsBrand } = useSpSelectItemBrand();
  const { lookup: itemsModel } = useSpSelectItemModel();
  const { lookup: itemsColor } = useSpSelectItemColor();
  const { lookup: itemsType } = useSpSelectItemType();
  const { data: lfStatus } = useSpSelectStatusLostFound();

  const [fileList, setFileList] = useState([]);
  const [formPreview, setFormPreview] = useState(null);

  const { mutate, isPending } = useCreateLostFound({
    onSuccess: () => {
      navigate('/app/lost-found-management');
      DialogNotification('success', 'สร้างรายการสำเร็จ');
    },
    onError: () => {
      DialogNotification('error', 'ไม่สามารถทำรายการได้');
    },
  });

  const goBack = () => {
    navigate(locations.pathname.replace('/create', ''));
  };

  const tranformPayload = (values = undefined) => {
    const payload = {
      found_date: values?.item_created_date,
      item_name: values?.item_name || '-',
      item_type: itemsType(values?.item_type),
      item_description: values?.item_description || '-',
      item_photos: fileList.length > 0 ? fileList.map((ss) => ss.url) : [],
      item_brand: itemsBrand(values?.item_brand),
      item_model: itemsModel(values?.item_model),
      item_color: itemsColor(values?.item_color),
      status: lfStatus?.find((ss) => ss.label_en === 'Open'),
      founder: {
        full_name: values?.item_founder || '-',
        phone_number: values?.item_founder_phonenumber || '-',
      },
      additional_fields: {
        ref_id: values?.ref_id || '-',
        is_preregister: values?.is_preregister || false,
        owner_name: values?.owner_name || '-',
      },
    };

    return payload;
  };

  const onSubmitForm = (values) => {
    const payload = tranformPayload(values);
    mutate(payload);
  };

  const onChangeForm = () => {
    const formValue = form.getFieldsValue();
    const payload = tranformPayload(formValue);
    setFormPreview(payload);
  };

  useEffect(() => {
    const refId = 'LF' + Date.now();
    form.setFieldsValue({ ref_id: refId });
    setFormPreview({ additional_fields: { ref_id: refId } });
  }, []);

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24}>
        <SpBreadCrumb pageName="สร้างรายการ" />
      </Col>

      <Col xs={24} md={18}>
        <SpCard
          title="Add Lost & Found"
          footer={[
            <Button loading={isPending} key="cancel" type="primary" onClick={goBack}>
              ยกเลิก
            </Button>,
            <Button loading={isPending} key="submit" onClick={() => form.submit()}>
              บันทึก
            </Button>,
          ]}
        >
          <Form form={form} layout="vertical" onFinish={onSubmitForm} onValuesChange={onChangeForm}>
            <Row gutter={[6, 6]} style={{ flexDirection: 'row' }}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item name="ref_id" label="#REF ID">
                  <Input readOnly />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item name="item_created_date" label="วันเวลาที่สร้างไอเท็ม">
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item name="item_created_at" label="ผู้สร้างไอเท็ม">
                  <Input placeholder="เลือกผู้สร้างไอเท็ม" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={16}>
                <Form.Item
                  name="item_type"
                  label="ประเภทไอเท็ม"
                  rules={[{ required: true, message: 'กรุณาเลือกประเภทไอเท็ม' }]}
                >
                  <SpSelectItemType />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item name="item_name" label="ชื่อไอเท็ม">
                  <Input placeholder="เลือกผู้สร้างไอเท็ม" />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <LostFoundUploadImage onChange={setFileList} />
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item name="item_brand" label="แบรนด์">
                  <SpSelectItemBrand />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item name="item_model" label="โมเดล">
                  <SpSelectItemModel />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item name="item_color" label="สี">
                  <SpSelectItemColor />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item name="item_description" label="รายละเอียด">
                  <Input.TextArea placeholder="กรอกรายละเอียด" />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item name="owner_name" label="ชื่อเจ้าของ">
                  <Input placeholder="กรอกชื่อเจ้าของ" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={16}>
                <Form.Item name="item_founder" label="ชื่อผู้พบ">
                  <Input placeholder="กรอกชื่อผู้พบ" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item name="item_founder_phonenumber" label="เบอร์ติดต่อ (ผู้พบ)">
                  <Input placeholder="กรอกชื่อเจ้าของ" />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item name="is_preregister" label="" valuePropName="checked">
                  <Checkbox>สินทรัพย์ลงทะเบียนแล้ว</Checkbox>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </SpCard>
      </Col>

      <Col xs={24} md={6}>
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Card title="ตัวอย่าง" style={{ marginBottom: 0 }}>
              <ItemsBox mode="liveview" items={formPreview} />
            </Card>
          </Col>
          <Col xs={24}>
            <Card title="รายการที่เกี่ยวข้อง" bodyStyle={{ padding: 0 }}>
              <LostFoundRelateItems />
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
