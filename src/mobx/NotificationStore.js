import { makeAutoObservable, runInAction, toJS } from 'mobx';

import { NotificationIcon } from 'assets/svg/icon';
import NotificationService from 'services/NotificationService';
import _ from 'lodash';
import produce from 'immer';
import { queryClient } from 'lib/react-query';

export const NotificationType = {
  SUCCESS: 'Success',
  WARNING: 'Warning',
  ERROR: 'Error',
  INFORMATION: 'Information',
};

// const MOCKID = '62f5292719583753918c6355';

export const MAP_ACTION_NAME_TO_ICON = {
  incident_webform_new_request: NotificationIcon.Warning,
  incident_online_new_request: NotificationIcon.Warning,
  incident_new_request: NotificationIcon.Warning,
  incident_comment: NotificationIcon.Information,
  incident_assign_inspector: NotificationIcon.Warning,
  incident_request_approval: NotificationIcon.Warning,
  incident_daily_approved: NotificationIcon.Success,
  incident_daily_disapproved: NotificationIcon.Error,
  incident_approved: NotificationIcon.Success,
  incident_disapproved: NotificationIcon.Error,
  incident_internal_approved: NotificationIcon.Success,
  incident_internal_disapproved: NotificationIcon.Error,
  incident_change_owner: NotificationIcon.Information,
  incident_case_create: NotificationIcon.Information,
  incident_task_create: NotificationIcon.Warning,
  incident_add_related_report: NotificationIcon.Information,
  incident_create_related_report: NotificationIcon.Information,
  incident_update: NotificationIcon.Information,
  incident_send_email: NotificationIcon.Information,
  case_create: NotificationIcon.Information,
  case_update: NotificationIcon.Information,
  case_task_create: NotificationIcon.Warning,
  case_determine_date: NotificationIcon.Information,
  case_add_related_report: NotificationIcon.Information,
  case_create_related_report: NotificationIcon.Information,
  case_request_approval: NotificationIcon.Warning,
  case_approved: NotificationIcon.Success,
  case_disapproved: NotificationIcon.Error,
  case_note_create: NotificationIcon.Information,
  case_note_update: NotificationIcon.Information,
  task_determine_date: NotificationIcon.Information,
  noti_alarm: NotificationIcon.Alarm,
  noti_mail: NotificationIcon.Mail,
  noti_callsos: NotificationIcon.CallSOS,
  noti_warning: NotificationIcon.Warning,
  noti_info_circle: NotificationIcon.InfoCircle,
};

class MainStore {
  notifications = [];
  count = 0;
  content_loading = false;
  actionLoading = false;
  incoming = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.Clear();
  }

  get hasMore() {
    return this.notifications.length < this.count;
    // return true;
  }

  Clear() {
    runInAction(() => {
      this.notifications = [];
    });
  }

  Read() {
    runInAction(() => {
      this.incoming = false;
    });
  }

  async Get(options = {}) {
    runInAction(() => {
      this.content_loading = true;
    });
    try {
      const resp = await NotificationService.get({
        ...options,
        // params: {
        //   ...options.params,
        //   receiver_id: UserStore.accessAuthen?.auth_id,
        //   channel_content_id: 'udc_app',
        // },
        params: {
          ...options.params,
          from: 'web',
        },
      });
      runInAction(() => {
        // this.notifications = [...this.notifications, ...resp.data];
        this.notifications = _.unionBy(resp?.response?.data, this.notifications, 'id');
        this.count = resp?.response?.total_record;
      });
      return resp;
    } finally {
      runInAction(() => {
        this.content_loading = false;
      });
    }
  }

  async Update(noti_id, data) {
    runInAction(() => {
      this.actionLoading = true;
    });
    try {
      const resp = await NotificationService.update(noti_id, data);
      return resp;
    } finally {
      runInAction(() => {
        this.actionLoading = false;
      });
    }
  }

  UpdateLocal(noti_id, data) {
    runInAction(() => {
      const index = this.notifications.findIndex((x) => x._id === noti_id);
      const notFound = index < 0;
      if (notFound) return;
      this.notifications = produce(toJS(this.notifications), (draft) => {
        draft[index] = Object.assign(draft[index], data);
      });
    });
  }

  async UpdateSilent(notiId, data) {
    runInAction(() => {
      this.content_loading = true;
    });
    try {
      const resp = await NotificationService.update(notiId, data);
      return resp;
    } finally {
      await queryClient.invalidateQueries(['notification-list']);
      runInAction(() => {
        this.content_loading = false;
      });
    }
  }

  // onIncomming(play) {
  //   const notificationRef = ref(database, `prod-pattaya-safety/users/${UserStore.accessAuthen?.auth_id}`);
  //   return onValue(notificationRef, (snapshot) => {
  //     const notifications = snapshot.val();
  //     if (!Array.isArray(notifications)) return;
  //     runInAction(() => {
  //       this.incoming = notifications.some((x) => x.is_read === false);
  //       if (this.incoming && play) play();
  //       this.notifications = _.unionBy(notifications, this.notifications, '_id');
  //       this.content_loading = false;
  //     });
  //   });
  // }
  onIncomming(play) {
    runInAction(() => {
      this.incoming = this.notifications.some((x) => x.is_read === false);
      if (this.incoming && play) play();
      // this.notifications = _.unionBy(this.notifications, this.notifications, 'id');
      this.content_loading = false;
    });
  }
}

const NotificationStore = new MainStore();
export default NotificationStore;
