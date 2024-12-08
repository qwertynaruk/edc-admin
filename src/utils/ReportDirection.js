import { LoadingOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import _ from 'lodash';
import ReportStore from 'mobx/ReportStore';
import { useState } from 'react';

const ReportDirection = ({ reportId = '', reportRecordId = '', reportTypeId = '' }) => {
  const [loading, setLoading] = useState(false);
  const onDataSelect = async () => {
    setLoading(true);
    const resp = await ReportStore.getTypesList('', true).finally(() => setLoading(false));
    const findItems = _.find(resp, (ss) => ss._id === reportTypeId);
    const groupTypeName = _.get(findItems, 'group_type');

    if (reportId && groupTypeName) {
      const mapGroupName = {
        รายงานประจำวัน: 'daily/management',
        รายงานภายในองค์กร: 'internal/management',
        รายงานการปฏิบัติหน้าที่: 'onduty/management',
        รายงานแจ้งเหตุออนไลน์: 'online/detail',
        รายงานจากเว็บฟอร์ม: 'webform/detail',
      };

      const _url = `/app/incident-management/report/${mapGroupName[groupTypeName]}/${reportId}`;
      window.open(_url, '_blank');
    }
  };

  return (
    <Typography.Text className="gx-text-danger" onClick={onDataSelect} style={{ cursor: 'pointer' }}>
      {reportRecordId} <LoadingOutlined hidden={!loading} />
    </Typography.Text>
  );
};

export default ReportDirection;
