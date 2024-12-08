export const locationZone = [
  {
    polygon: [
      [
        [17.390894, 102.800022],
        [17.391984, 102.805414],
        [17.406432, 102.805562],
        [17.424117, 102.806068],
        [17.427194, 102.810729],
        [17.390827, 102.825998],
        [17.386953, 102.826059],
        [17.375943, 102.825765],
        [17.364604, 102.815835],
      ],
    ],
    name: 'zone1',
    label: 'เขตตรวจที่ 1',
    fillColor: '#C5E856',
  },
  {
    polygon: [
      [
        [17.435402, 102.791677],
        [17.424368, 102.790564],
        [17.416371, 102.791361],
        [17.413545, 102.791878],
        [17.406432, 102.805562],
        [17.424117, 102.806068],
        [17.427194, 102.810729],
        [17.431736, 102.808421],
      ],
    ],
    name: 'zone2',
    label: 'เขตตรวจที่ 2',
    fillColor: '#EDB757',
  },
  {
    polygon: [
      [
        [17.412837, 102.772452],
        [17.413266, 102.766056],
        [17.418072, 102.766331],
        [17.435402, 102.791677],
        [17.424368, 102.790564],
        [17.416287, 102.791374],
        [17.418833, 102.786361],
        [17.41013, 102.78341],
        [17.412131, 102.779727],
        [17.409742, 102.7782],
      ],
    ],
    name: 'zone3',
    label: 'เขตตรวจที่ 3',
    fillColor: '#B1E3F2',
  },
  {
    polygon: [
      [
        [17.400751, 102.794623],
        [17.398651, 102.795187],
        [17.387511, 102.801888],
        [17.387027, 102.791847],
        [17.389716, 102.784739],
        [17.396057, 102.771342],
        [17.390276, 102.771589],
        [17.388066, 102.765665],
        [17.413354, 102.765731],
        [17.411079, 102.775809],
        [17.410184, 102.77736],
      ],
    ],
    name: 'zone4',
    label: 'เขตตรวจที่ 4',
    fillColor: '#28961F',
  },
  {
    polygon: [
      [
        [17.400751, 102.794623],
        [17.398651, 102.795187],
        [17.390894, 102.800022],
        [17.391984, 102.805414],
        [17.406432, 102.805562],
        [17.413545, 102.791878],
        [17.416287, 102.791374],
        [17.418833, 102.786361],
        [17.41013, 102.78341],
        [17.412131, 102.779727],
        [17.409742, 102.7782],
      ],
    ],
    name: 'zone5',
    label: 'เขตตรวจที่ 5',
    fillColor: '#E1411E',
  },
];

export const currentLocation = {
  lat: 17.4010131,
  lng: 102.8027753,
};

export const polygonPath = [
  { lat: 17.435886, lng: 102.791911 },
  { lat: 17.431905, lng: 102.808486 },
  { lat: 17.390827, lng: 102.825998 },
  { lat: 17.386953, lng: 102.826059 },
  { lat: 17.375943, lng: 102.825765 },
  { lat: 17.364604, lng: 102.815835 },
  { lat: 17.387511, lng: 102.801888 },
  { lat: 17.387027, lng: 102.791847 },
  { lat: 17.389716, lng: 102.784739 },
  { lat: 17.396057, lng: 102.771342 },
  { lat: 17.390276, lng: 102.771589 },
  { lat: 17.388066, lng: 102.765665 },
  { lat: 17.417659, lng: 102.766029 },
];

const styledNightMode = {
  styles: [
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
  ],
};

const styledDefaultMode = {};

export const mapStyleMode = {
  dark: styledNightMode,
  light: styledDefaultMode,
};

export const polygonColorMode = {
  dark: {
    overGroud: '#E44234',
    selectPath: '#5662F6',
  },
  light: {
    overGroud: 'red',
    selectPath: 'blue',
  },
};

export const centerGoogleMap = {
  lat: 13.736717,
  lng: 100.523186,
};
export const googleMapOptions = {
  default: {
    rotateControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    zoomControl: false,
    mapTypeControl: true,
    mapTypeId: 'hybrid',
  },
  V2: {
    rotateControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    zoomControl: true,
    mapTypeControl: true,
    // mapTypeControlOptions: {
    //   style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
    //   position: window.google.maps.ControlPosition.TOP_RIGHT,
    // },
    styles: styledNightMode,
  },
};

export const TYPE_POLYGONS = [
  { value: 'geo_provinces', levle: 1 },
  { value: 'geo_amphures', levle: 2 },
  { value: 'geo_districts', levle: 3 },
];
