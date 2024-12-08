import { Card, Divider, Space } from 'antd';

export function SpCard(props) {
  const { children, footer = [], ...cardProps } = props;

  if (footer && footer.length > 0) {
    return (
      <Card {...cardProps} bodyStyle={{ padding: 0 }}>
        <div style={{ position: 'relative', padding: 24 }}>{children}</div>
        <Divider style={{ borderColor: '#000' }} />
        <Space style={{ padding: 24, paddingBottom: 18, paddingTop: 10, justifyContent: 'flex-end' }}>
          {footer.map((ss) => ss)}
        </Space>
      </Card>
    );
  }

  return <Card {...cardProps}>{children}</Card>;
}
