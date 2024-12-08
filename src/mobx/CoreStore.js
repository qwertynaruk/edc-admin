import { action, makeObservable, observable } from 'mobx';

import AttributeStore from './AttributeStore';
// import EvidenceStore from './EvidenceStore';
// import PersonnelStore from './PersonelStore';
import UserStore from './UserStore';
import _ from 'lodash';

// import _ from 'lodash';

class MainStore {
  currentPanelView = 'main';

  constructor() {
    makeObservable(this, {
      currentPanelView: observable,
      GetAllRelateStore: action,
      SetCurrentPanelView: action,
    });
  }

  async GetAllRelateStore() {
    const _request = [];

    _request.push(
      AttributeStore.GetDropdownOffenseCode()
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((errs) => {
          return Promise.reject(errs);
        })
    );

    // _request.push(
    //   AttributeStore.GetDrugGroupType()
    //     .then((resp) => {
    //       return Promise.resolve(resp);
    //     })
    //     .catch((errs) => {
    //       return Promise.reject(errs);
    //     })
    // );

    // _request.push(
    //   AttributeStore.GetDrugType()
    //     .then((resp) => {
    //       return Promise.resolve(resp);
    //     })
    //     .catch((errs) => {
    //       return Promise.reject(errs);
    //     })
    // );

    // _request.push(
    //   AttributeStore.GetFirearmGroupType()
    //     .then((resp) => {
    //       return Promise.resolve(resp);
    //     })
    //     .catch((errs) => {
    //       return Promise.reject(errs);
    //     })
    // );

    // _request.push(
    //   AttributeStore.GetFirearmType()
    //     .then((resp) => {
    //       return Promise.resolve(resp);
    //     })
    //     .catch((errs) => {
    //       return Promise.reject(errs);
    //     })
    // );

    // _request.push(
    //   PlaceLocalStore.GetPlaceProvince()
    //     .then((resp) => {
    //       return Promise.resolve(resp);
    //     })
    //     .catch((errs) => {
    //       return Promise.reject(errs);
    //     })
    // );

    // _request.push(
    //   UserStore.GetUserList()
    //     .then((resp) => {
    //       return Promise.resolve(resp);
    //     })
    //     .catch((errs) => {
    //       return Promise.reject(errs);
    //     })
    // );

    console.log('GetAllRelateStore');

    // รอ api
    // _request.push(
    //   PersonnelStore.Get()
    //     .then((resp) => {
    //       return Promise.resolve(resp);
    //     })
    //     .catch((errs) => {
    //       return Promise.reject(errs);
    //     })
    // );
    // รอ api
    _request.push(
      UserStore.GetUser(_.get(UserStore, 'accessAuthen.auth_id', ''))
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((errs) => {
          return Promise.reject(errs);
        })
    );

    // รอ api
    // _request.push(
    //   EvidenceStore.GetStorageList()
    //     .then((resp) => {
    //       return Promise.resolve(resp);
    //     })
    //     .catch((errs) => {
    //       return Promise.reject(errs);
    //     })
    // );

    await Promise.all(_request)
      .then((resp) => {
        return Promise.resolve(resp);
      })
      .catch((errs) => {
        const { description = '' } = errs;
        return Promise.reject(description);
      });
  }

  SetCurrentPanelView(payload) {
    this.currentPanelView = payload;
  }

  async CheckRefreshToken() {
    const { expires_at = 0 } = UserStore.accessAuthen;

    const currentDate = new Date();
    const toMiliTime = currentDate.getTime();

    if (toMiliTime > expires_at) {
      UserStore.RefreshToken();
      // UserStore.RefreshQueueToken();
    }
  }
}

const CoreStore = new MainStore();
export default CoreStore;
