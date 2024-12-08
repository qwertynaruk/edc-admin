import { Card, List, Typography } from 'antd';

import styled from '@emotion/styled';

const ListItemComponents = styled(List.Item)((props) => ({
  borderBottomColor: '#000 !important',
  cursor: 'pointer',
  transition: '0.5s all ease',
  ':hover': { textShadow: '0 0 5px #000' },
  pointerEvents: props?.disabled ? 'none' : 'auto',
}));

export function ProfilesSecurity() {
  const datas = [
    {
      title: 'เปลี่ยนรหัสผ่าน',
      descriptions: 'เปลี่ยนแปลงล่าสุด 19 ก.ย. 2566',
      disabled: false,
    },
    {
      title: 'การยืนยันแบบ 2 ขั้นตอน',
      descriptions: 'เร็วๆ นี้',
      disabled: true,
    },
    {
      title: 'อุปกรณ์ที่ลงชื่อใช้งาน',
      descriptions: '1 อุปกรณ์',
      disabled: true,
    },
  ];
  return (
    <div style={{ padding: 15 }}>
      <Card bodyStyle={{ padding: 0 }} style={{ borderColor: '#000' }}>
        <List
          itemLayout="vertical"
          dataSource={datas}
          renderItem={(items, index) => (
            <ListItemComponents key={index} disabled={items?.disabled}>
              <List.Item.Meta
                style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 10 }}
                title={<Typography.Title level={5}>{items.title}</Typography.Title>}
                description={<Typography.Text style={{ color: '#ffffff60' }}>{items.descriptions}</Typography.Text>}
              />
            </ListItemComponents>
          )}
        />
      </Card>
    </div>
  );
}
