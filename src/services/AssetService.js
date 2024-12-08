import fetch from 'axios/FetchMaster';
import { sanitizeService } from 'utils/serviceHelper';

const asset = sanitizeService(fetch.asset);
const AssetService = {
  create: (data) => {
    return asset({
      method: 'post',
      url: '/assets',
      data,
    });
  },

  getAssets: async (
    options = {
      params: {
        page: 1,
        limit: 10,
      },
    }
  ) => {
    const { params, data } = options;
    return asset({
      method: 'get',
      url: '/assets/list',
      params,
      data,
    });
  },

  getDetail: async (params) => {
    return asset({
      method: 'get',
      url: '/assets',
      params,
    });
  },

  update: (assetsId, data) => {
    return asset({
      method: 'put',
      url: '/assets',
      params: { assets_id: assetsId },
      data,
    });
  },

  updateProperties: (assetsPropId, data) => {
    return asset({
      method: 'PUT',
      url: '/assets/properties',
      params: { assets_prop_id: assetsPropId },
      data,
    });
  },

  updateListAssetProperties: async (data, _id) => {
    return asset({
      method: 'put',
      url: `/assets/properties`,
      params: { assets_prop_id: _id },
      data,
    });
  },

  updateListAsset: async (payload, _id) => {
    return asset({
      method: 'put',
      url: `/assets`,
      params: { assets_id: _id },
      data: payload,
    });
  },
};

export default AssetService;
