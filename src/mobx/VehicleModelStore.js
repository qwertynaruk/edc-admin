import _ from 'lodash';
import { action, observable } from 'mobx';
import { task } from 'mobx-task';

import AttributeService from 'services/AttributeService';

const VehicleModelStore = observable({
  brand_item: [],
  model_item: [],
  modelListitem: [],
  actionLoading: false,
  vehicle_by_brand: {},
  content_loading: false,
  GetBrand: task(async () => {
    try {
      const resp = await AttributeService.getDropdownVehicleBrand();

      VehicleModelStore.SetBrand(resp.data);
      return Promise.resolve(200);
    } catch (error) {
      VehicleModelStore.SetBrand([]);
      return Promise.reject(error);
    }
  }),
  SetBrand: action((_store) => {
    VehicleModelStore.brand_item = _store;
    VehicleModelStore.model_item = [];
  }),
  GetModel: task(async (makeId) => {
    try {
      const resp = await AttributeService.getDropdownVehicleModel(makeId);

      VehicleModelStore.SetModel(resp.data);
      return Promise.resolve(200);
    } catch (error) {
      VehicleModelStore.SetModel([]);
      return Promise.reject(error);
    }
  }),
  SetModel: action((_store) => (VehicleModelStore.model_item = _store)),
  GetMultipleModel: task(async (makeIdList = []) => {
    try {
      const resp = await AttributeService.getDropdownVehicleModels();
      const { data = [] } = resp;

      const selectBrand = _.filter(VehicleModelStore.brand_item, (ss) => makeIdList.includes(ss.vehicle_make_name));
      const newData = _.filter(data, (ss) =>
        _.map(selectBrand, (elem) => elem?.vehicle_make_id).includes(ss?.vehicle_make_id)
      );

      VehicleModelStore.SetMultipleModel(newData);
      return Promise.resolve(200);
    } catch (error) {
      VehicleModelStore.SetMultipleModel([]);
      return Promise.reject(error);
    }
  }),
  SetMultipleModel: action((_store) => (VehicleModelStore.modelListitem = _store)),
  GetModels: task(async () => {
    try {
      const brands = await AttributeService.getDropdownVehicleBrand();
      const models = await AttributeService.getDropdownVehicleModels();

      const group = _.groupBy(models.data, 'vehicle_make_id');
      const renamedKeys = _.mapKeys(group.data, (value, key) => {
        return _.find(brands, { vehicle_make_id: key }).vehicle_make_name;
      });

      VehicleModelStore.SetModels(renamedKeys);
      return renamedKeys;
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }),
  SetModels: action((_store) => (VehicleModelStore.vehicle_by_brand = _store)),
});

export default VehicleModelStore;
