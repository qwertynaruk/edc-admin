import DialogNotification from 'components/shared-components/DialogNotification';
import { makeAutoObservable } from 'mobx';
import OneCommandService from 'services/OneCommandService';

class MainStore {
  qsUrl = '';
  screenLoading = false;

  constructor() {
    makeAutoObservable(this, {});
  }

  async getDashboardById(qsId) {
    this.screenLoading = true;

    try {
      const resp = await OneCommandService.getEmbededUrl(qsId);
      const { EmbedUrl = '' } = resp;
      this.qsUrl = EmbedUrl;
    } catch (error) {
      DialogNotification('error', 'ระบบขัดข้อง', 'ไม่สามารถเข้าดูรายการได้');
    } finally {
      this.screenLoading = false;
    }
  }
}

const OneCommandStore = new MainStore();
export default OneCommandStore;
