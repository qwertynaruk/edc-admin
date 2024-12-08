import { MAX_API_LIMIT } from 'constants/ApiConstant';
import _ from 'lodash';
import { makeAutoObservable, runInAction } from 'mobx';
import AbilityService from 'services/AbilityService';
import { AutoSave } from './AutoSave';

export const ABILITY_GROUP = {
  system_administration: 'ผู้ดูแลระบบ',
  master_indices: 'ดัชนีข้อมูลหลัก',
  incident_management: 'เหตุการณ์',
  queue_management: 'คิว',
  case: 'เคส',
  asset: 'ทรัพย์สิน',
  property_and_evidence_management: 'ทรัพย์สินและวัตถุพยาน',
  one_command: 'ศูนย์บัญชาการกลาง',
  personnel: 'กำลังพล',
  asset_managements: 'ทรัพยากร',
  advanced_search: 'ค้นหาข้อมูล',
  patrol_management: 'จัดการจุดตรวจ',
};
class MainStore {
  abilities = {};
  content_loading = false;

  constructor() {
    makeAutoObservable(this);

    AutoSave(this, 'abilities-store');
  }

  async Get() {
    runInAction(() => {
      this.content_loading = true;
    });
    try {
      const resp = await AbilityService.get({
        limit: MAX_API_LIMIT,
      });
      runInAction(() => {
        this.abilities = _.groupBy(resp.data, 'group');
      });
      return Promise.resolve(this.abilities);
    } catch (error) {
      return Promise.reject(error);
    } finally {
      runInAction(() => {
        this.content_loading = false;
      });
    }
  }
}

const AbilityStore = new MainStore();
export default AbilityStore;
