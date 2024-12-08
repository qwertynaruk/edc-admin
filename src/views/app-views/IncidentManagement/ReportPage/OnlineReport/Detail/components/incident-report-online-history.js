import { Card, Timeline, Typography } from 'antd';

const EX_DATA = [
  {
    id: '6d372f13-4315-41ab-b9b4-efca300d7eaf',
    time: '6 พ.ค 2565 14:41',
    user: 'นางสาวนรุตมา แสงสุวรรณ (สภ.เมืองอ่างทอง)',
    action: 'เรียกดูข้อมูล',
    detail: '',
  },
  {
    id: '49b93a3a-6c8f-4b3b-95c8-8dfeefffeb5a',
    time: '6 พ.ค 2565 14:41',
    user: 'นางสาวนรุตมา แสงสุวรรณ (สภ.เมืองอ่างทอง)',
    action: 'ส่งต่องาน',
    detail: 'เพื่อให้หน่วยงานที่เกี่ยวข้องดำเนินการ',
  },
  {
    id: '092bfe66-cde5-4c47-b1de-f8340a00321c',
    time: '6 พ.ค 2565 14:41',
    user: 'ธนิณี จันทรพิพัฒน์(เทศบาลอ่างทอง)',
    action: 'อัปเดตข้อมูล',
    detail: '',
  },
];

export const IncidentReportOnlineHistory = () => {
  return (
    <Card title="ประวัติ">
      <Timeline>
        {EX_DATA.map((item) => (
          <Timeline.Item key={item?.id}>
            <Typography.Paragraph>{item.time}</Typography.Paragraph>
            <Typography.Paragraph>{item.user}</Typography.Paragraph>
            <Typography.Paragraph>{item.action}</Typography.Paragraph>
            <Typography.Paragraph>{item.detail}</Typography.Paragraph>
          </Timeline.Item>
        ))}
      </Timeline>
    </Card>
  );
};
