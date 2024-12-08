import { FIX_LABEL } from 'constants/OrganizationConstant';
import { MAX_API_LIMIT } from 'constants/ApiConstant';
import fetchMaster from 'axios/FetchMaster';
import { sanitizeService } from 'utils/serviceHelper';
import { useQuery } from '@tanstack/react-query';

const systemAdmin = sanitizeService(fetchMaster.system_admin);
const masterIndices = sanitizeService(fetchMaster.master_indices);

const AttributeService = {
  getTypeDropdownMaster: async (
    params = {
      page: 1,
      limit: MAX_API_LIMIT,
    }
  ) => {
    return systemAdmin({
      method: 'get',
      url: '/attribute_types',
      params,
    });
  },
  getItemsDropdownMaster: async (
    params = {
      page: 1,
      limit: MAX_API_LIMIT,
    }
  ) => {
    return systemAdmin({
      method: 'get',
      url: '/attributes',
      params,
    });
  },
  postAttribute: async (data) => {
    return systemAdmin({ method: 'POST', url: '/attributes', data });
  },
  updateAttribute: async (_id, data) => {
    return systemAdmin({
      method: 'PUT',
      url: '/attributes',
      params: {
        _id,
      },
      data,
    });
  },
  getDropdownProvince: async () => {
    return masterIndices({ method: 'get', url: '/province' });
  },
  getDropdownCity: async (provinceId) => {
    return masterIndices({
      method: 'get',
      url: `/district?province_name=${provinceId}`,
    });
  },
  getDropdownDistrict: async (cityId) => {
    return masterIndices({
      method: 'get',
      url: `/sub_district?district_name=${cityId}`,
    });
  },
  getDropdownVehicleBrand: async () => {
    return masterIndices({ method: 'get', url: '/vehicle/brand' });
  },
  getDropdownVehicleModel: async (makeId) => {
    return masterIndices({
      method: 'get',
      url: `/vehicle/model?vehicle_make_name=${makeId}`,
    });
  },
  getDropdownVehicleModels: async () => {
    return masterIndices({
      method: 'get',
      url: `/vehicle/all_model`,
    });
  },
  useGetLabel(props) {
    return useQuery({
      queryKey: ['master-tags-lable', props?.queryParams],
      queryFn: async () =>
        await systemAdmin({
          method: 'get',
          url: '/attributes',
          params: {
            attribute_type_id: FIX_LABEL,
          },
        }),
      select: (response) => {
        return response?.data;
      },
    });
  },
};

export default AttributeService;
