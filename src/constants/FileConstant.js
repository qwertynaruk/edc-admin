export const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
export const VIDEO_EXTENSIONS = ['mp4', 'webm', 'ogg'];
export const ALL_FILE_EXTENSIONS = '.' + IMAGE_EXTENSIONS.join(',.') + ',.' + VIDEO_EXTENSIONS.join(',.');
export const ALL_FILE_EXTENSIONS_VALIDATE =
  'image/' + IMAGE_EXTENSIONS.join(',image/') + 'video/' + VIDEO_EXTENSIONS.join(',video/');
export const ORGANIZATION_MODULE = 'organization';
export const ORGANIZATION_GROUP = 'organization';
