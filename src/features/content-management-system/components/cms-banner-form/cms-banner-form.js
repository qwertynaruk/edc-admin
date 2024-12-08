import { Col, Form, Input, Row, Select } from 'antd';

import { Ckeditor } from 'components/shared-components/ckeditor';
import { ImageBannerUpload } from 'components/shared-components/image-banner-upload';
import { PROVINCE_LIST } from '../../constants';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export const CmsBannerForm = ({ form }) => {
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();

  const type = Form.useWatch('banner_type', form);

  useEffect(() => {
    if (urlSearchParams.get('type') !== type) {
      setUrlSearchParams({
        type,
      });
    }
  }, [type]);

  return (
    <Row>
      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
        <Form layout="vertical" form={form}>
          <Form.Item name="banner_image_url" rules={[{ required: true, message: 'กรุณาอัพโหลดรูปภาพ' }]}>
            <ImageBannerUpload module="cms" group="banner" />
          </Form.Item>
        </Form>
      </Col>
      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            banner_type: 'content',
          }}
        >
          <Form.Item
            label="ประเภทแบนเนอร์"
            name="banner_type"
            rules={[{ required: true, message: 'กรุณาเลือกประเภทแบนเนอร์' }]}
          >
            <Select>
              <Select.Option value="content">สร้างเนื้อหา</Select.Option>
              <Select.Option value="link">สร้างลิงค์</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="ชื่อแบนเนอร์" name="name" rules={[{ required: true, message: 'กรุณากรอกชื่อแบนเนอร์' }]}>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Col>
      <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
        <Form layout="vertical" form={form}>
          <Form.Item
            label="พื้นที่เผยแพร่แบนเนอร์"
            name="province_list"
            rules={[{ required: true, message: 'กรุณาเลือกพื้นที่เผยแพร่แบนเนอร์' }]}
          >
            <Select>
              <>
                {PROVINCE_LIST.map((province) => (
                  <Select.Option key={province.name_en} value={province.name_en}>
                    {province.name_th}
                  </Select.Option>
                ))}
              </>
            </Select>
          </Form.Item>
          {type === 'content' && (
            <Form.Item label="เนื้อหา" name="detail" rules={[{ required: true, message: 'กรุณากรอกเนื้อหา' }]}>
              <Ckeditor />
            </Form.Item>
          )}
          {type === 'link' && (
            <Form.Item
              label="URL"
              name="url"
              rules={[
                { required: true, message: 'กรุณากรอก URL' },
                {
                  // pattern: new RegExp(/^(http|https):\/\/[^ "]+$/),
                  pattern: /^(http|https):\/\/[^ "]+$/,
                  message: 'กรุณากรอก URL ให้ถูกต้อง',
                },
              ]}
            >
              <Input />
            </Form.Item>
          )}
        </Form>
      </Col>
    </Row>
  );
};
