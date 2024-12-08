import { createQueryKeys } from '@lukemorales/query-key-factory';

export const s3Keys = createQueryKeys('s3', {
  list: (queryParams) => ({
    queryKey: [queryParams],
  }),
});
