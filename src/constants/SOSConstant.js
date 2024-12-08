import env from 'utils/EnvRoute';

export const nightModeStyles = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }],
  },
];

export const SOS_STATUS = [
  {
    label: 'รอดำเนินการ',
    value: 'รอดำเนินการ',
  },
  {
    label: 'กำลังดำเนินการ',
    value: 'กำลังดำเนินการ',
  },
  { label: 'เสร็จสิ้น', value: 'เสร็จสิ้น' },
  { label: 'ยกเลิก', value: 'ยกเลิก', count: 0 },
];

export const TYPE_ASSIGNEE_OBJECT = [
  {
    label: 'ประสานงาน',
    value: 'invite',
  },
  {
    label: 'ผู้รับผิดชอบ',
    value: 'assignee',
  },
];

export const BUCKETNAME_SOS = [
  {
    label: 'public',
    value: env.ROOT_BUCKET_PUBLIC,
    profile: { module: 'profile', group: 'user' },
  },
  {
    label: 'private',
    value: env.ROOT_BUCKET_PRIVATE,
    comment: {
      module: 'reports',
      group: 'comment',
    },
  },
];

export const SET_ZOOM_DEFAULT = 10;
