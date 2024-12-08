import { APIProvider, Map } from '@vis.gl/react-google-maps';

import { GOOGLE_MAP_API_KEY } from 'configs/AppConfig';

const AreaPolygonPage = () => {
  let map;
  let featureLayer;
  let infoWindow;
  let lastInteractedFeatureIds = [];
  let lastClickedFeatureIds = [];

  function handleClick(/* MouseEvent */ e) {
    lastClickedFeatureIds = e.features.map((f) => f.placeId);
    lastInteractedFeatureIds = [];
    featureLayer.style = applyStyle;
    createInfoWindow(e);
  }

  // Helper function for the infowindow.
  async function createInfoWindow(event) {
    const feature = event.features[0];

    if (!feature.placeId) return;

    // Update the infowindow.
    const place = await feature.fetchPlace();
    const content =
      '<span style="font-size:small">Display name: ' +
      place.displayName +
      '<br/> Place ID: ' +
      feature.placeId +
      '<br/> Feature type: ' +
      feature.featureType +
      '</span>';

    updateInfoWindow(content, event.latLng);
  }

  function handleMouseMove(/* MouseEvent */ e) {
    lastInteractedFeatureIds = e.features.map((f) => f.placeId);
    featureLayer.style = applyStyle;
  }

  // Define styles.
  // Stroke and fill with minimum opacity value.
  const styleDefault = {
    strokeColor: '#810FCB',
    strokeOpacity: 1.0,
    strokeWeight: 2.0,
    fillColor: 'white',
    fillOpacity: 0.1, // Polygons must be visible to receive events.
  };
  // Style for the clicked polygon.
  const styleClicked = {
    ...styleDefault,
    fillColor: '#810FCB',
    fillOpacity: 0.5,
  };
  // Style for polygon on mouse move.
  const styleMouseMove = {
    ...styleDefault,
    strokeWeight: 4.0,
  };

  // Apply styles using a feature style function.
  function applyStyle(/* FeatureStyleFunctionOptions */ params) {
    const placeId = params.feature.placeId;

    // @ts-ignore
    if (lastClickedFeatureIds.includes(placeId)) {
      return styleClicked;
    }

    // @ts-ignore
    if (lastInteractedFeatureIds.includes(placeId)) {
      return styleMouseMove;
    }
    return styleDefault;
  }

  // Helper function to create an info window.
  function updateInfoWindow(content, center) {
    infoWindow.setContent(content);
    infoWindow.setPosition(center);
    infoWindow.open({
      map,
      shouldFocus: false,
    });
  }
  return (
    <APIProvider apiKey={GOOGLE_MAP_API_KEY}>
      <Map
        mapId="a3efe1c035bad51b"
        style={{ width: '100%', height: '100vh' }}
        defaultCenter={{ lat: 22.54992, lng: 0 }}
        defaultZoom={3}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        // onClick={(e) => {
        //   console.log('e', e);
        // }}
        // onMousemove={(e) => {
        //   console.log('e', e);
        // }}
      />
    </APIProvider>
  );
};

export default AreaPolygonPage;
