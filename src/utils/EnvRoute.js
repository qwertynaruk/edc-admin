const SITE_MODE = 'native';

const ISEQUAL = {
  only_dev: 'development',
  only_prod: 'production',
  only_stg: 'staging',
  native: process.env.REACT_APP_SERV,
};

const envMasterApiBaseUrl = {
  development: 'https://api-edc.onelife.oneforce.ai',
  production: 'https://api-edc.onelife.oneforce.ai',
};

const envMasterIndices = {
  development: '/master-indices',
  production: '/master-indices',
};
const envInvestigativeCase = {
  development: '/cases',
  production: '/cases',
};

const envIncidentReport = {
  development: '/reporting',
  production: '/reporting',
};

const envIncidentReporting = {
  development: '/reporting',
  production: '/reporting',
};

// webview
const envOneCommand = {
  development: '/webview',
  production: '/webview',
};

const envSystemAdmin = {
  development: '/system-admin',
  production: '/system-admin',
};

const envAssetManagement = {
  development: '/assets',
  production: '/assets',
};

const envPersonnel = {
  development: '/personnel',
  production: '/personnel',
};

const envUpload = {
  development: '/file',
  production: '/file',
};

const envEvidence = {
  development: '/evidence',
  production: '/evidence',
};

const envNotification = {
  development: '/notification',
  production: '/notification',
};

const envAuthentication = {
  development: '/auth',
  production: '/auth',
};

const envQueue = {
  development: '/queue-management',
  production: '/queue-management',
};

const envAdvanceSearch = {
  development: '/search',
  production: '/search',
};

const envLog = {
  development: '/log',
  production: '/log',
};

const envGIS = {
  development: '/gis',
  production: '/gis',
};

const envPatrol = {
  development: '/patrol',
  production: '/patrol',
};

const envReadCard = {
  development: '4fckn3mt4e',
  production: 'vdxb4b09fg',
};

const envAlarmMonitoring = {
  development: '/alarm-monitoring/v1',
  production: '/alarm-monitoring/v1',
};

const envUser = {
  development: '/user',
  production: '/user',
};

const envSosLink = {
  development: 'https://uat.sos.oneforce.ai',
  production: 'https://sos.oneforce.ai',
};

const envSosLinkLocal = {
  development: 'http://localhost:9001',
  production: 'http://localhost:9001',
};

const envAfterPath = {
  development: `portal.oneforce.ai`,
  production: 'app.oneforce.ai',
};

const envBucketPublic = {
  development: `onelife-public-dev`,
  production: 'onelife-public',
};
const envBucketPrivate = {
  development: `onelife-private-dev`,
  production: 'onelife-private',
};

const env = {
  ROOT_MASTER_BASEURL: envMasterApiBaseUrl[ISEQUAL[SITE_MODE]],
  ROOT_MASTER_INDICES: envMasterIndices[ISEQUAL[SITE_MODE]],
  ROOT_INVESTIGATIVE_CASE: envInvestigativeCase[ISEQUAL[SITE_MODE]],
  ROOT_INCIDENT_REPORT: envIncidentReport[ISEQUAL[SITE_MODE]],
  ROOT_INCIDENT_REPORTING: envIncidentReporting[ISEQUAL[SITE_MODE]],
  ROOT_ONE_COMMAND: envOneCommand[ISEQUAL[SITE_MODE]],
  ROOT_SYSTEM_ADMIN: envSystemAdmin[ISEQUAL[SITE_MODE]],
  ROOT_ASSET_MANAGEMENT: envAssetManagement[ISEQUAL[SITE_MODE]],
  ROOT_PERSONNEL: envPersonnel[ISEQUAL[SITE_MODE]],
  ROOT_UPLOAD: envUpload[ISEQUAL[SITE_MODE]],
  ROOT_NOTIFICATION: envNotification[ISEQUAL[SITE_MODE]],
  ROOT_AUTHENTICATION: envAuthentication[ISEQUAL[SITE_MODE]],
  ROOT_EVIDENCE: envEvidence[ISEQUAL[SITE_MODE]],
  ROOT_QUEUE: envQueue[ISEQUAL[SITE_MODE]],
  ROOT_ADVANCE_SAERCH: envAdvanceSearch[ISEQUAL[SITE_MODE]],
  ROOT_ENV_LOG: envLog[ISEQUAL[SITE_MODE]],
  ROOT_GIS: envGIS[ISEQUAL[SITE_MODE]],
  ROOT_PATROL: envPatrol[ISEQUAL[SITE_MODE]],
  ROOT_READ_CARD: envReadCard[ISEQUAL[SITE_MODE]],
  ROOT_SOS_LINK: envSosLink[ISEQUAL[SITE_MODE]],
  ROOT_SOS_LINK_LOCAL: envSosLinkLocal[ISEQUAL[SITE_MODE]],
  ROOT_ALARM_MONITORING: envAlarmMonitoring[ISEQUAL[SITE_MODE]],
  ROOT_USER: envUser[ISEQUAL[SITE_MODE]],
  ROOT_AFTER_PATH: envAfterPath[ISEQUAL[SITE_MODE]],
  ROOT_BUCKET_PUBLIC: envBucketPublic[ISEQUAL[SITE_MODE]],
  ROOT_BUCKET_PRIVATE: envBucketPrivate[ISEQUAL[SITE_MODE]],
};
export default env;
