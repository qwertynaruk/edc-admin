import { Space, Typography } from 'antd';

const { Paragraph, Text } = Typography;

const Personel = ({ tForm }) => {
  return (
    <Space direction="vertical">
      <Paragraph>
        <Text className="gx-mr-1 gx-text-level-0">ชื่อนามสกุล :</Text>
        <Text>{tForm.name}</Text>
      </Paragraph>

      <Space size={40}>
        <Paragraph>
          <Text className="gx-mr-1 gx-text-level-0">เพศ :</Text>
          <Text>{tForm.gender}</Text>
        </Paragraph>

        <Paragraph>
          <Text className="gx-mr-1 gx-text-level-0">อายุ :</Text>
          <Text>{tForm.age}</Text>
          <Text className="gx-ml-1 gx-text-level-0">ปี</Text>
        </Paragraph>
      </Space>

      <Paragraph>
        <Text className="gx-mr-1 gx-text-level-0">บัตรประจำตัวประชาชน :</Text>
        <Text>{tForm.idcard}</Text>
      </Paragraph>
    </Space>
  );
};

export default Personel;
