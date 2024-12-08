import { action, observable } from 'mobx';
import { task } from 'mobx-task';
import fetch from 'axios/FetchMaster';
import _ from 'lodash';

const MasterAttributeStore = observable({
  attributeTypes: [],
  attributeItems: [],
  attributeItemsTotal: 10,
  getAttributeTypes: task(async () => {
    try {
      const _resp = await fetch.system_admin({
        method: 'get',
        url: '/attribute_types',
      });

      const { statusCode = 400, data } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      MasterAttributeStore.setAttributeTypes(data);
      return Promise.resolve(statusCode);
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setAttributeTypes: action((_store) => (MasterAttributeStore.attributeTypes = _store)),
  getAttributeItems: task(async (categoryId = '', nativeRefresh = false, otherParams = null) => {
    if (nativeRefresh) {
      MasterAttributeStore.setAttributeItems([]);
    }
    try {
      const _resp = await fetch.system_admin({
        method: 'get',
        url: '/attributes',
        params: {
          attribute_type_id: _.parseInt(categoryId),
          ...otherParams,
        },
      });

      const { statusCode = 400, data } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      MasterAttributeStore.setAttributeItems(data);
      MasterAttributeStore.setAttributeItemsTotal(_resp?.count || 10);
      return Promise.resolve(statusCode);
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setAttributeItems: action((_store) => (MasterAttributeStore.attributeItems = _store)),
  setAttributeItemsTotal: action((_store) => (MasterAttributeStore.attributeItemsTotal = _store)),
});

export default MasterAttributeStore;
