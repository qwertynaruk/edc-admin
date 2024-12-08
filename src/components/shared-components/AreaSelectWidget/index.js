import { Select } from 'antd';
import { observer } from 'mobx-react';
import MasterIndiceStore from 'mobx/MasterIndiceStore';
import { useMemo } from 'react';

function AreaSelectWidget(props) {
  const { placeAreaList = [] } = MasterIndiceStore;
  const options = useMemo(
    () =>
      placeAreaList.map((item) => {
        return {
          key: item._id,
          label: item.name,
          value: item.name,
        };
      }),
    [placeAreaList]
  );
  return <Select placeholder="เลือกพื้นที่" options={options} {...props} />;
}

export default observer(AreaSelectWidget);
