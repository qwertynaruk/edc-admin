import { createQueryKeys } from '@lukemorales/query-key-factory';

export const areaOfResponsibilityKeys = createQueryKeys('area-of-responsibility', {
  all: (filter) => ({
    queryKey: [filter],
  }),
});
