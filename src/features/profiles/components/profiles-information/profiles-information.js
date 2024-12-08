import { Button, Card, Col, Descriptions, Row, Space, Typography } from 'antd';
import { useMemo, useState } from 'react';

import { BUCKETNAME_SOS } from 'constants/SOSConstant';
import { EditOutlined } from '@ant-design/icons';
import { ProfilesAuthenModal } from '../profiles-authen-modal';
import { ProfilesInformationModal } from '../profiles-information-modal';
import { ProfilesUploader } from '../profiles-uploader';
import dayjs from 'dayjs';
import styled from '@emotion/styled';
import { useGetGenders } from 'features/personnel';
import { useGetUsers } from 'features/profiles/hooks';

const CardProps = {
  style: {
    borderColor: '#000',
    marginBottom: 0,
  },
  headStyle: { borderColor: '#000' },
};

const DescriptionComponent = styled(Descriptions)({
  '.ant-descriptions-item-label': {
    color: '#fff',
    '&::after': {
      display: 'none',
    },
  },
  '.ant-descriptions-item-content': {
    color: '#fff',
    opacity: 0.8,
  },
  'th.ant-descriptions-item': {
    paddingBottom: 8,
  },
});

export function ProfilesInformation() {
  const { data } = useGetUsers();
  const [openA, setOpenA] = useState(false);
  const [openB, setOpenB] = useState(false);

  const { myGenders } = useGetGenders();

  const fullName = useMemo(() => {
    if (data?.user) {
      const prefixName = data?.user?.prefix_name || undefined;
      const firstName = data?.user?.first_name || undefined;
      const lastName = data?.user?.last_name || undefined;
      return [prefixName, firstName, lastName].filter((ss) => ss).join(' ');
    }

    return 'Hero';
  }, [data]);

  const EditButton = ({ onClick }) => {
    return (
      <div style={{ padding: '0px 12px' }}>
        <Button icon={<EditOutlined />} type="primary" onClick={onClick}>
          Edit
        </Button>
      </div>
    );
  };

  return (
    <div style={{ width: '100%', padding: 10, gap: 10, display: 'flex', flexDirection: 'column' }}>
      <Card {...CardProps}>
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={10} lg={5}>
            <ProfilesUploader sources={BUCKETNAME_SOS[0]} self={data?.user} />
          </Col>
          <Col xs={24} sm={14} lg={19}>
            <Space direction="vertical">
              <Typography.Title level={4}>{fullName}</Typography.Title>
              <Typography.Text style={{ textTransform: 'capitalize', fontSize: 16 }}>
                <span style={{ opacity: 0.6 }}>{data?.user?.organization}</span>
              </Typography.Text>
              <Typography.Text style={{ textTransform: 'capitalize', fontSize: 16 }}>
                <span style={{ opacity: 0.6 }}>{data?.user?.role}</span>
              </Typography.Text>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card {...CardProps} title="ข้อมูลผู้ใช้งาน" extra={<EditButton onClick={() => setOpenA(true)} />}>
        <DescriptionComponent column={{ xs: 1, sm: 2, lg: 4 }} layout="vertical">
          <Descriptions.Item label="คำนำหน้า (TH)">{data?.user?.prefix_name_th || '-'}</Descriptions.Item>
          <Descriptions.Item label="ชื่อ (TH)">{data?.user?.first_name_th || '-'}</Descriptions.Item>
          <Descriptions.Item span={2} label="นามสกุล (TH)">
            {data?.user?.last_name_th || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="คำนำหน้า (EN)">{data?.user?.prefix_name_en || '-'}</Descriptions.Item>
          <Descriptions.Item label="ชื่อ (EN)">{data?.user?.first_name_en || '-'}</Descriptions.Item>
          <Descriptions.Item span={2} label="นามสกุล (EN)">
            {data?.user?.last_name_en || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="บัตรประจำตัวประชาชน">{data?.user?.person_card_id || '-'}</Descriptions.Item>
          <Descriptions.Item label="เพศ">{myGenders(data?.user?.gender)}</Descriptions.Item>
          <Descriptions.Item label="วันเดือนปีเกิด">
            {dayjs(data?.user?.birth_day).format('DD MMM YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label="อายุ">{data?.user?.age || '-'}</Descriptions.Item>
          <Descriptions.Item span={4} label="ที่อยู่">
            {data?.user?.address || '-'}
          </Descriptions.Item>
        </DescriptionComponent>
      </Card>

      <Card {...CardProps} title="ข้อมูลเข้าสู่ระบบ" extra={<EditButton onClick={() => setOpenB(true)} />}>
        <DescriptionComponent column={2} layout="vertical">
          <Descriptions.Item label="เบอร์โทร">{data?.user?.phone_number || '-'}</Descriptions.Item>
          <Descriptions.Item label="อีเมล">{data?.user?.email || '-'}</Descriptions.Item>
        </DescriptionComponent>
      </Card>

      <Card {...CardProps} title="ข้อมูลองค์กร">
        <DescriptionComponent column={2} layout="vertical">
          <Descriptions.Item span={2} label="องค์กร">
            {data?.organizations?.organization || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="ฝ่ายงาน">{data?.department?.name_th || '-'}</Descriptions.Item>
          <Descriptions.Item label="ตำแหน่ง">{data?.position?.name_th || '-'}</Descriptions.Item>
        </DescriptionComponent>
      </Card>

      <ProfilesInformationModal items={data?.user} open={openA} setOpen={setOpenA} />
      <ProfilesAuthenModal items={data?.user} open={openB} setOpen={setOpenB} />
    </div>
  );
}
