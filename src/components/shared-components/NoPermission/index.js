import { CloseCircleOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';
import { Button, Card, Space, Typography } from 'antd';
import LabsContentEmpty from 'components/layout-components/LabsContentEmpty';

function NoPermission({ onOk, children }) {
  return (
    <Card>
      <LabsContentEmpty
        className={css`
          min-height: 70vh;
        `}
      >
        <Space direction="vertical">
          <CloseCircleOutlined style={{ fontSize: '3rem', marginBottom: 15 }} />
          {children || (
            <Typography.Title style={{ opacity: 0.5 }} level={3}>
              ไม่มีสิทธิ์การเข้าถึง
            </Typography.Title>
          )}
          <Button type="primary" onClick={onOk}>
            รับทราบ
          </Button>
        </Space>
      </LabsContentEmpty>
    </Card>
  );
}
export default NoPermission;
