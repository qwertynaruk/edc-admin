import fetchMaster from 'axios/FetchMaster';
import { sanitizeService } from 'utils/serviceHelper';

const evidence = sanitizeService(fetchMaster.evidence);
const EvidenceService = {};

EvidenceService.getEvidences = async () => {
  return evidence({
    method: 'get',
    url: '/evidence/list',
  });
};

EvidenceService.updateEvidence = async (id, options = {}) => {
  const { params, data } = options;
  return evidence({
    method: 'put',
    url: '/evidence',
    params: { evidence_id: id, ...params },
    data: { data },
  });
};

EvidenceService.getEvidenceById = async (id) => {
  return evidence({
    method: 'get',
    url: '/evidence',
    params: {
      evidence_id: id,
    },
  });
};

EvidenceService.getPropertiesByEvidenceId = async (id, options = {}) => {
  const { params, ...rest } = options;
  return evidence({
    method: 'get',
    url: '/evidence/property/list',
    params: {
      evidence_id: id,
      ...params,
    },
    ...rest,
  });
};

EvidenceService.getTransactionsByEvidenceId = async (id, options = {}) => {
  const { params, ...rest } = options;
  return evidence({
    method: 'get',
    url: '/evidence/transaction/list',
    params: {
      evidence_id: id,
      ...params,
    },
    ...rest,
  });
};

EvidenceService.getPropertyDetail = async (id) => {
  return evidence({
    method: 'get',
    url: '/evidence/property',
    params: {
      evidence_prop_id: id,
    },
  });
};

EvidenceService.getPropertyDetailByNumber = async (id) => {
  return evidence({
    method: 'get',
    url: '/evidence/property',
    params: {
      evidence_prop_number: id,
    },
  });
};

EvidenceService.getTransactionById = async (id) => {
  return evidence({
    method: 'get',
    url: '/evidence/transaction',
    params: {
      evidence_trans_id: id,
    },
  });
};

EvidenceService.createTransaction = async (data, s3UploadKey) => {
  return evidence({
    method: 'post',
    url: '/evidence/transaction',
    data: { data, s3_upload_key: s3UploadKey },
  });
};

EvidenceService.getListEvidenceServiceProperty = async () => {
  return evidence({
    method: 'get',
    url: '/evidence/property/storage/list',
  });
};
EvidenceService.createChildListEvidenceServicePropertyById = async (data) => {
  return evidence({
    method: 'post',
    url: '/evidence/property/storage',
    data: { data },
  });
};
EvidenceService.createParentListEvidenceServicePropertyById = async (data) => {
  return evidence({
    method: 'post',
    url: '/evidence/property/storage',
    data: { data },
  });
};
EvidenceService.updateChildListEvidenceServicePropertyById = async (data, evidence_prop_storage_id) => {
  return evidence({
    method: 'put',
    url: `/evidence/property/storage?evidence_prop_storage_id=${evidence_prop_storage_id}`,
    data: { data },
  });
};
EvidenceService.updateParentListEvidenceServicePropertyById = async (data, evidence_prop_storage_id) => {
  return evidence({
    method: 'put',
    url: `/evidence/property/storage?evidence_prop_storage_id=${evidence_prop_storage_id}`,
    data: { data },
  });
};
export default EvidenceService;
