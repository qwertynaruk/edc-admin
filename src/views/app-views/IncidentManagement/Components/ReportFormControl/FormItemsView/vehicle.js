import { Space, Typography } from 'antd';

const { Paragraph, Text } = Typography;

const Vehicle = ({ tForm }) => {
  return (
    <Space direction="vertical">
      <Paragraph>
        <Text className="gx-mr-1 gx-text-level-0">ทะเบียนรถ :</Text>
        <Text>{tForm.registration}</Text>
      </Paragraph>

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

      <Paragraph>
        <Text className="gx-mr-1 gx-text-level-0">ประเภทยานพาหนะ :</Text>
        <Text>{tForm.vehicleType}</Text>
      </Paragraph>
    </Space>
  );
};

export default Vehicle;
