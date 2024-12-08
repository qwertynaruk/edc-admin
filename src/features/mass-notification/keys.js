import { createQueryKeys } from '@lukemorales/query-key-factory';

export const massNotiKeys = createQueryKeys('massNoti', {
  all: (filter) => ({
    queryKey: [filter],
  }),
  warnings: null,
  create: null,
  detail: (id) => ({
    queryKey: [id],
  }),
  mapsArea: (queryParams = {}) => ({
    queryKey: [queryParams],
  }),
  geoGraphies: (queryParams = {}) => ({
    queryKey: [queryParams],
  }),
  mapPolygon: (queryParams = {}) => ({
    queryKey: [queryParams],
  }),
});
