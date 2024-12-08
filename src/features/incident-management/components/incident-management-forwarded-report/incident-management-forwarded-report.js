import 'dayjs/locale/th';

import { Card, Typography } from 'antd';

import buddhistEra from 'dayjs/plugin/buddhistEra';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(buddhistEra);

dayjs.extend(utc);
dayjs.locale('th');
export const IncidentManagementForwardedReport = ({ incidentDetail }) => {
  const createDate = incidentDetail?.created_at
    ? dayjs.utc(incidentDetail?.created_at).local().format('DD MMM BBBB HH:mm')
    : null;

  return (
    <Card title="การทำรายงานประวัติ">
      <Typography.Paragraph>{createDate ?? '-'}</Typography.Paragraph>
      <Typography.Paragraph>{`${incidentDetail?.created_by?.first_name} ${incidentDetail?.created_by?.last_name} (${
        incidentDetail?.transfer_from_org?.full_name_th ?? '-'
      })`}</Typography.Paragraph>
      <Typography.Paragraph>ส่งต่องาน : {incidentDetail?.transfer_to_org?.full_name_th ?? '-'}</Typography.Paragraph>
      <Typography.Paragraph>รายละเอียด : {incidentDetail?.reason ?? '-'}</Typography.Paragraph>
    </Card>
  );
};
