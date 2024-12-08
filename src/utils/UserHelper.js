import env from './EnvRoute';

export const getFullNameUser = (prefix = null, firstName = null, lastName = null) => {
  return `${prefix}${firstName} ${lastName}`;
};

export const getDevModeAndOrgPath = () => {
  const devLocalMode = window.location.href.search('localhost') >= 0;
  let organization = window.location.href.split('//')?.[1]?.split('.')?.[0] || null;
  let urlRedirect = env.ROOT_DOMAIN_ONEFORCE;
  if (devLocalMode) {
    organization = null;
  } else {
    // urlRedirect = `${organization}.${env.ROOT_AFTER_PATH}`;
    urlRedirect = `${organization === 'global' ? 'center' : organization}.${env.ROOT_AFTER_PATH}`;
  }
  if (organization === 'center') {
    organization = 'global';
  }
  return { devLocalMode, organization, urlRedirect };
};
