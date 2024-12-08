import { Card, Input, Typography } from 'antd';

export const PersonnelSearch = ({ search, onSearch }) => {
  return (
    <Card>
      <Typography.Title level={4}>ค้นหา</Typography.Title>
      <Input.Search placeholder="ค้นหา" value={search} onChange={(e) => onSearch(e.target.value)} />
    </Card>
  );
};
