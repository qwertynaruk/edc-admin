import { Card, Input, Typography } from 'antd';

export const IncidentManagementSearchBox = ({ searchValue, onSearchChange }) => {
  return (
    <Card>
      <Typography.Text className="">ค้นหา</Typography.Text>
      <Input.Search className="gx-mt-2" placeholder="ค้นหา" value={searchValue} onChange={onSearchChange} />
    </Card>
  );
};
