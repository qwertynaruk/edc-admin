import { Empty, Typography } from 'antd';

const EMPTY_DOM = (
  <Empty description={<Typography.Text strong>ไม่พบรายการ</Typography.Text>} style={{ opacity: 0.4 }} />
);

export default {
  byLocale: { emptyText: EMPTY_DOM },
  default: EMPTY_DOM,
};
