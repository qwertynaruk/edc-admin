import { useMutation, useQuery } from '@tanstack/react-query';

import fetch from 'axios/FetchMaster';
import { sanitizeService } from 'utils/serviceHelper';

const incidentReport = sanitizeService(fetch.incident_report);
const incidentReporting = sanitizeService(fetch.incident_reporting);
const main = sanitizeService(fetch.main);
const downloadUploadS3 = sanitizeService(fetch.upload);
const logApi = sanitizeService(fetch.log);

const ReportService = {
  getTypes: async (groupType) => {
    return incidentReport({
      method: 'get',
      url: `/report_types?group_type=${groupType}`,
    });
  },
  getTypesGeneral: async () => {
    return incidentReport({
      method: 'get',
      url: `/report_types`,
    });
  },
  getOffenseCode: async () => {
    return incidentReporting({
      method: 'get',
      url: '/offense_codes',
    });
  },
  getOffenseCodeDetail: async (_id) => {
    return incidentReport({
      method: 'get',
      url: `/offense_codes?_id=${_id}`,
    });
  },
  getOffenseCodeType: async (_id) => {
    try {
      const resp = await fetch.incident_report({
        method: 'get',
        url: `/offense_types`,
      });
      return resp;
    } catch (error) {
      return error.response.data;
    }
  },

  CreateOffenseCode: async (payload) => {
    return incidentReport({
      method: 'post',
      url: 'offense_codes',
      data: payload,
    });
  },

  UpdateOffenseCode: async (payload, _id) => {
    return incidentReport({
      method: 'put',
      url: `offense_codes?_id=${_id}`,
      data: payload,
    });
  },
  getTypeDetail: async (_id) => {
    return incidentReport({
      method: 'get',
      url: `/report_types?report_type_id=${_id}`,
    });
  },
  getReport: async (reportCate) => {
    return incidentReport({
      method: 'get',
      url: '/report/list',
      params: {
        group_type: reportCate,
      },
    });
  },
  getReportById: async (reportId) => {
    return incidentReport({
      method: 'get',
      url: `/report?report_id=${reportId}`,
    });
  },
  createReport: async (payload) => {
    return incidentReport({
      method: 'post',
      url: '/report',
      data: payload,
    });
  },
  createReportByCase: async (payload, case_id) => {
    return main({
      method: 'post',
      url: '/case_report_involves',
      data: payload,
      params: {
        case_id,
      },
    });
  },
  createReportType: async (payload) => {
    return incidentReport({
      method: 'post',
      url: `/report_types`,
      data: payload,
    });
  },
  updateReport: async (payload, _id) => {
    return incidentReport({
      method: 'put',
      url: `/report?report_id=${_id}`,
      data: payload,
    });
  },
  updateReportType: async (payload, _id) => {
    return incidentReport({
      method: 'put',
      url: `/report_types?report_type_id=${_id}`,
      data: payload,
    });
  },
  createCaseReport: async (payload, _id) => {
    return incidentReport({
      method: 'post',
      url: `/report_involve_cases?report_id=${_id}`,
      data: payload,
    });
  },
  getAllReport: async () => {
    return incidentReport({
      method: 'get',
      url: `/report/list?limit=99999`,
    });
  },
  getWebformList: async (options = {}) => {
    return incidentReport({
      method: 'get',
      url: '/webform/list',
      ...options,
    });
  },
  getDetailWebFromReport: async (webFormId) => {
    return incidentReport({
      method: 'get',
      url: `/webform?webform_id=${webFormId}`,
    });
  },
  updateDetailWebFromReport: async (webFormId, data) => {
    return incidentReport({
      method: 'put',
      url: `/webform?webform_id=${webFormId}`,
      data: { data },
    });
  },
  deleteDetailWebFromReport: async (webFormId) => {
    return incidentReport({
      method: 'delete',
      url: `/webform?webform_id=${webFormId}`,
    });
  },
  createWebFromReport: async (data) => {
    return incidentReport({
      method: 'post',
      url: `/webform`,
      data: { data },
    });
  },
  usePresignedUpload: (props) => {
    return useMutation({
      mutationFn: async (payload = {}) => {
        return await downloadUploadS3({
          method: 'POST',
          url: `/s3/${props?.type}`,
          params: props?.queryParams,
          data: payload,
        });
      },
    });
  },
  useUpdateForwardReport: () => {
    return useMutation({
      mutationFn: async (params = {}) => {
        const response = await incidentReport({
          method: 'PUT',
          url: '/report/transfer',
          params,
          data: params,
        });
        return response?.response?.data || null;
      },
      // onSuccess: (data) => {
      //   // console.log('data', data);
      // },
    });
  },
  useGetLogReportForwardList: (props) => {
    return useQuery({
      queryKey: ['call-report-log-list', props?.queryParams],
      queryFn: async () => {
        const response = await logApi({
          method: 'GET',
          url: '/audit_log/report_transfer/list',
          params: props?.queryParams,
        });
        return response?.response || null;
      },
    });
  },
  useUpdateReportStatus: (props) => {
    return useMutation({
      mutationFn: async (payload = {}) => {
        const response = await incidentReport({
          method: 'PUT',
          url: '/report/update_status',
          params: props?.queryParams,
          data: payload,
        });
        return response?.response?.data || null;
      },
      onSuccess: (data) => {
        // console.log('data', data);
      },
    });
  },
};

export default ReportService;
