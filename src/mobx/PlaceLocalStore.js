import { action, makeObservable, observable, runInAction } from 'mobx';

import AttributeService from 'services/AttributeService';
import { AutoSave } from './AutoSave';

class MainStore {
  province_item = [];
  city_item = [];
  district_item = [];
  addressStackData = [];
  action_city_loading = false;
  action_district_loading = false;

  constructor() {
    makeObservable(this, {
      province_item: observable,
      city_item: observable,
      district_item: observable,
      addressStackData: observable,
      action_city_loading: observable,
      action_district_loading: observable,
      GetPlaceProvince: action,
      GetPlaceCity: action,
      GetPlaceDistrict: action,
      setAddressMapLoad: action,
    });

    AutoSave(this, 'place-local-store');
  }

  setAddressMapLoad(el) {
    this.addressStackData = el;
  }

  async GetPlaceProvince() {
    try {
      const resp = await AttributeService.getDropdownProvince();
      runInAction(() => {
        this.province_item = resp.data;
        this.city_item = [];
      });
    } catch (error) {
      this.province_item = [];
      this.city_item = [];
    }
  }

  async GetPlaceCity(provinceId) {
    this.action_city_loading = true;
    try {
      const resp = await AttributeService.getDropdownCity(provinceId);
      runInAction(() => {
        this.city_item = resp.data;
        this.district_item = [];
        this.action_city_loading = false;
      });
    } catch (error) {
      this.city_item = [];
      this.district_item = [];
      this.action_city_loading = false;
    }
  }

  async GetPlaceDistrict(cityId) {
    this.action_district_loading = true;
    try {
      const resp = await AttributeService.getDropdownDistrict(cityId);
      runInAction(() => {
        this.district_item = resp.data;
        this.action_district_loading = false;
      });
    } catch (error) {
      this.district_item = [];
      this.action_district_loading = false;
    }
  }
}

const PlaceLocalStore = new MainStore();
export default PlaceLocalStore;
