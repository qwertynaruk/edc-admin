import { makeAutoObservable, runInAction } from 'mobx';
import EvidenceService from 'services/EvidenceService';
import { AutoSave } from './AutoSave';

class MainStore {
  content_loading = false;
  actionLoading = false;
  evidences = [];
  storageList = [];

  constructor() {
    makeAutoObservable(this);
    AutoSave(this, 'evidence-store');
  }

  async GetList() {
    runInAction(() => {
      this.content_loading = true;
    });
    try {
      const resp = await EvidenceService.getEvidences();
      runInAction(() => {
        this.evidences = resp.data;
      });
      return resp;
    } catch (error) {
      this.evidences = [];
      return error;
    } finally {
      runInAction(() => {
        this.content_loading = false;
      });
    }
  }

  async GetStorageList() {
    try {
      const resp = await EvidenceService.getListEvidenceServiceProperty();
      runInAction(() => {
        this.storageList = resp.data;
      });
      return resp;
    } catch (error) {
      this.storageList = [];
      return error;
    }
  }
}

const EvidenceStore = new MainStore();
export default EvidenceStore;
