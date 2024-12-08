export const getBreadcrumb = (subpath = null) => {
  let backPath = '';
  let pahtnameUrl = window.location.pathname;
  pahtnameUrl = decodeURI(pahtnameUrl);
  pahtnameUrl = pahtnameUrl.split('/');
  console.log('pahtnameUrl', pahtnameUrl);
  if (subpath) {
    let findIndex = pahtnameUrl.findIndex((d) => d === (typeof subpath === 'string' ? subpath : subpath[0]));
    if (pahtnameUrl[2] === 'setting' || pahtnameUrl[2] === 'personnel') {
      findIndex = 3;
    }
    if (findIndex >= 0) {
      const pathData = pahtnameUrl.slice(0, findIndex);
      if (pathData.length > 0) {
        backPath = pathData.join('/');
      }
    }
  }
  return backPath;
};
