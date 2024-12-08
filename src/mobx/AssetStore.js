import { makeAutoObservable, runInAction } from 'mobx';
import _ from 'lodash';
import AssetService from 'services/AssetService';
import { AutoSave } from './AutoSave';
import stripEmptyField from 'utils/stripEmptyField';
import produce from 'immer';

class MainStore {
  assets = [];
  content_loading = false;
  actionLoading = false;
  _currentAsset = {
    properties: [],
  };
  // currentProperty = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    AutoSave(this, 'asset-store');
  }

  get currentAsset() {
    return this._currentAsset;
  }

  set currentAsset(value) {
    this._currentAsset = value;
  }

  get currentProperty() {
    if (!this.currentAsset) return null;
    if (this.currentAsset.properties.length <= 0) return {};
    return this.currentAsset.properties[0];
  }

  set currentProperty(value) {
    if (!this.currentAsset) return;
    this.currentAsset.properties = [value];
  }

  SetCurrentProperty(payload) {
    runInAction(() => {
      this.currentProperty = payload;
    });
  }

  ClearCurrent() {
    this.currentAsset = {
      properties: [],
    };
  }

  prepareAssetPayload(asset, properties) {
    const s3UploadKey = _.compact(_.flatMap(properties, (property) => property.s3_upload_key));

    return produce(
      {
        data: _.omit(stripEmptyField(asset)),
      },
      (draft) => {
        draft.data.properties = properties.map(this.preparePropertyPayload);
        if (s3UploadKey.length > 0) {
          draft.s3_upload_key = s3UploadKey;
        }
      }
    );
  }

  prepareMultipleFilePayload(payload) {
    return payload.map((file) => {
      if (!file.url) return file;
      return file.url;
    });
  }

  preparePropertyPayload(_payload) {
    const payload = _.omit(stripEmptyField(_payload), ['_id', 'asset_id', 's3_upload_key']);
    const transformedPayload = produce(payload, (draft) => {
      if (draft.cover_image_file && draft.cover_image_file.url) {
        draft.cover_image_file = draft.cover_image_file.url;
      }
      if (draft.relate_file) {
        draft.relate_file = this.prepareMultipleFilePayload(draft.relate_file);
      }
      if (draft.relate_image_file) {
        draft.relate_image_file = this.prepareMultipleFilePayload(draft.relate_image_file);
      }
    });
    return transformedPayload;
  }

  preparePropertyUpdatePayload(payload) {
    return _.pickBy(
      {
        data: this.preparePropertyPayload(payload),
        s3_upload_key: payload.s3_upload_key,
      },
      _.identity
    );
  }
  // preparePayload(payload) {
  //   let result = { ...this.currentAsset, ...payload };
  //   const toISO = (date) => (typeof date === 'string' ? date : date.toISOString());

  //   if (result.properties) {
  //     result = {
  //       ...result,
  //       properties: toJS(
  //         result.properties.map((item) => {
  //           return {
  //             ...item,
  //             brand: _.get(tryParse(item.brand), 'data', item.brand),
  //             model: _.get(tryParse(item.model), 'data', item.model),
  //             buttstock: _.get(tryParse(item.buttstock), 'data', item.buttstock),
  //           };
  //         })
  //       ),
  //     };
  //   }
  //   if (result.received_at) {
  //     result = {
  //       ...result,
  //       received_at: toISO(result.received_at),
  //     };
  //   }
  //   if (result.updated_at) {
  //     result = {
  //       ...result,
  //       updated_at: toISO(result.updated_at),
  //     };
  //   }
  //   if (payload.lender && payload.lender.length > 0) {
  //     result.lender = [{ _id: payload.lender }];
  //   } else {
  //     result.lender = [];
  //   }
  //   result = {
  //     data: _.omit(_.pickBy(result, _.identity), '_id'),
  //     s3_upload_key: result.properties.flatMap((item) => item.s3_upload_key),
  //   };
  //   // remove s3 upload key in properties
  //   if (result.data.properties) {
  //     result.data.properties = result.data.properties.map((item) => {
  //       return _.omit(item, 's3_upload_key');
  //     });
  //   }
  //   return result;
  // }

  async Create(payload) {
    runInAction(() => {
      this.actionLoading = true;
    });
    try {
      const resp = await AssetService.create(this.prepareAssetPayload(payload));
      return resp;
    } catch (error) {
      return Promise.reject(error);
    } finally {
      runInAction(() => {
        this.actionLoading = false;
      });
    }
  }

  async Update(id, payload) {
    runInAction(() => {
      this.actionLoading = true;
    });
    try {
      const resp = await AssetService.update(id, {
        data: _.pickBy(payload, _.identity),
      });
      // const resp = await new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     resolve();
      //   }, 1000);
      // });
      return resp;
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    } finally {
      runInAction(() => {
        this.actionLoading = false;
      });
    }
  }

  async UpdateProperties(id, payload) {
    runInAction(() => {
      this.actionLoading = true;
    });
    try {
      const resp = await AssetService.updateProperties(
        id,
        _.pickBy(
          {
            data: _.omit(this.currentProperty, ['_id', 'asset_id', 's3_upload_key']),
            s3_upload_key: this.currentProperty.s3_upload_key,
          },
          _.identity
        )
      );
      return resp;
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    } finally {
      runInAction(() => {
        this.actionLoading = false;
      });
    }
  }

  async GetAssets() {
    runInAction(() => {
      this.content_loading = true;
    });
    try {
      const resp = await AssetService.getAssets();
      runInAction(() => {
        this.assets = resp.data;
      });
      return resp;
    } catch (error) {
      this.assets = [];
    } finally {
      runInAction(() => {
        this.content_loading = false;
      });
    }
  }

  async GetDetail(assets_id) {
    runInAction(() => {
      this.content_loading = true;
    });
    try {
      const resp = await AssetService.getDetail({
        assets_id,
      });
      runInAction(() => {
        this.currentAsset = resp.data;
      });
    } catch (error) {
      return Promise.reject(error);
    } finally {
      runInAction(() => {
        this.content_loading = false;
      });
    }
  }
}
const AssetStore = new MainStore();
export default AssetStore;
