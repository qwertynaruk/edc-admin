import fetchMaster from 'axios/FetchMaster';
import { sanitizeService } from 'utils/serviceHelper';

const fetch = sanitizeService(fetchMaster.main);

const GetModule = async (url, params) => {
  return fetch({ method: 'get', url, params });
};

const PostModule = async (url, payload) => {
  return fetch({
    method: 'post',
    url,
    data: payload,
  });
};
const PutModule = async (url, payload) => {
  return fetch({
    method: 'put',
    url,
    data: payload,
  });
};
const DeleteModule = async (url, params) => {
  return fetch({
    method: 'delete',
    url,
    params,
  });
};

const CaseService = {
  get_case_list: ({ permissions = false }) => GetModule(`/cases/list${!permissions ? '?permission=true' : ''}`),
  get_case_list_by_id: (case_id, involve_type, permissions = false) =>
    GetModule(
      `/cases?${!permissions ? 'permission=true&' : ''}case_id=${case_id}${
        involve_type ? `&involve_type=${involve_type}` : ''
      }`
    ),
  delete_case_by_id: (case_id) => DeleteModule(`/cases?case_id=${case_id}`),
  update_case: (case_id, payload) => PutModule(`/cases?case_id=${case_id}`, payload),
  post_case: (payload) => PostModule('/cases', payload),
  get_case_type: () => GetModule('/case_types'),
  get_case_type_detail: (case_type_id) => GetModule(`/case_types?case_type_id=${case_type_id}`),
  post_case_type: (payload) => PostModule('/case_types', payload),
  update_case_type: (case_type_id, payload) => PutModule(`/case_types?case_type_id=${case_type_id}`, payload),
  get_case_attachments: () => GetModule('/case_attachments'),
  create_case_attachments: (caseId, payload) => PostModule(`/case_attachments?case_id=${caseId}`, payload),
  get_case_involves: () => GetModule('/case_involves'),
  get_case_notes: () => GetModule('/case_notes'),
  create_case_notes: (payload) => PostModule('/case_notes', payload),
  update_case_notes: (payload, notes_id) => PutModule(`/case_notes?_id=${notes_id}`, payload),
  delete_case_notes: (notes_id) => DeleteModule(`/case_notes?case_note_id=${notes_id}`),
  get_case_status: () => GetModule('/case_status'),
  get_case_tasks: () => GetModule('/case_tasks'),
  update_case_tasks: (task_id, payload) => PutModule(`/tasks?task_id=${task_id}`, payload),
  create_case_tasks: (case_id, payload) => PostModule(`/case_tasks?case_id=${case_id}`, payload),
  get_warrants: () => GetModule('/warrants'),
  get_warrant_by_id: (_id) => GetModule(`/warrants?_id=${_id}`),
  create_warrants: (payload) => PostModule('/warrants', payload),
  update_warrants: (_id, payload) => PutModule(`/warrants?warrant_id=${_id}`, payload),
  delete_warrants: (_id, payload) => DeleteModule(`/warrants?warrant_id=${_id}`),
  getListStatus: () => GetModule(`/case_status`),
  deleteTaskCase: (_id) => DeleteModule(`/tasks?_id=${_id}`),
  getCaseReviews: (case_reviews_id) => GetModule(`/case_reviews?case_id=${case_reviews_id}`),
  createCaseReviews: (payload) => PostModule(`/case_reviews`, payload),
  addReportInvolves: (payload) => PostModule(`/case_report_involves/add`, payload),
  getAllWorkflows: () => GetModule(`/flows`),
  getWorkflows: (params) => GetModule(`/flows`, params),
  createWorkflows: (payload) => PostModule(`/flows`, payload),
  updateWorkflows: (flowId, payload) => PutModule(`/flows?_id=${flowId}`, payload),
  deleteWorkflows: (flowId) => DeleteModule(`/flows?_id=${flowId}`),
};

export default CaseService;
