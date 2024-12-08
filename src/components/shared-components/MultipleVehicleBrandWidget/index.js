import { Select } from 'antd';
import { observer } from 'mobx-react';
import VehicleModelStore from 'mobx/VehicleModelStore';
import CustomSelect from '../CustomSelect';
import { otherBrand } from '../VehicleModelWidget';

const { Option } = Select;

const MultipleVehicleBrandWidget = (props) => {
  const renderOption = (item, fieldName) => {
    return item.map((el, _index) => (
      <Option key={_index} value={el[fieldName]}>
        {el[fieldName]}
      </Option>
    ));
  };

  return (
    <CustomSelect showSearch placeholder="เลือกยี่ห้อ" mode="multiple" {...props}>
      {renderOption(VehicleModelStore.brand_item, 'vehicle_make_name')}
      <Option value={otherBrand.vehicle_make_name}>{otherBrand.vehicle_make_name}</Option>
    </CustomSelect>
  );
};

export default observer(MultipleVehicleBrandWidget);
