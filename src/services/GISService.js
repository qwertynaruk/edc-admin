import service from 'axios/FetchMaster';
import { sanitizeService } from 'utils/serviceHelper';

const gis = sanitizeService(service.gis);
const GISService = {
  zones: (options) =>
    gis({
      method: 'GET',
      url: '/gis/zone/list',
      ...options,
    }),
  createZone: (options) =>
    gis({
      method: 'POST',
      url: '/gis/zone',
      ...options,
    }),
  zone: (options) => gis({ method: 'GET', url: '/gis/zone', ...options }),
  updateZone: (options) => gis({ method: 'PUT', url: '/gis/zone', ...options }),
  createZoneAgent: (options) => gis({ method: 'POST', url: '/gis/zone-agent', ...options }),
  zoneAgents: (options) => gis({ method: 'GET', url: '/gis/zone-agent/list', ...options }),
  zoneAgent: (options) => gis({ method: 'GET', url: '/gis/zone-agent', ...options }),
  updateZoneAgent: (options) => gis({ method: 'PUT', url: '/gis/zone-agent', ...options }),
};

export default GISService;
