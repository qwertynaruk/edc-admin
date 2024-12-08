import DialogNotification from 'components/shared-components/DialogNotification';
import { action, computed, makeObservable, observable, runInAction, toJS } from 'mobx';
import CaseService from 'services/CaseService';
import { AutoSave } from './AutoSave';

class MainStore {
  actionLoading = false;
  crud_case_status = null;
  case_status_list = [];
  case_list_data = [];
  case_type_list = [];
  case_attachments_list = [];
  list_warrant_item = [];
  warrant_item = {};

  constructor() {
    makeObservable(this, {
      actionLoading: observable,
      case_list_data: observable,
      case_status_list: observable,
      case_attachments_list: observable,
      case_type_list: observable,
      list_warrant_item: observable,
      warrant_item: observable,
      warrantItems: computed,
      getCaseStatus: action,
      getCaseAttachments: action,
      getCaseTypes: action,
      getWarrant: action,
      getWarrantDetail: action,
      createWarrant: action,
      updateWarrant: action,
      setCaseData: action,
      DeleteWarrant: action,
    });

    AutoSave(this, 'case-store');
  }

  get warrantItems() {
    return toJS(this.warrant_item);
  }

  setCaseData(payload) {
    this.case_list_data = payload;
  }

  async getCaseList({ permissions }) {
    this.actionLoading = true;

    try {
      const resp = await CaseService.get_case_list({ permissions });
      const { data = [] } = resp;

      runInAction(() => {
        this.actionLoading = false;
        this.case_list_data = data;
      });
    } catch (error) {
      this.case_list_data = [];
      this.actionLoading = false;
    }
  }

  async getCaseStatus() {
    this.actionLoading = true;
    try {
      const resp = await CaseService.get_case_status();
      runInAction(() => {
        this.actionLoading = false;
        this.case_status_list = resp;
      });
    } catch (error) {
      this.case_status_list = [];
      this.actionLoading = false;
    }
  }

  async getCaseAttachments() {
    this.actionLoading = true;
    try {
      const resp = await CaseService.get_case_attachments();

      runInAction(() => {
        this.actionLoading = false;
        this.case_attachments_list = resp;
      });
    } catch (error) {
      this.case_attachments_list = [];
      this.actionLoading = false;
    }
  }

  async getCaseTypes() {
    this.actionLoading = true;
    try {
      const resp = await CaseService.get_case_type();
      const { data = [] } = resp;

      runInAction(() => {
        this.actionLoading = false;
        this.case_type_list = data;
      });

      return Promise.resolve(data);
    } catch (error) {
      this.case_type_list = [];
      this.actionLoading = false;
      return Promise.reject(error);
    }
  }

  async getWarrant() {
    this.actionLoading = true;

    try {
      const resp = await CaseService.get_warrants();

      runInAction(() => {
        this.list_warrant_item = resp?.data;
        this.actionLoading = false;
      });
    } catch (error) {
      this.actionLoading = false;
    }
  }

  async getWarrantDetail(warrantId) {
    this.actionLoading = true;

    try {
      const resp = await CaseService.get_warrant_by_id(warrantId);
      runInAction(() => {
        this.warrant_item = resp;
        this.actionLoading = false;
      });
    } catch (error) {
      this.actionLoading = false;
    }
  }

  async createWarrant(payload, afterSuccess) {
    this.actionLoading = true;

    try {
      await CaseService.create_warrants(payload);

      runInAction(() => {
        DialogNotification('success', 'เพิ่มข้อมูลสำเร็จ');
        this.actionLoading = false;
        this.getWarrant();
        afterSuccess();
      });
    } catch (error) {
      DialogNotification('error', 'เพิ่มข้อมูลไม่สำเร็จ');
      this.actionLoading = false;
    }
  }

  async updateWarrant(_id, payload, afterSuccess) {
    this.actionLoading = true;

    try {
      await CaseService.update_warrants(_id, payload);

      runInAction(() => {
        DialogNotification('success', 'เพิ่มข้อมูลสำเร็จ');
        this.getWarrant();
        this.actionLoading = false;
        afterSuccess();
      });
    } catch (error) {
      DialogNotification('error', 'อัปเดตรายการไม่สำเร็จ');
      this.actionLoading = false;
    }
  }

  async DeleteWarrant(_id, afterSuccess) {
    this.actionLoading = true;

    try {
      await CaseService.delete_warrants(_id);
      runInAction(() => {
        DialogNotification('success', 'ลบข้อมูลสำเร็จ');
        this.getWarrant();
        this.actionLoading = false;
        afterSuccess();
      });
    } catch (error) {
      DialogNotification('error', 'ลบข้อมูลไม่สำเร็จ');
      this.actionLoading = false;
    }
  }
}

const CaseStore = new MainStore();
export default CaseStore;
