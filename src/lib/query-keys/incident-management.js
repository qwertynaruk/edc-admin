import { createQueryKeyStore } from '@lukemorales/query-key-factory';

export const incidentManagementQueryKeys = createQueryKeyStore({
  incident: {
    all: null,
    one: (incident_id) => [incident_id],
  },
});
