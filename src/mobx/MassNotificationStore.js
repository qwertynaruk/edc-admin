import { makeAutoObservable, runInAction } from 'mobx';
import MassNotificationService from 'services/MassNotificationService';
import moment from 'moment';
import { AutoSave } from './AutoSave';
import UserStore from './UserStore';
import { MAX_API_LIMIT } from 'constants/ApiConstant';

export const CASE_STATUS = {
  PENDING: 'รอส่ง',
  SEND: 'ส่ง',
  SENT: 'ส่งแล้ว',
  FAILED: 'ส่งไม่สำเร็จ',
  DELETED: 'ลบ',
  DRAFT: 'ฉบับร่าง',
};
class MainStore {
  content_loading = false;
  actionLoading = false;
  notifications = [];
  countAll = 0;

  constructor() {
    makeAutoObservable(this);
    AutoSave(this, 'mass-noti-store');
  }

  get notificationsTransformed() {
    return this.notifications.map((notification) => ({
      ...notification,
      created_at: moment.utc(notification.created_at),
      updated_at: moment.utc(notification.updated_at),
      publish_time: notification.publish_time && moment.utc(notification.publish_time),
    }));
  }

  async Get(params = {}) {
    runInAction(() => {
      this.content_loading = true;
    });
    try {
      const resp = await MassNotificationService.get({
        limit: MAX_API_LIMIT,
        config_type: 'mass_notification',
        ...params,
      });
      runInAction(() => {
        this.notifications = resp.data;
        this.countAll = resp.count;
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

  async Update(records = [], assignment = {}) {
    runInAction(() => {
      this.actionLoading = true;
    });
    try {
      const mergeData = records.map((rowMerge) => {
        return {
          ...rowMerge,
          ...assignment,
        };
      });

      // const data = records.map((record) => Object.assign(record, assignment));
      const resp = await MassNotificationService.update(mergeData);
      return Promise.resolve(resp);
    } catch (error) {
      return Promise.reject(error);
    } finally {
      runInAction(() => {
        this.actionLoading = false;
      });
    }
  }

  async Notify(records = [], assignment = {}) {
    runInAction(() => {
      this.actionLoading = true;
    });
    try {
      const mergeData = records.map((rowMerge) => {
        return {
          ...rowMerge,
          ...assignment,
        };
      });
      // const data = records.map((record) => Object.assign(record, assignment));
      const resp = await MassNotificationService.notify(mergeData);
      return Promise.resolve(resp);
    } catch (error) {
      return Promise.reject(error);
    } finally {
      runInAction(() => {
        this.actionLoading = false;
      });
    }
  }

  async Post(data) {
    runInAction(() => {
      this.actionLoading = true;
    });
    try {
      const resp = await MassNotificationService.post({
        ...data,
        created_by: UserStore.accessAuthen.auth_id,
      });
      return Promise.resolve(resp);
    } catch (error) {
      return Promise.reject(error);
    } finally {
      runInAction(() => {
        this.actionLoading = false;
      });
    }
  }
}

const MassNotificationStore = new MainStore();
export default MassNotificationStore;
