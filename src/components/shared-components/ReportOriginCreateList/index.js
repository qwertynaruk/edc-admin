import { Menu } from 'antd';
import _ from 'lodash';
import { observer } from 'mobx-react';
import ReportStore from 'mobx/ReportStore';
import { useEffect, useMemo } from 'react';

const ReportOriginCreateList = ({ originId = '', originSource = 'report' }) => {
  const { typesAll } = ReportStore;

  const ignoreItems = [
    'รายงานการแจ้งความออนไลน์',
    'รายงานจากเว็บฟอร์มออนไลน์',
    'รายงานรับแจ้งเหตุ 191',
    'crime intelligence',
  ];

  useEffect(() => {
    ReportStore.getTypesList('', true);
  }, []);

  const onNavigateDestination = (dataKey) => {
    const selectItems = _.find(typesAll, (ss) => ss._id === dataKey.key);

    if (selectItems) {
      const { group_type } = selectItems;

      const mapGroupName = {
        รายงานประจำวัน: 'daily',
        รายงานภายในองค์กร: 'internal',
        รายงานการปฏิบัติหน้าที่: 'onduty',
      };

      if (mapGroupName[group_type]) {
        window.open(
          `/app/incident-management/report/${mapGroupName[group_type]}/create?${originSource}_id=${originId}&type_id=${dataKey.key}`,
          '_blank'
        );
      }
    }

    return null;
  };

  const newItems = useMemo(() => {
    const menuOptions = _.map(typesAll, (ss) => ({
      label: ss.name,
      key: ss._id,
    }));

    return _.filter(menuOptions, (ss) => !_.includes(ignoreItems, ss.label));
  }, [typesAll]);

  return <Menu onClick={onNavigateDestination} items={newItems} />;
};

export default observer(ReportOriginCreateList);
