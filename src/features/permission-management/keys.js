import { createQueryKeys } from '@lukemorales/query-key-factory';

export const permissionManagementKeys = createQueryKeys('permissionManagement', {
  all: (filter) => ({
    queryKey: [filter],
  }),
  create: null,
  createStore: null,
  update: null,
  delete: null,
  detail: (id) => ({
    queryKey: [id],
  }),
});
