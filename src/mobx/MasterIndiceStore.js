import { task } from 'mobx-task';
import { action, observable } from 'mobx';
import fetch from 'axios/FetchMaster';
import DialogNotification from 'components/shared-components/DialogNotification';
import { AutoSave } from './AutoSave';
import _ from 'lodash';
import GenerateAddress from 'components/shared-components/GenerateAddress';
import FormPreference from 'utils/FormPreference';

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

const initialPerson = {
  personList: [],
  personItems: null,
  personalRelationItems: [],
  getPerson: task(async () => {
    try {
      const _resp = await fetch.master_indices({ method: 'get', url: '/person/list' });
      const { statusCode = 400, data } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      initialPerson.setPerson(data);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setPerson: action((_store) => {
    const newStore = _store.map((ss) => {
      const { is_juristic = false, juristic_name = '', profile_person_data = '' } = ss;
      return {
        ...ss,
        profile_fullname: is_juristic ? juristic_name : <FormPreference.ComplexFullname payload={ss} />,
        profile_person_data: is_juristic ? 'นิติบุคคล' : profile_person_data,
      };
    });
    MasterIndiceStore.personList = newStore;
  }),
  getPersonItems: task(async (itemId = '') => {
    try {
      const _resp = await fetch.master_indices({ method: 'get', params: { person_id: itemId }, url: '/person/detail' });
      const { statusCode = 400, data } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      initialPerson.setPersonItems(data);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setPersonItems: action((_store) => (MasterIndiceStore.personItems = _store)),
  getPersonRelation: task(async (itemId = '', involveType = '') => {
    if (involveType === 'place') {
      return Promise.resolve();
    }

    try {
      const _resp = await fetch.master_indices({
        method: 'get',
        params: { person_id: itemId, involve_type: involveType },
        url: '/person/detail',
      });
      const { statusCode = 400, data } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      initialPerson.setPersonRelation(data);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setPersonRelation: action((_store) => (MasterIndiceStore.personalRelationItems = _store)),
  createPerson: task(async (_payload = {}) => {
    try {
      const _resp = await fetch.master_indices({ method: 'post', url: '/person', data: _payload });

      const { statusCode = 400, _id = '' } = _resp;

      if (statusCode === 200) {
        initialPerson.getPerson();
        DialogNotification('success', 'เพิ่มข้อมูลสำเร็จ');
        return Promise.resolve(_id);
      } else {
        inFecthLogStatus(statusCode);
        return Promise.reject(statusCode);
      }
    } catch (error) {
      DialogNotification('error', 'เพิ่มข้อมูลไม่สำเร็จ');
      return Promise.reject(error);
    }
  }),
  updatePerson: task(async (_payload = {}, itemId = '', reload = true) => {
    try {
      const _resp = await fetch.master_indices({
        method: 'put',
        url: '/person',
        params: { _id: itemId },
        data: _payload,
      });

      const { statusCode = 400 } = _resp;

      if (statusCode === 200) {
        if (reload) initialPerson.getPersonItems(itemId);
        DialogNotification('success', 'บันทึกรายการสำเร็จ');
        return Promise.resolve(_resp);
      } else {
        inFecthLogStatus(statusCode);
        return Promise.reject(statusCode);
      }
    } catch (error) {
      DialogNotification('error', 'บันทึกรายการไม่สำเร็จ');
      return Promise.reject(error);
    }
  }),
};

const initialVehicle = {
  vehicleList: [],
  vehicleItems: null,
  vehicleRelationItems: [],
  getVehicle: task(async () => {
    try {
      const _resp = await fetch.master_indices({ method: 'get', url: '/vehicle/list' });
      const { statusCode = 400, data } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      initialVehicle.setVehicle(data);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setVehicle: action((_store) => (MasterIndiceStore.vehicleList = _store)),
  getVehicleItems: task(async (itemId = '') => {
    try {
      const _resp = await fetch.master_indices({
        method: 'get',
        params: { _id: itemId },
        url: '/vehicle/detail',
      });
      const { statusCode = 400, data } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      initialVehicle.setVehicleItems(data);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setVehicleItems: action((_store) => (MasterIndiceStore.vehicleItems = _store)),
  getVehicleRelation: task(async (itemId = '', involveType = '') => {
    try {
      const _resp = await fetch.master_indices({
        method: 'get',
        params: { _id: itemId, involve_type: involveType },
        url: '/vehicle/detail',
      });
      const { statusCode = 400, data } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      initialVehicle.setVehicleRelation(data);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setVehicleRelation: action((_store) => (MasterIndiceStore.vehicleRelationItems = _store)),
  createVehicle: task(async (_payload = {}) => {
    try {
      const _resp = await fetch.master_indices({ method: 'post', url: '/vehicle', data: _payload });

      const { statusCode = 400, _id = '' } = _resp;

      if (statusCode === 200) {
        initialVehicle.getVehicle();
        DialogNotification('success', 'เพิ่มข้อมูลสำเร็จ');
        return Promise.resolve(_id);
      } else {
        inFecthLogStatus(statusCode);
        return Promise.reject(statusCode);
      }
    } catch (error) {
      DialogNotification('error', 'เพิ่มข้อมูลไม่สำเร็จ');
      return Promise.reject(error);
    }
  }),
  updateVehicle: task(async (_payload = {}, itemId = '') => {
    try {
      const _resp = await fetch.master_indices({
        method: 'put',
        url: '/vehicle',
        params: { _id: itemId },
        data: _payload,
      });

      const { statusCode = 400 } = _resp;

      if (statusCode === 200) {
        initialVehicle.getVehicleItems(itemId);
        DialogNotification('success', 'บันทึกรายการสำเร็จ');
        return Promise.resolve(_resp);
      } else {
        inFecthLogStatus(statusCode);
        return Promise.reject(statusCode);
      }
    } catch (error) {
      DialogNotification('error', 'บันทึกรายการไม่สำเร็จ');
      return Promise.reject(error);
    }
  }),
};

const initialProperty = {
  propertyList: [],
  propertyItems: null,
  propertyRelationItems: [],
  getProperty: task(async () => {
    const propertySelectType = {
      drug: 'ยาเสพติด',
      firearm: 'อาวุธ',
      other: 'อื่น ๆ',
    };

    const selectStatus = (elem) => {
      const notNull = _.get(elem, 'status_of_property', []) || [];
      if (notNull.length > 0) {
        const _shift = notNull[notNull.length - 1];
        return _.get(_shift, 'status', '-');
      } else {
        return '-';
      }
    };

    try {
      const _resp = await fetch.master_indices({ method: 'get', url: '/prop/list' });
      const { statusCode = 400, data = [] } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      initialProperty.setProperty(
        data.map((ss) => ({
          ...ss,
          asset_type: propertySelectType[ss.asset_type],
          status_of_property: selectStatus(ss),
        }))
      );
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setProperty: action((_store) => (MasterIndiceStore.propertyList = _store)),
  getPropertyItems: task(async (itemId = '') => {
    try {
      const _resp = await fetch.master_indices({
        method: 'get',
        params: { _id: itemId },
        url: '/prop/detail',
      });
      const { statusCode = 400, data } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      initialProperty.setPropertyItems(data);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setPropertyItems: action((_store) => (MasterIndiceStore.propertyItems = _store)),
  getPropertyRelation: task(async (itemId = '', involveType = '') => {
    try {
      const _resp = await fetch.master_indices({
        method: 'get',
        params: { _id: itemId, involve_type: involveType },
        url: '/prop/detail',
      });
      const { statusCode = 400, data } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      initialProperty.setPropertyRelation(data);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setPropertyRelation: action((_store) => (MasterIndiceStore.propertyRelationItems = _store)),
  createProperty: task(async (_payload = {}, propertyGroup = 'other') => {
    try {
      const _resp = await fetch.master_indices({ method: 'post', url: `/prop/${propertyGroup}`, data: _payload });

      const { statusCode = 400, _id = '' } = _resp;

      if (statusCode === 200) {
        initialProperty.getProperty();
        DialogNotification('success', 'เพิ่มข้อมูลสำเร็จ');
        return Promise.resolve(_id);
      } else {
        inFecthLogStatus(statusCode);
        return Promise.reject(statusCode);
      }
    } catch (error) {
      DialogNotification('error', 'เพิ่มข้อมูลไม่สำเร็จ');
      return Promise.reject(error);
    }
  }),
  updateProperty: task(async (_payload = {}, itemId = '') => {
    try {
      const _resp = await fetch.master_indices({
        method: 'put',
        url: '/prop',
        params: { _id: itemId },
        data: _payload,
      });

      const { statusCode = 400 } = _resp;

      if (statusCode === 200) {
        initialProperty.getPropertyItems(itemId);
        DialogNotification('success', 'บันทึกรายการสำเร็จ');
        return Promise.resolve(_resp);
      } else {
        inFecthLogStatus(statusCode);
        return Promise.reject(statusCode);
      }
    } catch (error) {
      DialogNotification('error', 'บันทึกรายการไม่สำเร็จ');
      return Promise.reject(error);
    }
  }),
};

const initialPlace = {
  placeList: [],
  placeDetailItem: {},
  getPlace: task(async () => {
    try {
      const _resp = await fetch.gis({ method: 'get', url: '/gis/zone/list' });
      const { statusCode = 400, data } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      initialPlace.setPlace(data);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setPlace: action((_store) => {
    MasterIndiceStore.placeList = _store;
  }),
  getPlaceDetail: task(async (zoneId) => {
    try {
      const _resp = await fetch.gis({ method: 'get', url: '/gis/zone', params: { zone_id: zoneId } });
      const { statusCode = 400, data } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      initialPlace.setPlaceDetail(data);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setPlaceDetail: action((_store) => {
    MasterIndiceStore.placeDetailItem = _store;
  }),
};

const initialLocation = {
  locationList: [],
  locationItems: null,
  locationRelationItems: [],
  placeAreaList: [],
  getLocation: task(async () => {
    try {
      const _resp = await fetch.master_indices({ method: 'get', url: '/location/list' });
      const { statusCode = 400, data } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      initialLocation.setLocation(data.map((ss) => ({ ...ss, co_address: GenerateAddress(ss) })));
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setLocation: action((_store) => {
    MasterIndiceStore.locationList = _store;
  }),
  getLocationItems: task(async (itemId = '') => {
    try {
      const _resp = await fetch.master_indices({
        method: 'get',
        params: { _id: itemId },
        url: '/location',
      });
      const { statusCode = 400, data } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      initialLocation.setLocationItems(data);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setLocationItems: action((_store) => (MasterIndiceStore.locationItems = _store)),
  getLocationRelation: task(async (itemId = '', involveType = '') => {
    try {
      const _resp = await fetch.master_indices({
        method: 'get',
        params: { _id: itemId, involve_type: involveType },
        url: '/location',
      });
      const { statusCode = 400, data } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      initialLocation.setLocationRelation(data);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setLocationRelation: action((_store) => (MasterIndiceStore.locationRelationItems = _store)),
  createLocationPayload: (payload) => {
    return {
      ...payload,
      location: {
        type: 'Point',
        coordinates: [payload.longitude, payload.latitude],
      },
    };
  },
  createLocation: task(async (_payload = {}) => {
    try {
      const _resp = await fetch.master_indices({
        method: 'post',
        url: '/location',
        data: initialLocation.createLocationPayload(_payload),
      });

      const { statusCode = 400, _id = '' } = _resp;

      if (statusCode === 200) {
        initialLocation.getLocation();
        DialogNotification('success', 'เพิ่มข้อมูลสำเร็จ');
        return Promise.resolve(_id);
      } else {
        inFecthLogStatus(statusCode);
        return Promise.reject(statusCode);
      }
    } catch (error) {
      DialogNotification('error', 'เพิ่มข้อมูลไม่สำเร็จ');
      return Promise.reject(error);
    }
  }),
  updateLocation: task(async (_payload = {}, itemId = '') => {
    try {
      const _resp = await fetch.master_indices({
        method: 'put',
        url: '/location',
        params: { _id: itemId },
        data: initialLocation.createLocationPayload(_payload),
      });

      const { statusCode = 400 } = _resp;

      if (statusCode === 200) {
        initialLocation.getLocationItems(itemId);
        DialogNotification('success', 'บันทึกรายการสำเร็จ');
        return Promise.resolve(_resp);
      } else {
        inFecthLogStatus(statusCode);
        return Promise.reject(statusCode);
      }
    } catch (error) {
      DialogNotification('error', 'บันทึกรายการไม่สำเร็จ');
      return Promise.reject(error);
    }
  }),
  getPlaceAreaList: task(async (lat = '', lng = '') => {
    try {
      const _resp = await fetch.master_indices({
        method: 'get',
        url: '/location/patrol_area',
        params: { lat, lng },
      });
      const { statusCode = 400, data } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      initialLocation.setPlaceAreaList(data);
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setPlaceAreaList: action((_store) => (MasterIndiceStore.placeAreaList = _store)),
};

const initialOrganization = {
  organizationList: [],
  organizationItems: null,
  organizationRelationItems: [],
  getOrganization: task(async () => {
    try {
      const _resp = await fetch.master_indices({ method: 'get', url: '/org/list' });
      const { statusCode = 400, data } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      initialOrganization.setOrganization(data);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setOrganization: action((_store) => (MasterIndiceStore.organizationList = _store)),
  getOrganizationItems: task(async (itemId = '') => {
    try {
      const _resp = await fetch.master_indices({
        method: 'get',
        params: { _id: itemId },
        url: '/org',
      });
      const { statusCode = 400, data } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      initialOrganization.setOrganizationItems(data);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setOrganizationItems: action((_store) => (MasterIndiceStore.organizationItems = _store)),
  getOrganizationRelation: task(async (itemId = '', involveType = '') => {
    try {
      const _resp = await fetch.master_indices({
        method: 'get',
        params: { _id: itemId, involve_type: involveType },
        url: '/org',
      });
      const { statusCode = 400, data } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      initialOrganization.setOrganizationRelation(data);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setOrganizationRelation: action((_store) => (MasterIndiceStore.organizationRelationItems = _store)),
  createOrganization: task(async (_payload = {}) => {
    try {
      const _resp = await fetch.master_indices({ method: 'post', url: '/org', data: _payload });

      const { statusCode = 400, _id = '' } = _resp;

      if (statusCode === 200) {
        initialOrganization.getOrganization();
        DialogNotification('success', 'เพิ่มข้อมูลสำเร็จ');
        return Promise.resolve(_id);
      } else {
        inFecthLogStatus(statusCode);
        return Promise.reject(statusCode);
      }
    } catch (error) {
      DialogNotification('error', 'เพิ่มข้อมูลไม่สำเร็จ');
      return Promise.reject(error);
    }
  }),
  updateOrganization: task(async (_payload = {}, itemId = '') => {
    try {
      const _resp = await fetch.master_indices({
        method: 'put',
        url: '/org',
        params: { _id: itemId },
        data: _payload,
      });

      const { statusCode = 400 } = _resp;

      if (statusCode === 200) {
        initialOrganization.getOrganizationItems(itemId);
        DialogNotification('success', 'บันทึกรายการสำเร็จ');
        return Promise.resolve(_resp);
      } else {
        inFecthLogStatus(statusCode);
        return Promise.reject(statusCode);
      }
    } catch (error) {
      DialogNotification('error', 'บันทึกรายการไม่สำเร็จ');
      return Promise.reject(error);
    }
  }),
};

const initVisualization = {
  visualizeDataSource: {},
  getVisualizeDataSource: task(async (itemId = '', typeId = '') => {
    try {
      const _resp = await fetch.master_indices({
        method: 'get',
        url: '/graph_relation',
        params: { _id: itemId, type_id: typeId },
      });

      const { statusCode = 400, data = {} } = _resp;

      if (statusCode === 200) {
        initVisualization.setVisualizeDataSource(data);
        return Promise.resolve(_resp);
      } else {
        return Promise.reject(statusCode);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setVisualizeDataSource: action((_store) => (MasterIndiceStore.visualizeDataSource = _store)),
};

const MasterIndiceStore = observable({
  ...initialPerson,
  ...initialVehicle,
  ...initialProperty,
  ...initialPlace,
  ...initialLocation,
  ...initialOrganization,
  ...initVisualization,
});

AutoSave(MasterIndiceStore, 'master-indices');

export default MasterIndiceStore;
