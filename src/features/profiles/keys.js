import { createQueryKeys } from '@lukemorales/query-key-factory';

export const profilesKeys = createQueryKeys('profiles', {
  users: null,
  create: null,
  update: null,
});
