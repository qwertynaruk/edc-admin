import { Card, Empty, Skeleton, Timeline, Typography } from 'antd';

import { checkIsvalidTime } from 'utils/DateHelper';
import { css } from '@emotion/css';
import dayjs from 'dayjs';
import { uniqBy } from 'lodash';
import { useGetIncidentManagementLog } from 'features/incident-management/api/get-incident-management';

export const IncidentManagementHistory = ({ incidentId = null }) => {
  const { data, isLoading } = useGetIncidentManagementLog(incidentId);

  const mapDataTypeWording = (item = null) => {
    if (item) {
      let text = '';
      let desc = '';
      if (item?.action === 'create') {
        text = 'สร้าง Report';
        desc = '';
      } else if (item?.action === 'read') {
        text = 'เปิดดูข้อมูล';
        desc = '';
      } else if (item?.action === 'update') {
        text = 'แก้ไขข้อมูล';
        desc = '';
      } else if (item?.action === 'delete') {
        text = 'ลบข้อมูล';
        desc = '';
      } else if (item?.action === 'transfer') {
        text = 'ส่งงานต่อ';
        desc = 'เพื่อให้หน่วยงานที่เกี่ยวข้องดำเนินการ';
      }
      return { text, desc };
    } else {
      return null;
    }
  };

  const compacts = (items = []) => {
    try {
      const groups = uniqBy(items, (ss) => dayjs(ss?.created_at).format());
      return groups;
    } catch (error) {
      return items;
    }
  };

  return (
    <>
      {(data || []).length > 0 ? (
        <Card
          title="ประวัติ"
          className={css`
            .ant-card-body {
              max-height: 500px;
              overflow-y: auto;
            }
          `}
        >
          {!isLoading ? (
            <Timeline>
              {compacts(data)?.map((item) => (
                <Timeline.Item key={item?.id}>
                  <Typography.Paragraph>
                    {item?.created_at ? checkIsvalidTime(item.created_at, 'DD MMM YYYY HH:mm:ss') : '-'}
                  </Typography.Paragraph>
                  <Typography.Paragraph>{`${item?.personnel?.prefix_name}${item?.personnel?.first_name} ${item?.personnel?.last_name}`}</Typography.Paragraph>
                  <Typography.Paragraph>{mapDataTypeWording(item)?.text}</Typography.Paragraph>
                  <Typography.Paragraph>{mapDataTypeWording(item)?.desc}</Typography.Paragraph>
                  <Typography.Paragraph>{item?.detail}</Typography.Paragraph>
                </Timeline.Item>
              ))}
            </Timeline>
          ) : (
            <Skeleton />
          )}
        </Card>
      ) : (
        <Empty />
      )}
    </>
  );
};
