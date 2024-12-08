import { CloseCircleOutlined } from '@ant-design/icons';
import { Card as AntCard, Space } from 'antd';
import LabsContentEmpty from 'components/layout-components/LabsContentEmpty';
import styled from '@emotion/styled';

const Card = styled(AntCard)`
  min-height: calc(100vh - 136px);
  height: auto;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
`;

const RouterErrorElement = () => {
  return (
    <Card>
      <LabsContentEmpty>
        <Space direction="vertical">
          <CloseCircleOutlined style={{ fontSize: '3rem' }} />
          มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง
        </Space>
      </LabsContentEmpty>
    </Card>
  );
};

export default RouterErrorElement;
