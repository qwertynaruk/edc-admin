import { Space, Typography } from 'antd';

export function SpParagraph({ title = '', children = null, layout = 'horizontal' }) {
  return (
    <Space direction={layout}>
      <Typography.Text strong style={{ fontSize: 14 }}>
        {title} {layout === 'horizontal' ? ':' : ''}
      </Typography.Text>
      <Typography.Text style={{ fontSize: 14, fontWeight: 'lighter' }}>{children}</Typography.Text>
    </Space>
  );
}
