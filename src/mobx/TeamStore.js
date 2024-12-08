import DialogNotification from 'components/shared-components/DialogNotification';
import { makeAutoObservable, runInAction, toJS } from 'mobx';
import TeamService from 'services/TeamService';
import { AutoSave } from './AutoSave';

class MainStore {
  team_List = [];
  main_Agency = [];
  content_loading = false;

  constructor() {
    makeAutoObservable(this);

    AutoSave(this, 'team-store');
  }

  get teamList() {
    return toJS(this.team_List);
  }

  get mainAgency() {
    return toJS(this.main_Agency);
  }

  async GetTeamList() {
    runInAction(() => {
      this.content_loading = true;
    });
    try {
      const resp = await TeamService.getInvestigationTeam();
      runInAction(() => {
        this.team_List = resp.data;
      });
    } catch (error) {
      runInAction(() => {
        this.team_List = [];
      });
    } finally {
      runInAction(() => {
        this.content_loading = false;
      });
    }
  }

  async GetMainAgency() {
    runInAction(() => {
      this.content_loading = true;
    });
    try {
      const resp = await TeamService.getMainAgencyTeam();
      runInAction(() => {
        this.main_Agency = resp.data;
      });
    } catch (error) {
      this.main_Agency = [];
    } finally {
      runInAction(() => {
        this.content_loading = false;
      });
    }
  }

  async CreateInvestigation(payload, afterSuccess) {
    runInAction(() => {
      this.actionLoading = true;
    });
    try {
      await TeamService.createInvestigationTeam(payload);
      this.GetTeamList();
      afterSuccess();
      DialogNotification('success', 'สร้างทีมสำเร็จ');
    } catch (error) {
      DialogNotification('error', error === 400 ? 'ชื่อทีมซ้ำ' : 'สร้างทีมไม่สำเร็จ');
    } finally {
      runInAction(() => {
        this.actionLoading = false;
      });
    }
  }

  async UpdateInvestigation(payload, _id) {
    runInAction(() => {
      this.actionLoading = true;
    });
    try {
      await TeamService.updateInvestigationTeam(payload, _id);
      this.GetTeamList();
      DialogNotification('success', 'อัพเดตรายการสำเร็จ');
    } catch (error) {
      this.content_loading = false;
      DialogNotification('error', 'อัปเดตรายการไม่สำเร็จ');
    } finally {
      runInAction(() => {
        this.actionLoading = false;
      });
    }
  }
}

const TeamStore = new MainStore();
export default TeamStore;
