import { createQueryKeys } from '@lukemorales/query-key-factory';

export const roleManagementKeys = createQueryKeys('roleManagement', {
  all: (filter) => ({
    queryKey: [filter],
  }),
  create: null,
  update: null,
  delete: null,
  detail: (id) => ({
    queryKey: [id],
  }),
});
