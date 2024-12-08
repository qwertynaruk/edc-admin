import { Col, Row, Space, Typography, notification } from 'antd';

import { BUCKETNAME_SOS } from 'constants/SOSConstant';
import { ImageBannerUpload } from '../image-banner-upload';
import { ImageUploadIcon } from 'features/shared';
import LabelShowText from '../LabelShowText';
import _ from 'lodash';
import { useUpdatePersonnel } from 'features/personnel';

const UserBasicInformationCard = (props) => {
  const { user, fetcher } = props;

  const updatePersonnel = useUpdatePersonnel({
    personnelId: user?.personnel?._id?.$oid,
    onSuccess: () => {
      notification.success({
        message: 'สำเร็จ',
        description: 'ข้อมูลกำลังพลถูกบันทึกเรียบร้อยแล้ว',
      });
    },
  });
  const onChangeImage = async (imageUrl) => {
    try {
      if (!_.isEmpty(imageUrl)) {
        const payload = {
          prefix_name: user?.personnel?.prefix_name,
          prefix_name_en: user?.personnel?.prefix_name_en,
          prefix_name_th: user?.personnel?.prefix_name_th,
          first_name: user?.personnel?.first_name,
          first_name_en: user?.personnel?.first_name_en,
          first_name_th: user?.personnel?.first_name_th,
          last_name: user?.personnel?.last_name,
          last_name_en: user?.personnel?.last_name_en,
          last_name_th: user?.personnel?.last_name_th,
          image_url: imageUrl,
          phone_number: user?.personnel?.phone_number,
          person_card_id: user?.personnel?.person_card_id,
          email: user?.personnel?.email,
        };
        updatePersonnel.submit(payload);
      }
    } catch (error) {
      console.log('error', error);
      notification.error({
        message: 'ไม่สำเร็จ',
        description: 'ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง',
      });
    }
  };

  return (
    <Row gutter={[16, 16]} className="gx-flex-row">
      <Col span={4}>
        <ImageBannerUpload
          fetcher={fetcher}
          value={user?.image_url}
          module={BUCKETNAME_SOS[0].profile.module}
          group={BUCKETNAME_SOS[0].profile.group}
          bucketName={BUCKETNAME_SOS[0].value}
          fileName={user?._id}
          height={100}
          icon={<ImageUploadIcon />}
          onChange={onChangeImage}
        />
        {/* <Image
          style={{ width: '100%', height: 'auto' }}
          src={user?.cover_image_file || '/img/thumb-avatar/personel.png'}
          preview={false}
          fallback="/img/thumb-avatar/personel.png"
        /> */}
      </Col>
      <Col span={20}>
        <Row className="gx-flex-row">
          <Col span={24} style={{ marginBottom: '1rem' }}>
            <Typography.Text strong>ข้อมูลพื้นฐาน</Typography.Text>
          </Col>
          <Col span={24}>
            <LabelShowText labelText="สถานะปัจจุบัน" value={user.is_active ? 'ใช้งาน' : 'ไม่ได้ใช้งาน'} />
          </Col>
          <Col span={24}>
            <LabelShowText labelText="เลขประจำตัวประชาชน" value={user.person_card_id} />
          </Col>
          <Col span={24}>
            <LabelShowText labelText="อีเมลสำหรับการใช้งาน" value={user.email} />
          </Col>
          <Col span={24}>
            <LabelShowText labelText="ชื่อ" value={`${user.prefix_name} ${user.first_name} ${user.last_name}`} />
          </Col>
          <Col span={24}>
            <Space>
              <LabelShowText labelText="เบอร์โทรศัพท์" value={user.phone_number} />
            </Space>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default UserBasicInformationCard;
