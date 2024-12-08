import { Space, Typography } from 'antd';

const { Paragraph, Text } = Typography;

const PropertyGun = ({ tForm }) => {
  return (
    <Space direction="vertical">
      <Space size={40}>
        <Paragraph>
          <Text className="gx-mr-1 gx-text-level-0">ประเภททรัพย์สิน :</Text>
          <Text>{tForm.type}</Text>
        </Paragraph>

        <Paragraph>
          <Text className="gx-mr-1 gx-text-level-0">หมายเลขซีเรียล :</Text>
          <Text>{tForm.serialNumber}</Text>
        </Paragraph>
      </Space>

      <Space size={40}>
        <Paragraph>
          <Text className="gx-mr-1 gx-text-level-0">ยี่ห้อ :</Text>
          <Text>{tForm.brand}</Text>
        </Paragraph>

        <Paragraph>
          <Text className="gx-mr-1 gx-text-level-0">รุ่น :</Text>
          <Text>{tForm.model}</Text>
        </Paragraph>
      </Space>
    </Space>
  );
};

export default PropertyGun;
