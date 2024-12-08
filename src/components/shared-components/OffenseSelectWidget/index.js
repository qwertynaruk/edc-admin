import { observer } from 'mobx-react';
import { Select } from 'antd';
import AttributeStore from 'mobx/AttributeStore';
import _ from 'lodash';
const { Option } = Select;

const OffenseSelectWidget = (props) => {
  return (
    <Select {...props}>
      {_.get(AttributeStore, 'ItemOffenseCode', [])
        .filter((e) => e.offense_name)
        .map((el) => (
          <Option key={el.code} value={el._id}>
            {el.offense_name}
          </Option>
        ))}
    </Select>
  );
};

export default observer(OffenseSelectWidget);
