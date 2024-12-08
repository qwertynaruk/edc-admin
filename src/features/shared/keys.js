import { createQueryKeys } from '@lukemorales/query-key-factory';

export const masterDataKeys = createQueryKeys('masterDatas', {
  selectCategory: null,
  selectBrand: null,
  selectModel: null,
  selectColor: null,
  selectLostFoundStatus: null,
});
