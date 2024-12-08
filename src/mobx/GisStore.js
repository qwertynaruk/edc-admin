import { task } from 'mobx-task';
import { action, observable } from 'mobx';
import axios from 'axios';
import fetch from 'axios/FetchMaster';
import DialogNotification from 'components/shared-components/DialogNotification';
import _ from 'lodash';
import A2O from 'utils/A2O';

const REDBOX_ROOT_ENDPOINT = 'https://asia-southeast2-tbit-udon-aml.cloudfunctions.net';

const GisStore = observable({
  pointOfInterestList: [],
  layerOverlayList: [],
  geoCodePoiList: [],
  geoCodeOverlayList: [],
  geoCodeIncidentList: [],
  geoCodeOndutyList: [],
  geoCodeCCTV: [],
  geoCodeExternalCCTV: [],
  geoCodeSOS: [],
  geoCodePartol: [],
  CCTVList: [],
  ExternalCCTVList: [],
  redboxList: [],
  partolList: [],
  redboxItemInfo: {},
  CCTVItemInfo: {},
  partolItemInfo: {},
  markerType: '',
  getPointOfInterestList: task(async () => {
    try {
      const _resp = await fetch.gis({ method: 'get', url: '/gis/point-interest' });

      const { data = {}, statusCode = 400 } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      GisStore.setPointOfInterestList(data);
      return Promise.resolve(_resp);
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setPointOfInterestList: action((_store) => (GisStore.pointOfInterestList = _store)),
  getLayerOverlayList: task(async () => {
    try {
      const _resp = await fetch.gis({ method: 'get', url: '/gis/map-overlay' });

      const { data = {}, statusCode = 400 } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      GisStore.setLayerOverlayList(data);
      return Promise.resolve(_resp);
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setLayerOverlayList: action((_store) => (GisStore.layerOverlayList = _store)),
  getCCTVList: task(async () => {
    try {
      const _resp = await fetch.gis({ method: 'get', url: '/gis/external-connection' });

      const { data = {}, statusCode = 400 } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      GisStore.setCCTVList(data);
      return Promise.resolve(_resp);
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setCCTVList: action((_store) => (GisStore.CCTVList = _store)),
  getExternalCCTVList: task(async () => {
    try {
      const _resp = await fetch.gis({ method: 'get', url: '/gis/list', params: { group: 'การเชื่อมต่อจากภายนอก' } });

      const { data = {}, statusCode = 400 } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      const { types = [] } = data;
      GisStore.setExternalCCTVList(types);
      return Promise.resolve(_resp);
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setExternalCCTVList: action((_store) => (GisStore.ExternalCCTVList = _store)),
  setCCTVItemInfo: action((_store) => {
    const { id = '' } = _store;
    GisStore.setMarkerType('cctv');
    GisStore.CCTVItemInfo = GisStore.CCTVList.find((uniq) => uniq._id === id);
  }),
  getRedboxList: task(async () => {
    try {
      const config = {
        method: 'get',
        url: 'https://asia-southeast2-tbit-udon-aml.cloudfunctions.net/GetRedboxList',
        headers: {
          Authorization: 'Basic YWRtaW5Ac2VjdXJpdHlwaXRjaC5jb206U2VjUEFkbWluMTE=',
        },
      };

      const _resp = await axios(config);

      const { data = [], status = 400 } = _resp.data;

      if (status !== 200) {
        return Promise.reject(status);
      }

      GisStore.setRedboxList(data);
      return Promise.resolve(_resp);
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setRedboxList: action((_store) => (GisStore.redboxList = _store)),
  getPartolList: task(async () => {
    try {
      const config = {
        method: 'get',
        url: 'https://asia-southeast2-tbit-udon-aml.cloudfunctions.net/GetPartolTracking',
        headers: {
          Authorization: 'Basic YWRtaW5Ac2VjdXJpdHlwaXRjaC5jb206U2VjUEFkbWluMTE=',
        },
      };

      const _resp = await axios(config);

      const { data = [], status = 400 } = _resp.data;

      if (status !== 200) {
        return Promise.reject(status);
      }

      GisStore.setPartolList(data);
      return Promise.resolve(_resp);
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setPartolList: action((_store) => {
    const newGeoCode = GisStore.geoCodePartol.map((ss) => ({
      ...ss,
      lat: _store.find((tx) => tx.id === ss.id).latitude,
      lng: _store.find((tx) => tx.id === ss.id).longitude,
      title: _store.find((tx) => tx.id === ss.id).id,
    }));

    GisStore.setGeoCodePartolList(newGeoCode);
    GisStore.partolList = _store;
  }),
  setPartolItemInfo: action((_store) => {
    const { id = '' } = _store;
    GisStore.setMarkerType('partol');
    GisStore.partolItemInfo = GisStore.partolList.find((uniq) => uniq.id === id);
  }),
  getRedboxItemInfo: task(async (itemId = '') => {
    try {
      const config = {
        method: 'get',
        url: `${REDBOX_ROOT_ENDPOINT}/GetRedboxEnvironmentInfo?id=${itemId}`,
        headers: {
          Authorization: 'Basic YWRtaW5Ac2VjdXJpdHlwaXRjaC5jb206U2VjUEFkbWluMTE=',
        },
      };

      const _resp = await axios(config);
      const { data = {}, status = 400 } = _resp.data;

      if (status !== 200) {
        return Promise.reject(status);
      }

      GisStore.setRedboxItemInfo(data);
      GisStore.setMarkerType('sos');
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setRedboxItemInfo: action((_store) => (GisStore.redboxItemInfo = _store)),
  getIncidenceMarker: task(async (types, date_types = null) => {
    try {
      const params = {
        types,
        date_types,
      };

      if (!date_types) {
        delete params.date_types;
      }

      const _resp = await fetch.gis({
        method: 'get',
        url: '/gis/scene-area',
        params,
      });

      const { data = {}, statusCode = 400 } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      if (types === 'แจ้งเบาะแส') {
        const _tx = data
          .filter((mm) => mm?.report_location?.location)
          .map((ss) => ({
            id: ss._id,
            group: 'incident',
            lat: A2O.CHECK_ANY_ARRAY(ss?.report_location?.location?.coordinates)
              ? ss?.report_location?.location?.coordinates[1]
              : 0.0,
            lng: A2O.CHECK_ANY_ARRAY(ss?.report_location?.location?.coordinates)
              ? ss?.report_location?.location?.coordinates[0]
              : 0.0,
            address: [
              `บ้านเลขที่ ${_.get(ss, "report_location['homeno-system']", '')}`,
              `หมู่ที่ ${_.get(ss, "report_location['homeno-system']", '')}`,
              `ซอย ${_.get(ss, "report_location['homeno-system']", '')}`,
              _.get(ss, "report_location['rd3-system']", ''),
              _.get(ss, "report_location['rd2-system']", ''),
              _.get(ss, "report_location['province-system']", ''),
              _.get(ss, "report_location['zipcode-system']", ''),
            ].join(' '),
            reportId: _.get(ss, 'report_record_id', '-'),
            detail: _.get(ss, 'report_detail.Description', '-'),
          }));
        GisStore.setGeoCodeIncidentList(_tx);
      }
      if (types === 'รายงานการปฏิบัติหน้าที่') {
        const _tx = data.map((ss) => ({
          id: ss._id,
          lat: A2O.CHECK_ANY_ARRAY(ss?.notification?.venue[0]?.location?.coordinates)
            ? ss?.notification?.venue[0]?.location?.coordinates[1]
            : 0.0,
          lng: A2O.CHECK_ANY_ARRAY(ss?.notification?.venue[0]?.location?.coordinates)
            ? ss?.notification?.venue[0]?.location?.coordinates[0]
            : 0.0,
          address: _.get(ss, 'notification.venue', ''),
          group: 'onduty',
          reportId: _.get(ss, 'report_record_id', '-'),
          detail: _.get(ss, 'notification.event_detail', _.get(ss, 'notification.event_name', '-')),
        }));

        GisStore.setGeoCodeOndutyList(_tx);
      }
      return Promise.resolve(_resp);
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  createPaths: task(async (payload = {}) => {
    try {
      const { group = '' } = payload;
      const _resp = await fetch.gis({
        method: 'post',
        url: '/gis',
        data: payload,
      });

      DialogNotification('success', 'สร้างรายการสำเร็จ');

      if (group === 'ซ้อนทับแผนที่') {
        GisStore.getLayerOverlayList();
      }

      if (group === 'จุดที่สนใจ') {
        GisStore.getPointOfInterestList();
      }

      return Promise.resolve(_resp);
    } catch (error) {
      DialogNotification('error', 'สร้างรายการไม่สำเร็จ');
      return Promise.reject(error);
    }
  }),
  updatePaths: task(async (payload = {}, gisId = '') => {
    try {
      const { group = '' } = payload;
      const _resp = await fetch.gis({
        method: 'put',
        url: '/gis',
        data: payload,
        params: {
          gis_id: gisId,
        },
      });

      DialogNotification('success', 'อัพเดทรายการสำเร็จ');

      if (group === 'ซ้อนทับแผนที่') {
        GisStore.getLayerOverlayList();
      }

      if (group === 'จุดที่สนใจ') {
        GisStore.getPointOfInterestList();
      }

      return Promise.resolve(_resp);
    } catch (error) {
      DialogNotification('error', 'อัพเดทรายการไม่สำเร็จ');
      return Promise.reject(error);
    }
  }),
  deletePaths: task(async (gisId = '') => {
    try {
      const _resp = await fetch.gis({
        method: 'delete',
        url: '/gis',
        params: {
          gis_id: gisId,
        },
      });

      DialogNotification('success', 'ลบการสำเร็จ');

      GisStore.getLayerOverlayList();
      GisStore.getPointOfInterestList();

      return Promise.resolve(_resp);
    } catch (error) {
      DialogNotification('error', 'ลบรายการไม่สำเร็จ');
      return Promise.reject(error);
    }
  }),
  setGeoCodePoiList: action((_store) => (GisStore.geoCodePoiList = _store)),
  setGeoCodeOverlayList: action((_store) => (GisStore.geoCodeOverlayList = _store)),
  setGeoCodeIncidentList: action((_store) => (GisStore.geoCodeIncidentList = _store)),
  setGeoCodeOndutyList: action((_store) => (GisStore.geoCodeOndutyList = _store)),
  setGeoCodeCCTVList: action((_store) => (GisStore.geoCodeCCTV = _store)),
  setGeoCodeExternalCCTVList: action((_store) => (GisStore.geoCodeExternalCCTV = _store)),
  setGeoCodeSOSList: action((_store) => (GisStore.geoCodeSOS = _store)),
  setGeoCodePartolList: action((_store) => (GisStore.geoCodePartol = _store)),
  clearGeoCodeList: action((_store) => {
    GisStore.geoCodePoiList = [];
    GisStore.geoCodeOverlayList = [];
    GisStore.geoCodeIncidentList = [];
    GisStore.geoCodeOndutyList = [];
    GisStore.geoCodeCCTV = [];
    GisStore.geoCodeExternalCCTV = [];
    GisStore.geoCodeSOS = [];
    GisStore.geoCodePartol = [];
  }),
  setMarkerType: action((_store) => (GisStore.markerType = _store)),
});

// AutoSave(GisStore, 'gis-store');

export default GisStore;
