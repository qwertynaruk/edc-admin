import { createQueryKeyStore } from '@lukemorales/query-key-factory';

export const personnelQueryKeys = createQueryKeyStore({
  personnel: {
    all: null,
    one: (personnelId) => [personnelId],
    meta: null,
  },
});
