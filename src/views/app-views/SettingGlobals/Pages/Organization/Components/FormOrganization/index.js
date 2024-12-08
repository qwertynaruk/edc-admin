import { Button, Col, Divider, Form, Input, Select, Typography } from 'antd';
import { FIX_FIND_REDIRECT_PATH_SUCCESS, FIX_LEVEL } from 'constants/OrganizationConstant';
import { ORGANIZATION_GROUP, ORGANIZATION_MODULE } from 'constants/FileConstant';
import { useMemo, useState } from 'react';

import AttributeService from 'services/AttributeService';
import { ImageBannerUpload } from 'components/shared-components/image-banner-upload';
import { ImageUploadIcon } from 'features/shared';
import RowFixed from 'components/shared-components/RowFixed';
import _ from 'lodash';
import env from 'utils/EnvRoute';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

const SelectCustomStyle = styled(Select)({
  '.ant-select-selection-item-remove': {
    marginTop: '0 !important',
  },
});

export default function FormOrganization({
  isOrganizationLv1 = false,
  isOrganizationLv2 = false,
  onFinish = () => undefined,
  onFinishFailed = () => undefined,
  form = null,
  isLoadingButton = false,
  error = null,
}) {
  const nameOrganization = FIX_LEVEL.ORGANIZATION?.text;
  const navigate = useNavigate();

  const [fileUpload, setfileUpload] = useState(null);
  const { data, isLoading } = AttributeService.useGetLabel();

  const optionTags = useMemo(() => {
    if (!_.isEmpty(data)) {
      return (data || []).map((item) => {
        return {
          label: item.name_th,
          value: item.name_th,
        };
      });
    }
    return [];
  }, [data]);

  return (
    <Form
      form={form}
      name="basic"
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <RowFixed>
        <Col xs={24} sm={5}>
          <Form.Item name="image_url">
            <ImageBannerUpload
              // fetcher={fetcher}
              bucketName={env?.ROOT_BUCKET_PUBLIC}
              value={data?.image_url || ''}
              onChange={(value) => {
                setfileUpload(value);
              }}
              module={ORGANIZATION_MODULE}
              group={ORGANIZATION_GROUP}
              // fileName={user?._id}
              height={100}
              icon={<ImageUploadIcon />}
              // onChange={onChangeImage}
            />
            {/* <ImageBannerUpload module="cms" group="banner" height={100} icon={<ImageUploadIcon />} /> */}
          </Form.Item>
        </Col>
        {/* <Col xs={24} sm={5}>
          <BoxRoute onClick={() => console.log('onclick')} style={{ height: '100%', width: '100%' }}>
            <IconCustom component={PersonelIcon} style={{ fontSize: '42px' }} />
            <Typography.Text className="gx-text-center">อัปโหลดรูปภาพ</Typography.Text>
          </BoxRoute>
        </Col> */}
        <Col xs={24} sm={19}>
          <Typography.Title level={5}>ชื่อ{nameOrganization}</Typography.Title>
          <RowFixed>
            <Col sm={isOrganizationLv1 && isOrganizationLv2 ? 8 : isOrganizationLv1 && !isOrganizationLv2 ? 12 : 24}>
              <Form.Item label="Organization ID" name="id">
                <Input disabled placeholder="Auto" />
              </Form.Item>
            </Col>
            {isOrganizationLv1 && (
              <Col sm={isOrganizationLv1 && isOrganizationLv2 ? 8 : isOrganizationLv1 && !isOrganizationLv2 ? 12 : 24}>
                <Form.Item label="อยู่ภายใต้หน่วยงาน" name="organization_lv1">
                  <Input disabled placeholder="อยู่ภายใต้หน่วยงาน" />
                </Form.Item>
              </Col>
            )}
            {isOrganizationLv2 && (
              <Col sm={isOrganizationLv1 && isOrganizationLv2 ? 8 : isOrganizationLv1 && !isOrganizationLv2 ? 12 : 24}>
                <Form.Item label="อยู่ภายใต้สังกัด" name="organization_lv2">
                  <Input disabled placeholder="อยู่ภายใต้สังกัด" />
                </Form.Item>
              </Col>
            )}
            <Col sm={8}>
              <Form.Item
                label="จังหวัด (TH)"
                name="full_name_th"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                  },
                ]}
              >
                <Input placeholder="กรอกจังหวัด(TH)" maxLength={255} />
              </Form.Item>
            </Col>
            <Col sm={4}>
              <Form.Item
                label="ตัวย่อ (TH)"
                name="short_name_th"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                  },
                ]}
              >
                <Input placeholder="ตัวย่อ(TH)" maxLength={155} />
              </Form.Item>
            </Col>
            <Col sm={8}>
              <Form.Item
                label="จังหวัด (EN)"
                name="full_name_en"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                  },
                ]}
              >
                <Input placeholder="กรอกจังหวัด(EN)" maxLength={255} />
              </Form.Item>
            </Col>
            <Col sm={4}>
              <Form.Item
                label="ตัวย่อ (EN)"
                name="short_name_en"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                  },
                ]}
              >
                <Input placeholder="ตัวย่อ(EN)" maxLength={155} />
              </Form.Item>
            </Col>
          </RowFixed>
        </Col>
      </RowFixed>
      <RowFixed>
        <Col sm={24} className="gx-mt-4">
          <Typography.Title level={5}>ข้อมูลติดต่อ</Typography.Title>
        </Col>
        <Col sm={16}>
          <Form.Item label="ที่อยู่" name="address">
            <Input placeholder="กรอกที่อยู่" />
          </Form.Item>
        </Col>
        <Col sm={8}>
          <Form.Item label="อีเมล" name="email">
            <Input placeholder="กรอกอีเมล" />
          </Form.Item>
        </Col>
        <Col sm={8}>
          <Form.Item label="เบอร์โทรศัพท์ (1)" name="phone_number_first">
            <Input placeholder="กรอกเบอร์โทรศัพท์ (1)" />
          </Form.Item>
        </Col>
        <Col sm={8}>
          <Form.Item label="เบอร์โทรศัพท์ (2)" name="phone_number_second">
            <Input placeholder="กรอกเบอร์โทรศัพท์ (2)" />
          </Form.Item>
        </Col>
        <Col sm={8}>
          <Form.Item label="เว็บไซต์" name="website_url">
            <Input placeholder="กรอกเว็บไซต์" />
          </Form.Item>
        </Col>
        <Col sm={24}>
          <Form.Item label="ป้ายกำกับ" name="tags">
            <SelectCustomStyle
              mode="tags"
              allowClear
              tokenSeparators={[',']}
              placeholder="กรอกป้ายกำกับ"
              loading={isLoading}
              options={optionTags}
            />
          </Form.Item>
        </Col>
        <Divider />
      </RowFixed>
      <div className="gx-text-right">
        <Button onClick={() => navigate(FIX_FIND_REDIRECT_PATH_SUCCESS)}>ยกเลิก</Button>
        <Button loading={isLoadingButton} type="primary" htmlType="submit">
          บันทึก
        </Button>
      </div>
    </Form>
  );
}
