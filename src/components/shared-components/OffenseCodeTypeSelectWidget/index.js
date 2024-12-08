import { observer } from 'mobx-react';
import ReportStore from 'mobx/ReportStore';
import { useMemo } from 'react';
import CustomSelect from '../CustomSelect';

const OffenseCodeTypeSelectWidget = (props) => {
  const { offenseCodeType = [] } = ReportStore;

  const options = useMemo(() => {
    return offenseCodeType.map((item) => {
      return {
        label: item.name,
        value: item.name,
      };
    });
  }, [offenseCodeType]);

  return <CustomSelect placeholder="เลือกกลุ่มความผิด" options={options} {...props} />;
};

export default observer(OffenseCodeTypeSelectWidget);
