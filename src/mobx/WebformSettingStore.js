import { task } from 'mobx-task';
import { observable } from 'mobx';
import fetch from 'axios/FetchMaster';

import DialogNotification from 'components/shared-components/DialogNotification';
import { AutoSave } from './AutoSave';
import UserStore from './UserStore';

const inFecthLogStatus = (statusCode) => {
  switch (statusCode) {
    case 500:
      DialogNotification('error', 'ไม่สามารถดำเนินรายการได้', 'มีข้อมูลบางรายการที่มีอยู่แล้วในระบบ');
      break;

    default:
      DialogNotification('error', 'ไม่สามารถดำเนินรายการได้', 'ระบบขัดข้อง กรุณาลองใหม่อีกครั้ง');
      break;
  }
};

const WebformSettingStore = observable({
  create: task(async (_payload = {}) => {
    try {
      const _resp = await fetch.incident_report({
        method: 'post',
        url: '/webform',
        data: {
          data: {
            ..._payload,
            created_by: UserStore.accessAuthen.auth_id,
          },
        },
      });

      const { status = 400, id = '' } = _resp;

      if (status === 200) {
        // initialLocation.getLocation();
        DialogNotification('success', 'สร้างเว็บฟอร์มสำเร็จ');
        return Promise.resolve(id);
      } else {
        inFecthLogStatus(status);
        return Promise.reject(status);
      }
    } catch (error) {
      DialogNotification('error', 'สร้างเว็บฟอร์มไม่สำเร็จ');
      return Promise.reject(error);
    }
  }),
});

AutoSave(WebformSettingStore, 'webform-setting-store');

export default WebformSettingStore;
