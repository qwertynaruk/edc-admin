import produce from 'immer';
import { makeAutoObservable, runInAction, toJS } from 'mobx';

import { AutoSave } from './AutoSave';
import AttributeService from 'services/AttributeService';
import ReportService from 'services/ReportServices';
import UploadAttactmentService from 'services/UploadAttactmentService';

class MainStore {
  offense_code_dropdown = [];
  types_dropdown_master = [];
  items_dropdown_master_indices = [];
  content_loading = false;
  actionLoading = false;
  drug_type = [];
  drug_group_type = [];
  firearm_type = [];
  firearm_group_type = [];

  constructor() {
    makeAutoObservable(this);

    AutoSave(this, 'attribute-store');
  }

  async GetDropdownOffenseCode() {
    runInAction(() => {
      this.content_loading = true;
    });
    try {
      const resp = await ReportService.getOffenseCode();
      this.offense_code_dropdown = resp.data;
    } catch (error) {
      console.log('failed', error);
    } finally {
      runInAction(() => {
        this.content_loading = false;
      });
    }
  }

  async GetTypeDropdownMaster(options) {
    runInAction(() => {
      this.content_loading = true;
    });
    try {
      const resp = await AttributeService.getTypeDropdownMaster(options);
      runInAction(() => {
        this.types_dropdown_master = resp.data;
      });
    } catch (error) {
      console.log('failed', error);
    } finally {
      runInAction(() => {
        this.content_loading = false;
      });
    }
  }

  async GetItemsDropdownMaster(options) {
    runInAction(() => {
      this.content_loading = true;
    });
    try {
      const resp = await AttributeService.getItemsDropdownMaster(options);
      this.GroupDropdownMaster(resp.data);
    } catch (error) {
      console.log('failed', error);
    } finally {
      runInAction(() => {
        this.content_loading = false;
      });
    }
  }

  transform(data) {
    if (!data) return data;
    return produce(data, (draft) => {
      draft.start_stop_at = data.start_stop_at ? data.start_stop_at.map((item) => item.toISOString()) : [];
    });
  }

  async Create(data) {
    runInAction(() => {
      this.actionLoading = true;
    });
    try {
      const resp = await AttributeService.postAttribute(this.transform(data));
      return Promise.resolve(resp.data);
    } catch (error) {
      return Promise.reject(error);
    } finally {
      runInAction(() => {
        this.actionLoading = false;
      });
    }
  }

  async Update(id, data) {
    runInAction(() => {
      this.actionLoading = true;
    });
    try {
      const resp = AttributeService.updateAttribute(id, this.transform(data));
      return Promise.resolve(resp.data);
    } catch (error) {
      return Promise.reject(error);
    } finally {
      runInAction(() => {
        this.actionLoading = false;
      });
    }
  }

  GroupDropdownMaster(unit) {
    const tm = [];
    const newOj = {};

    this.types_dropdown_master.forEach((element) => {
      const jx = unit.filter((el) => el.attribute_type_id === toJS(element._id));

      tm.push({
        ...element,
        options: jx,
      });
    });

    tm.forEach((el) => {
      newOj[el._id] = el;
    });

    this.items_dropdown_master_indices = newOj;
  }

  async GetDrugType() {
    try {
      const resp = await UploadAttactmentService.fetchDrugType();
      this.drug_type = resp.data;
    } catch (error) {
      this.drug_type = [];
    }
  }

  async GetDrugGroupType() {
    try {
      const resp = await UploadAttactmentService.fetchDrugGroupType();
      this.drug_group_type = resp.data;
    } catch (error) {
      this.drug_group_type = [];
    }
  }

  async GetFirearmType() {
    try {
      const resp = await UploadAttactmentService.fetchFirearmType();
      this.firearm_type = resp.data;
    } catch (error) {
      this.firearm_type = [];
    }
  }

  async GetFirearmGroupType() {
    try {
      const resp = await UploadAttactmentService.fetchFirearmGroupType();
      this.firearm_group_type = resp.data;
    } catch (error) {
      this.firearm_group_type = [];
    }
  }

  get ItemOfDropdownMaster() {
    return toJS(this.items_dropdown_master_indices);
  }

  get ItemOffenseCode() {
    return toJS(this.offense_code_dropdown);
  }

  get Types() {
    return this.types_dropdown_master;
  }
}

const AttributeStore = new MainStore();
export default AttributeStore;
