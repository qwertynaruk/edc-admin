import { Space, Typography } from 'antd';

const { Paragraph, Text } = Typography;

const Organization = ({ tForm }) => {
  return (
    <Space direction="vertical">
      <Space size={40}>
        <Paragraph>
          <Text className="gx-mr-1 gx-text-level-0">ชื่อองค์กร :</Text>
          <Text>{tForm.name}</Text>
        </Paragraph>

        <Paragraph>
          <Text className="gx-mr-1 gx-text-level-0">ประเภทองค์กร :</Text>
          <Text>{tForm.age}</Text>
        </Paragraph>
      </Space>

      <Paragraph>
        <Text className="gx-mr-1 gx-text-level-0">ที่อยู่ :</Text>
        <Text>{tForm.idcard}</Text>
      </Paragraph>
    </Space>
  );
};

export default Organization;
