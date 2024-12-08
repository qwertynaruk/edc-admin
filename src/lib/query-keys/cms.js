import { createQueryKeyStore } from '@lukemorales/query-key-factory';

export const cmsQueryKeys = createQueryKeyStore({
  banner: {
    all: null,
    one: (banner_id) => [banner_id],
  },
});
