import fetch from 'axios/FetchMaster';
import { sanitizeService } from 'utils/serviceHelper';
export const advanceSeachServiceUrl = {
  search: '/search',
  nearBy: '/location/near_by',
};
const advanceSearch = sanitizeService(fetch.advanceSearch);
const masterIndices = sanitizeService(fetch.master_indices);

const PostModule = async (url, payload) => {
  return advanceSearch({
    method: 'post',
    url,
    data: payload,
  });
};

const AdvanceSearchService = {
  doSearch: (payload) => PostModule(advanceSeachServiceUrl.search, payload),
  searchNearby: (data) =>
    masterIndices({
      method: 'post',
      url: advanceSeachServiceUrl.nearBy,
      data,
    }),
};

export default AdvanceSearchService;
