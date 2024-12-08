import DialogNotification from 'components/shared-components/DialogNotification';
import { makeAutoObservable } from 'mobx';
import AdvanceSearchService from 'services/AdvanceSearchService';
import stripEmptyField from 'utils/stripEmptyField';
import AssetStore from './AssetStore';
import { AutoSave } from './AutoSave';
import MasterIndiceStore from './MasterIndiceStore';
import ReportStore from './ReportStore';

class MainStore {
  searchPreloading = false;

  constructor() {
    makeAutoObservable(this);
    AutoSave(this, 'mobx-store');
  }

  checkFieldEmpty(payload = {}) {
    const ignoreEmpty = Object.values(payload);
    if (ignoreEmpty.filter((ss) => ss).length <= 0) {
      DialogNotification(
        'warning',
        'ไม่สามารถดำเนินการได้',
        'กรุณาระบุฟิลด์ข้อมูลที่ต้องการค้นหาอย่างน้อย 1 รายการขึ้นไป'
      );
      return true;
    }
    return false;
  }

  async SearchProcess(payload = {}, afterSuccess = () => {}) {
    const { data_type = '', search_parameters = {}, mock = false } = payload;
    if (mock) {
      this.searchPreloading = true;

      setTimeout(() => {
        this.searchPreloading = false;
      }, 1000);
      return;
    }

    if (this.checkFieldEmpty(search_parameters)) {
      return;
    }

    this.searchPreloading = true;

    let resp;

    try {
      resp = await AdvanceSearchService.doSearch({
        ...payload,
        search_parameters: stripEmptyField(search_parameters),
      });
      this.SwitchRenderItem({
        dataSource: resp.data,
        originForm: data_type,
      });
    } catch (error) {
      this.SwitchRenderItem({
        dataSource: [],
        originForm: data_type,
      });
      DialogNotification('error', 'ไม่สามารถค้นหาผลลัพธ์นี้ได้');
    } finally {
      this.searchPreloading = false;
      afterSuccess(resp ? resp.data : []);
    }
  }

  async SearchNearbyProcess(payload = {}, afterSuccess = () => {}) {
    if (this.checkFieldEmpty(payload)) {
      return;
    }

    if (!payload.lat || !payload.lng) {
      DialogNotification('warning', 'ไม่สามารถดำเนินการได้', 'กรุณาระบุพิกัดที่ต้องการค้นหา');
      return;
    }

    this.searchPreloading = true;

    try {
      const resp = await AdvanceSearchService.searchNearby(payload);
      MasterIndiceStore.setLocation(resp.data);
    } catch (error) {
      MasterIndiceStore.setLocation([]);
      DialogNotification('error', 'ไม่สามารถค้นหาผลลัพธ์นี้ได้');
    } finally {
      this.searchPreloading = false;
      afterSuccess();
    }
  }

  async SwitchRenderItem({ dataSource = [], originForm = '' }) {
    switch (originForm) {
      case 'person':
        MasterIndiceStore.setPerson(dataSource);
        break;

      case 'vehicle':
        MasterIndiceStore.setVehicle(dataSource);
        break;

      case 'property':
        MasterIndiceStore.setProperty(dataSource);
        break;

      case 'location':
        MasterIndiceStore.setLocation(dataSource);
        break;

      case 'organization':
        MasterIndiceStore.setOrganization(dataSource);
        break;

      case 'asset':
        AssetStore.assets = dataSource;
        break;

      case 'report_daily_case':
      case 'report_daily':
      case 'report_internal_arrest':
      case 'report_internal_investigation':
      case 'report_daily_evidence':
      case 'report_daily_lost_document':
      case 'report_duty':
        ReportStore.setReportList(dataSource);
        break;

      default:
        break;
    }
  }
}

const AdvanceSearchStore = new MainStore();
export default AdvanceSearchStore;
