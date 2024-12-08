/* eslint-disable camelcase */
import { action, observable } from 'mobx';

import DialogNotification from 'components/shared-components/DialogNotification';
import { MAX_API_LIMIT } from 'constants/ApiConstant';
import _ from 'lodash';
import fetch from 'axios/FetchMaster';
import stripEmptyField from 'utils/stripEmptyField';
import { task } from 'mobx-task';

export const CASE_STATUS = {
  PENDING: 'รอดำเนินการ',
  CANCEL: 'ยกเลิก',
};

const ReportStore = observable({
  typesAll: [],
  typesList: [],
  typesItems: {},
  reportList: [],
  reportListAll: [],
  reportItems: {},
  offenseCodeType: [],
  searchOffenseCodeList: [],
  reviewsList: [],
  departmentTypeList: [],
  propertieStorageList: [],
  reportInvolve: [],
  reportInvolveCase: [],
  reportInvolveReport: [],
  signatureList: [],
  sideMenuCurrent: { key: null, keyPath: [] },
  urlPdf: '',
  mapEvidenceStorage: (_element = []) =>
    ReportStore.propertieStorageList.length <= 0
      ? _element.map((_ps) => ({ id: _ps }))
      : _element.map((_ps) => ({
          ...(ReportStore.propertieStorageList.filter((qx) => qx._id === _ps).length > 0
            ? {
                id: _ps,
                ...(ReportStore.propertieStorageList.find((qx) => qx._id === _ps).parent_id
                  ? { parent_id: ReportStore.propertieStorageList.find((qx) => qx._id === _ps).parent_id }
                  : {}),
                storage_name: ReportStore.propertieStorageList.find((qx) => qx._id === _ps).storage_name,
              }
            : {
                id: _ps,
              }),
        })),
  setSideMenuCurrent: action((_store) => (ReportStore.sideMenuCurrent = _store)),
  setSignatureList: action((_store) => (ReportStore.signatureList = _store)),
  setFactorySideMenuCurrent: action(() => (ReportStore.sideMenuCurrent = { key: null, keyPath: [] })),
  getTypesList: task(async (groupType = '', isAll = false) => {
    try {
      const _resp = await fetch.incident_report({
        method: 'get',
        url: '/report_types',
        params: groupType
          ? {
              group_type: groupType,
            }
          : {},
      });

      const { statusCode = 400, data } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      if (isAll) {
        ReportStore.setTypesAll(data);
      } else {
        ReportStore.setTypesList(data);
      }

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setTypesList: action((_store) => (ReportStore.typesList = _store)),
  setTypesAll: action((_store) => (ReportStore.typesAll = _store)),
  getTypesItems: task(async (typesId = '') => {
    try {
      const _resp = await fetch.incident_report({
        method: 'get',
        url: '/report_types',
        params: {
          report_type_id: typesId,
        },
      });

      const { statusCode = 400, data } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      ReportStore.setTypesItems(data);
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setTypesItems: action((_store) => (ReportStore.typesItems = _store)),
  getDepartmentTypeList: task(async () => {
    try {
      const _resp = await fetch.incident_report({
        method: 'get',
        url: `/department_report_types`,
      });

      const { statusCode = 400, data } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      ReportStore.setDepartmentTypeList(data);
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setDepartmentTypeList: action((_store) => (ReportStore.departmentTypeList = _store)),
  getReportList: task(async (reportCate, query = {}) => {
    ReportStore.reportList = [];
    try {
      const _resp = await fetch.incident_report({
        method: 'get',
        url: '/report/list',
        params: {
          group_type: reportCate,
          limit: MAX_API_LIMIT,
          ...query,
        },
      });
      const { statusCode = 400, data, count } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      ReportStore.setReportList(data);
      return Promise.resolve({
        data,
        count,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setReportList: action((_store) => {
    // ReportStore.reportList = _store.filter((x) => {
    //   const isOwner = x.report_owner_id === _.get(UserStore, 'accessAuthen.auth_id');
    //   const isResponsible = x.report_responsible_id === _.get(UserStore, 'accessAuthen.auth_id');
    //   return isOwner || isResponsible;
    // });
    ReportStore.reportList = _store;
    ReportStore.reportItems = {};
  }),
  getAllReportList: task(async () => {
    const { _id = '' } = ReportStore.reportList;
    try {
      const _resp = await fetch.incident_report({
        method: 'get',
        url: '/report/list',
        params: {
          limit: MAX_API_LIMIT,
        },
      });
      const { statusCode = 400, data } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      ReportStore.setAllReportList(data.filter((ss) => ss._id !== _id));
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setAllReportList: action((_store) => (ReportStore.reportListAll = _store)),
  getReportItems: task(async (reportId) => {
    try {
      const resp = await fetch.incident_report({ method: 'get', url: `/report?report_id=${reportId}` });
      const { statusCode = 400, data } = resp;

      if (statusCode !== 200) {
        return Promise.reject(resp);
      }

      ReportStore.getTypesItems(_.get(data, '[0]report_type_id', ''));
      // new map data
      const dataDetail = _.get(data, '[0]', {});
      // report_detail.EventType
      const newMapData = {
        ...dataDetail,
        report_detail: {
          ...dataDetail.report_detail,
          officer_receiver: dataDetail.officer_receiver,
          concatenated_detail: dataDetail.concatenated_detail,
          order_time: dataDetail.order_time,
          arrived_time: dataDetail.arrived_time,
          total_arriving_time: dataDetail.total_arriving_time,
          action_officer: dataDetail.action_officer,
          incident_conclusion: dataDetail.incident_conclusion,
          report_channel: dataDetail.report_channel,
        },
        report_location: {
          ...dataDetail.report_location,
          // 'GoogleMap-system': [
          //   dataDetail.report_location['GoogleMap-system'].zone,
          //   dataDetail.report_location['GoogleMap-system'].latitude,
          //   dataDetail.report_location['GoogleMap-system'].longitude,
          // ],
          'GoogleMap-system': {
            zone: dataDetail.report_location['GoogleMap-system'].zone,
            latitude: dataDetail.report_location['GoogleMap-system'].latitude,
            longitude: dataDetail.report_location['GoogleMap-system'].longitude,
          },
          'latitude-system': dataDetail.report_location['GoogleMap-system'].latitude,
          'longitude-system': dataDetail.report_location['GoogleMap-system'].longitude,
          zone: dataDetail.report_location['GoogleMap-system'].zone,
        },
        reporter: {
          ...dataDetail.reporter,
          report_name: dataDetail.report_name,
        },
      };
      // newMapData.report_location['GoogleMap-system'] = {};
      ReportStore.setReportItems(newMapData);
      // ReportStore.setReportItems(data);

      if (_.get(data, '[0]is_exported', false)) {
        ReportStore.getUrlPDF(_.get(data, '[0]report_type_id', ''), _.get(data, '[0]report_record_id', ''));
      }

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setReportItems: action((_store) => (ReportStore.reportItems = _store)),
  getReportInvolve: task(async ({ reportId = '', involveType }) => {
    try {
      const _resp = await fetch.incident_report({
        method: 'get',
        url: '/report',
        params: {
          report_id: reportId,
          involve_type: involveType,
        },
      });
      const { statusCode = 400, data } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      ReportStore.setReportInvolve(involveType, data);
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setReportInvolve: action((involveType = '', _store) => {
    switch (involveType) {
      case 'case':
        ReportStore.reportInvolveCase = _store;
        break;

      case 'report':
        ReportStore.reportInvolveReport = _store;
        break;

      default:
        ReportStore.reportInvolve = _store;
        break;
    }
  }),
  createReport: task(async (payload) => {
    try {
      const _resp = await fetch.incident_report({ method: 'post', url: '/report', data: payload });
      const { statusCode = 400, report_id } = _resp;

      if (statusCode !== 200) {
        DialogNotification('error', 'ไม่สามารถสร้างรายการได้');
        return Promise.reject(statusCode);
      }

      DialogNotification('success', 'สร้างรายการสำเร็จ');
      return Promise.resolve(report_id);
    } catch (error) {
      DialogNotification('error', 'ไม่สามารถสร้างรายการได้');
      return Promise.reject(error);
    }
  }),
  createReportByCase: task(async (payload, case_id) => {
    try {
      const _resp = await fetch.main({
        method: 'post',
        url: '/case_report_involves',
        data: payload,
        params: { case_id },
      });
      const { statusCode = 400, report_id } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      DialogNotification('success', 'สร้างรายการสำเร็จ');
      return Promise.resolve(report_id);
    } catch (error) {
      DialogNotification('error', 'ไม่สามารถสร้างรายการได้');
      return Promise.reject(error);
    }
  }),
  createReportByReport: task(async (payload, reportId) => {
    try {
      const _resp = await fetch.incident_report({
        method: 'post',
        url: '/report_involve_reports',
        data: payload,
        params: { report_id: reportId },
      });
      const { statusCode = 400, report_id } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      DialogNotification('success', 'สร้างรายการสำเร็จ');
      return Promise.resolve(report_id);
    } catch (error) {
      DialogNotification('error', 'ไม่สามารถสร้างรายการได้');
      return Promise.reject(error);
    }
  }),
  addReportByReport: task(async (payload, origin = 'report') => {
    try {
      const _resp =
        origin === 'report'
          ? await fetch.incident_report({
              method: 'post',
              url: '/report_involve_reports/add/',
              data: payload,
            })
          : await fetch.main({
              method: 'post',
              url: '/case_report_involves/add/',
              data: payload,
            });

      const { statusCode = 400 } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      DialogNotification('success', 'เพิ่มรายงานที่เกี่ยวข้องสำเร็จ');
      return Promise.resolve(_resp);
    } catch (error) {
      DialogNotification('error', 'ไม่สามารถเพิ่มรายงานที่เกี่ยวข้องได้');
      return Promise.reject(error);
    }
  }),
  serviceReportUpdate: task(async (payload, _id) => {
    const proms = await fetch.incident_report({ method: 'put', url: `/report?report_id=${_id}`, data: payload });

    if (proms.statusCode !== 200) {
      return Promise.reject(proms.statusCode);
    }

    return Promise.resolve(proms);
  }),
  serviceReportUpdateMany: task(async (payload, _id) => {
    const proms = await fetch.incident_report({ method: 'put', url: `/report`, data: payload });

    if (proms.statusCode !== 200) {
      return Promise.reject(proms.statusCode);
    }

    return Promise.resolve(proms);
  }),
  updateReport: task(async (payload, _id) => {
    try {
      const currentData = ReportStore.reportItems;
      delete currentData.departments;
      delete currentData.created_at;
      delete currentData.updated_at;
      delete currentData._id;

      const _resp = await ReportStore.serviceReportUpdate({ ...currentData, ...payload }, _id);
      const { statusCode = 400 } = _resp;

      if (statusCode !== 200) {
        DialogNotification('error', 'บันทึกรายการไม่สำเร็จ');
        return Promise.reject(statusCode);
      }

      DialogNotification('success', 'บันทึกรายการสำเร็จ');
      return Promise.resolve(statusCode);
    } catch (error) {
      DialogNotification('error', 'บันทึกรายการไม่สำเร็จ');
      return Promise.reject(error);
    } finally {
      ReportStore.getReportItems(_id);
    }
  }),
  updateReportStatus: task(async (payload, _id) => {
    try {
      const currentData = ReportStore.reportItems;
      delete currentData.departments;
      delete currentData.created_at;
      delete currentData.updated_at;
      delete currentData._id;

      const _resp = await ReportStore.serviceReportUpdate({ ...currentData, ...payload }, _id);
      const { statusCode = 400 } = _resp;

      if (statusCode !== 200) {
        DialogNotification('error', 'ระบบขัดข้อง', 'ไม่สามารถดำเนินรายการนี้ได้');
        return Promise.reject(statusCode);
      }

      DialogNotification('success', 'เปลี่ยน "สถานะ" ในรายงานนี้เสร็จสิ้น');
      return Promise.resolve(statusCode);
    } catch (error) {
      DialogNotification('error', 'ระบบขัดข้อง', 'ไม่สามารถดำเนินรายการนี้ได้');
      return Promise.reject(error);
    } finally {
      ReportStore.getReportItems(_id);
    }
  }),
  sendComment: task(async (payload = [], selfData) => {
    const { _id } = selfData;
    try {
      const newPayload = payload.map((ss) => ({
        ...ss,
      }));

      delete newPayload.s3_upload_key;
      delete selfData._id;

      const _resp = await ReportStore.serviceReportUpdate(
        {
          ...selfData,
          comments: newPayload,
        },
        _id
      );
      const { statusCode = 400 } = _resp;
      // const statusCode = 201;

      if (statusCode !== 200) {
        DialogNotification('error', 'ขออภัย ระบบขัดข้อง');
        return Promise.reject(statusCode);
      }

      return Promise.resolve(statusCode);
    } catch (error) {
      DialogNotification('error', 'ขออภัย ระบบขัดข้อง');
      return Promise.reject(error);
    } finally {
      ReportStore.getReportItems(_id);
    }
  }),
  getOffenseCodeType: task(async () => {
    try {
      const _resp = await fetch.incident_report({ method: 'get', url: `/offense_types` });
      const { statusCode = 400, data } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      ReportStore.setOffenseCodeType(data);
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setOffenseCodeType: action((_store) => (ReportStore.offenseCodeType = _store)),
  searchOffenseCode: task(async (payload) => {
    try {
      const { category = undefined, legal_provision = undefined, plaint = undefined, type = undefined } = payload;
      const newPayload = {
        data_type: 'offense_code',
        search_type: 'advance',
        search_parameters: stripEmptyField({
          law_type: type,
          law_name: legal_provision,
          category,
          plaint,
        }),
      };

      const _resp = await fetch.advanceSearch({
        method: 'post',
        url: `/search`,
        data: newPayload,
      });
      const { statusCode = 400, data } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      ReportStore.setSearchOffenseCodeList(data);
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setSearchOffenseCodeList: action((_store) => (ReportStore.searchOffenseCodeList = _store)),
  createReviews: task(async (payload) => {
    try {
      const { _id = '', report_owner_id = '' } = ReportStore.reportItems;
      const _resp = await fetch.incident_report({
        method: 'post',
        url: '/report_reviews',
        data: { report_id: _id, created_by: report_owner_id, ...payload },
      });
      const { statusCode = 400, report_id } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      DialogNotification('success', 'บันทึกรายการสำเร็จ');
      return Promise.resolve(report_id);
    } catch (error) {
      DialogNotification('error', 'บันทึกรายการไม่สำเร็จ');
      return Promise.reject(error);
    }
  }),
  getReviews: task(async (reportId) => {
    try {
      const _resp = await fetch.incident_report({
        method: 'get',
        url: `/report_reviews`,
        params: { report_id: reportId },
      });
      const { statusCode = 400, data } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      ReportStore.setReviews(data);
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setReviews: action((_store) => (ReportStore.reviewsList = _store)),
  getPropertieStorageList: task(async () => {
    try {
      const _resp = await fetch.evidence({
        method: 'get',
        url: `/evidence/property/storage/list_frontend`,
        params: { limit: 10000 },
      });
      const { statusCode = 400, data } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      ReportStore.setPropertieStorageList(data);
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setPropertieStorageList: action((_store) => (ReportStore.propertieStorageList = _store)),
  verifyCaseNumber: task(async (payload) => {
    try {
      const { case_id = '', case_year = '', case_type = '' } = payload;
      const _resp = await fetch.incident_report({
        method: 'get',
        url: '/report',
        params: { case_id, case_year, case_type },
      });
      const { statusCode = 400, data } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(_resp);
      }

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  verifyEvidenceNumber: task(async (params) => {
    try {
      const _resp = await fetch.evidence({
        method: 'get',
        url: '/evidence/list',
        params,
      });
      const { statusCode = 400, data = [] } = _resp;

      if (statusCode !== 200 || data?.length > 0) {
        return Promise.reject(_resp);
      }

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  createEvidenceUpsert: task(async (payload) => {
    try {
      const _resp = await fetch.evidence({
        method: 'post',
        url: '/evidence/upsert',
        data: { data: payload },
      });
      const { statusCode = 400 } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      DialogNotification('success', 'เพิ่มรายการยึดทรัพย์สำเร็จ');
      return Promise.resolve(_resp);
    } catch (error) {
      DialogNotification('error', 'ไม่สามารถเพิ่มรายการยึดทรัพย์ได้');
      return Promise.reject(error);
    }
  }),
  updateEvidenceUpsert: task(async (evidenceId, payload) => {
    try {
      const _resp = await fetch.evidence({
        method: 'put',
        url: '/evidence/upsert',
        params: { evidence_id: evidenceId },
        data: { data: payload },
      });
      const { statusCode = 400 } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      return Promise.resolve(_resp);
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  createSignPKI: task(async (payload) => {
    const { report_record_id = '', report_type_id = '', _id = '' } = ReportStore.reportItems;
    try {
      const _resp = await fetch.upload({
        method: 'post',
        url: '/sign-pdf',
        data: {
          report_type_id,
          report_id: _id,
          expired_in: 3600,
          report_record_id,
          data: payload.replace('data:application/pdf;filename=generated.pdf;base64,', ''),
        },
      });
      const { statusCode = 400, url = '' } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      DialogNotification('success', 'ลงทะเบียนเทคโนโลยีระบบรหัสสำเร็จ');
      return Promise.resolve(url);
    } catch (error) {
      DialogNotification('error', 'ไม่สามารถลงทะเบียนเทคโนโลยีระบบรหัสได้');
      return Promise.reject(error);
    }
  }),
  createVerifyPKI: task(async (payload) => {
    try {
      const _resp = await fetch.upload({
        method: 'post',
        url: '/verify-pdf',
        data: {
          data: payload.replace('data:application/pdf;base64,', ''),
        },
      });
      const { statusCode = 400 } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      DialogNotification('success', 'สำเร็จ');
      return Promise.resolve(_resp);
    } catch (error) {
      DialogNotification('error', 'ไม่สำเร็จ');
      return Promise.reject(error);
    }
  }),
  createDirectEmail: task(async (payload) => {
    const { report_record_id = '', report_type_id = '', _id = '' } = ReportStore.reportItems;
    try {
      const _resp = await fetch.incident_report({
        method: 'post',
        url: '/report/send_email',
        data: {
          ...payload,
          report_type_id,
          report_record_id,
        },
      });
      const { statusCode = 400 } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      DialogNotification('success', 'ส่งอีเมลล์สำเร็จ');
      return Promise.resolve(_resp);
    } catch (error) {
      DialogNotification('error', 'ไม่สามารถดำเนินรายการนี้ได้');
      return Promise.reject(error);
    }
  }),
  getUrlPDF: task(async (report_type_id, report_record_id) => {
    try {
      const _resp = await fetch.incident_report({
        method: 'get',
        url: '/report/s3_url',
        params: {
          report_type_id,
          report_record_id,
        },
      });
      const { statusCode = 400 } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(statusCode);
      }

      ReportStore.setUrlPDF(_resp?.message);
      return Promise.resolve(_resp);
    } catch (error) {
      // DialogNotification('error', 'ไม่สามารถดำเนินรายการนี้ได้');
      return Promise.reject(error);
    }
  }),
  setUrlPDF: action((_store) => (ReportStore.urlPdf = _store)),
  searchReport: task(async (params) => {
    try {
      const _resp = await fetch.advanceSearch({
        method: 'get',
        url: '/search_report',
        params,
      });
      const { statusCode = 400, data = [] } = _resp;

      if (statusCode !== 200) {
        return Promise.reject(_resp);
      }

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }),
});

// AutoSave(ReportStore, 'report-store-v2');

export default ReportStore;
