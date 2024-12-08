import _ from 'lodash';
import { observer } from 'mobx-react';
import VehicleModelStore from 'mobx/VehicleModelStore';
import { useEffect, useState } from 'react';
import CustomTreeSelect, { CustomTreeNode } from '../CustomTreeSelect';
import { otherModel } from '../VehicleModelWidget';

const MultipleVehicleModelWidget = (props) => {
  const [loading, setLoading] = useState(false);
  const { vehicle_by_brand } = VehicleModelStore;

  useEffect(() => {
    setLoading(true);
    VehicleModelStore.GetModels().finally(() => setLoading(false));
  }, []);

  return (
    <CustomTreeSelect
      loading={loading}
      disabled={loading}
      showSearch
      style={{
        width: '100%',
      }}
      dropdownStyle={{
        maxHeight: 400,
        overflow: 'auto',
      }}
      placeholder="เลือกรุ่น"
      multiple
      treeDefaultExpandAll={true}
      // treeExpandedKeys={brands}
      {...props}
    >
      {_.map(vehicle_by_brand, (value, key) => {
        return (
          <CustomTreeNode key={key} title={key} value={key} disabled>
            {value.map((item) => {
              return <CustomTreeNode key={item._id} title={item.vehicle_model_name} value={item._id} />;
            })}
          </CustomTreeNode>
        );
      })}
      <CustomTreeNode value={otherModel.vehicle_model_name} title={otherModel.vehicle_model_name} />
    </CustomTreeSelect>
  );
};

export default observer(MultipleVehicleModelWidget);
