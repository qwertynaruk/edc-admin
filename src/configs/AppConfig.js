import { DIR_LTR, NAV_TYPE_SIDE, SIDE_NAV_LIGHT } from 'constants/ThemeConstant';

import EnvRoute from 'utils/EnvRoute';
import { getEnv } from './EnvironmentConfig';

export const APP_NAME = 'Oneforce';
export const API_BASE_URL = getEnv().API_ENDPOINT_URL;
export const APP_PREFIX_PATH = '/app';
export const AUTH_PREFIX_PATH = '/auth';
export const VS_PREFIX_PATH = '/visualization';

export const CASE_MODULE_PREFIX_PATH = `${APP_PREFIX_PATH}/case-management`;
export const ONE_COMMAND_PREFIX_PATH = `${APP_PREFIX_PATH}/one-command`;
export const EVIDENT_PREFIX_PATH = `${APP_PREFIX_PATH}/property-evidence-management`;
export const INCIDENT_REPORT_PREFIX_PATH = `${APP_PREFIX_PATH}/incident-management`;

export const DSAR_BASE_URL = 'https://3ulz9p9wf9.execute-api.ap-southeast-1.amazonaws.com/v1';
export const AUTH_BASE_URL = 'https://0cidya7gwd.execute-api.ap-southeast-1.amazonaws.com/v1';
export const ENTRY_ROUTE = '/auth/login';
export const TOKEN_PAYLOAD_KEY = 'authorization';
export const PUBLIC_REQUEST_KEY = 'public-request';

export const API_ONE_LIFE_ENDPOINT_URL = EnvRoute.ROOT_MASTER_BASEURL;
export const API_FILE_MANAGEMENT_ENDPOINT_URL = process.env.REACT_APP_API_FILE_MANAGEMENT_URL;
export const API_PERSONNEL_ENDPOINT_URL = `${API_ONE_LIFE_ENDPOINT_URL}/personnel`;
export const GOOGLE_MAP_API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

export const SOS_MODULE_URL = process.env.REACT_APP_SOS_MODULE_URL;

export const THEME_CONFIG = {
  navCollapsed: false,
  sideNavTheme: SIDE_NAV_LIGHT,
  locale: 'en',
  navType: NAV_TYPE_SIDE,
  topNavColor: '#3e82f7',
  headerNavColor: '',
  mobileNav: false,
  currentTheme: 'dark',
  direction: DIR_LTR,
};

export const TIME_REFRESH_TOKEN = 86400;
