import { makeAutoObservable, runInAction } from 'mobx';
import PersonnelService from 'services/PersonelService';
import { AutoSave } from './AutoSave';
import _ from 'lodash';
import tryParse from 'utils/tryParse';
import UserStore from './UserStore';

class MainStore {
  personnels = [];
  content_loading = false;
  actionLoading = false;
  countAll = 0;
  countActive = 0;
  selectPersonel = [];
  selectLoading = true;

  constructor() {
    makeAutoObservable(this);

    AutoSave(this, 'personnel-store');
  }

  toJS(data) {
    const domicile = _.get(tryParse(data.domicile), 'data.name_th', data.domicile);
    const dominate = _.get(tryParse(data.dominate), 'data.name_th', data.dominate); // ยศ
    const main_agency = _.get(tryParse(data.main_agency), 'data.name_th', data.main_agency); // ฝ่ายงาน
    return {
      ...data,
      prefix_name: _.get(tryParse(data.prefix_name), 'data.name_th', data.prefix_name),
      gender: _.get(tryParse(data.gender), 'data.name_th', data.gender),
      domicile: _.get(domicile, 'data.name_th', _.get(domicile, 'data.name_en', domicile)), // ภูมิลำเนา
      position: _.get(tryParse(data.position), 'data.name_th', data.position), // ตำแหน่ง
      unit_position: _.get(tryParse(data.unit_position), 'data.name_th', data.unit_position), // หน่วยงาน
      main_agency,
      dominate,
    };
  }

  async Get() {
    runInAction(() => {
      this.content_loading = true;
    });
    try {
      const resp = await PersonnelService.get();
      runInAction(() => {
        this.personnels = resp.data;
        this.countAll = resp.count_all;
        this.countActive = resp.count_active;
      });
      return Promise.resolve(resp);
    } catch (error) {
      return Promise.reject(error);
    } finally {
      runInAction(() => {
        this.content_loading = false;
      });
    }
  }

  async GetByQuery(main_agency) {
    runInAction(() => {
      this.selectLoading = true;
      this.selectPersonel = [];
    });
    try {
      const resp = await PersonnelService.get({ main_agency });

      runInAction(() => {
        this.selectPersonel = resp.data;
      });
      return Promise.resolve(resp);
    } catch (error) {
      return Promise.reject(error);
    } finally {
      runInAction(() => {
        this.selectLoading = false;
      });
    }
  }

  async GetById(id) {
    runInAction(() => {
      this.content_loading = true;
    });
    try {
      const personnel = await PersonnelService.getById(id);
      return Promise.resolve(_.get(personnel, 'data', {}));
    } catch (error) {
      return Promise.reject(error);
    } finally {
      runInAction(() => {
        this.content_loading = false;
      });
    }
  }

  async Create(data) {
    runInAction(() => {
      this.actionLoading = true;
    });
    try {
      const resp = await PersonnelService.post(this.toJS(data));

      return Promise.resolve(resp.data);
    } catch (error) {
      return Promise.reject(error);
    } finally {
      runInAction(() => {
        this.actionLoading = false;
        UserStore.GetUser(_.get(UserStore, 'user._id', ''));
      });
    }
  }

  async Update(id, data) {
    runInAction(() => {
      this.actionLoading = true;
    });
    try {
      const resp = await PersonnelService.update(id, this.toJS(data));
      return Promise.resolve(resp.data);
    } catch (error) {
      return Promise.reject(error);
    } finally {
      runInAction(() => {
        this.actionLoading = false;
        UserStore.GetUser(_.get(UserStore, 'user._id', ''));
      });
    }
  }
}

const PersonnelStore = new MainStore();
export default PersonnelStore;
