import { Space, Typography } from 'antd';

const { Paragraph, Text } = Typography;

const PropertyDrug = ({ tForm }) => {
  return (
    <Space direction="vertical">
      <Space size={40}>
        <Paragraph>
          <Text className="gx-mr-1 gx-text-level-0">ประเภททรัพย์สิน :</Text>
          <Text>{tForm.type}</Text>
        </Paragraph>

        <Paragraph>
          <Text className="gx-mr-1 gx-text-level-0">หมวดหมู่ยาเสพติด :</Text>
          <Text>{tForm.drugCategory}</Text>
        </Paragraph>
      </Space>

      <Paragraph>
        <Text className="gx-mr-1 gx-text-level-0">จำนวน :</Text>
        <Text>{tForm.quantity}</Text>
      </Paragraph>
    </Space>
  );
};

export default PropertyDrug;
