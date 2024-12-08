import { createQueryKeys } from '@lukemorales/query-key-factory';

export const lostFoundKeys = createQueryKeys('lostFound', {
  all: (filter) => ({
    queryKey: [filter],
  }),
  warnings: null,
  create: null,
  update: null,
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
