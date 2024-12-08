import { observer } from 'mobx-react';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import CustomSelect from '../CustomSelect';
import MasterAttributeStore from 'mobx/MasterAttributeStore';

export const MasterCheckboxWidget = ({ category, customData = null }) => {
  const { attributeItems } = MasterAttributeStore;
  useEffect(() => {
    if (category) {
      MasterAttributeStore.getAttributeItems(category, true);
    }
  }, [category]);

  const customAttr = [{ name_th: 'รอดำเนินการ' }, { name_th: 'เสร็จสิ้น' }, { name_th: 'ลบ' }];

  const childs = customData ? customAttr || [] : attributeItems;
  return childs.length > 0 ? childs.map((ss) => ({ label: ss.name_th, value: ss.name_th })) : [];
};

const MasterSelectWidget = (props) => {
  const { attributeItems } = MasterAttributeStore;
  const [loading, setLoading] = useState(false);

  const { onChange, category, ...rest } = props;

  const initProcess = (_open) => {
    if (_open) {
      setLoading(true);
      MasterAttributeStore.getAttributeItems(category).finally(() => setLoading(false));
    } else {
      MasterAttributeStore.setAttributeItems([]);
    }
  };

  const checkIsEmptyChild = () => {
    return loading
      ? {
          notFoundContent: 'กำลังโหลดข้อมูล',
        }
      : {};
  };

  return (
    <CustomSelect
      loading={loading}
      onChange={(value) => {
        onChange(
          value,
          _.find(attributeItems, (el) => el.name_th === value)
        );
      }}
      onDropdownVisibleChange={initProcess}
      options={attributeItems.map((ss) => ({
        label: ss.name_th,
        value: ss.name_th,
      }))}
      {...checkIsEmptyChild()}
      {...rest}
    />
  );
};

export default observer(MasterSelectWidget);
