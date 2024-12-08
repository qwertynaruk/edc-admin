import { observer } from 'mobx-react';
import { Cascader, Select } from 'antd';
import EvidenceStore from 'mobx/EvidenceStore';
import _ from 'lodash';
const { Option } = Select;

const EvidenceStorageSelectWidget = (props) => {
  const newModel = EvidenceStore.storageList;

  const cascadeFormat = (_element = []) => {
    if (_element.length <= 0) {
      return [];
    }

    return _element.map((ss) => ({
      value: ss._id,
      label: _.get(ss, 'storage_name', '-'),
      children: cascadeFormat(_.get(ss, 'child_storage', [])),
    }));
  };

  return (
    <Cascader
      style={{
        width: 350,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'inline-block',
      }}
      options={cascadeFormat(newModel)}
      popupClassName="gx-cascade"
      {...props}
    />
  );
};

export default observer(EvidenceStorageSelectWidget);
