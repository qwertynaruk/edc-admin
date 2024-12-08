import _ from 'lodash';
import fetchMaster from 'axios/FetchMaster';
import { sanitizeService } from 'utils/serviceHelper';
import { useQuery } from '@tanstack/react-query';

const personnel = sanitizeService(fetchMaster.personnel);

const MAX_UNSIGNED_SHORT = 65535;

const PersonnelService = {
  get: (options = {}) => {
    const {
      params = {
        limit: MAX_UNSIGNED_SHORT,
      },
      data = {},
    } = options;
    return personnel({
      method: 'GET',
      url: '/personnel',
      params,
      data,
    });
  },
  getById: (id) => {
    return personnel({
      method: 'GET',
      url: `/personnel/detail`,
      params: { _id: id },
    });
  },
  post: async (data) => {
    return personnel({
      method: 'POST',
      url: '/personnel',
      data,
    });
  },
  update: async (_id, data) => {
    return personnel({
      method: 'PUT',
      url: '/personnel',
      data,
      params: { _id },
    });
  },
  createDuty: async (data) => {
    return personnel({
      method: 'POST',
      url: '/duty',
      data,
    });
  },
  updateDuty: async (data) => {
    return personnel({
      method: 'PUT',
      url: '/duty',
      data,
    });
  },
  getAllRoleLevels: async (options = {}) => {
    return personnel({
      method: 'GET',
      url: '/personnel_role_levels',
      ...options,
    });
  },
  getRoleLevelById: async (options = {}) => {
    return personnel({
      method: 'GET',
      url: '/personnel_role_level',
      ...options,
    });
  },
  createRoleLevel: async (data) => {
    return personnel({
      method: 'POST',
      url: '/personnel_role_level',
      data,
    });
  },
  updateRoleLevel: async (data) => {
    return personnel({
      method: 'PUT',
      url: '/personnel_role_level',
      data,
    });
  },
  getApprovePersonnelDuties: async (options = {}) => {
    return personnel({
      method: 'GET',
      url: '/approve_personnel_duties',
      ...options,
    });
  },
  getManagerById: async (options = {}) => {
    return personnel({
      method: 'GET',
      url: '/personnel_role_level/manager',
      ...options,
    });
    // FIXME: This is a mockup
    // return {
    //   statusCode: 200,
    //   data: {
    //     managers: [
    //       {
    //         _id: '638b4500ff02de89d4bcbb1a',
    //         is_active: true,
    //         person_card_id: '344060115487',
    //         email: 'panudet.t@securitypitch.com',
    //         phone_number: '0924607735',
    //         prefix_name: 'นาย',
    //         first_name: 'ภานุเดช',
    //         last_name: 'ธรรมวงศา',
    //         middle_name: '-',
    //         gender: 'ชาย',
    //         domicile: 'อุดรธานี',
    //         position: 'ผู้บัญชาการ',
    //         position_abbreviation: 'ผบ.',
    //         main_agency: 'สืบสวน',
    //         main_agency_abbreviation: 'สส.',
    //         dominate: 'ว่าที่พันตำรวจโท',
    //         dominate_abbreviation: 'ว่าที่ พ.ต.ท.',
    //         station: 'สถานีตำรวจภูธรเมืองอุดรธานี',
    //       },
    //       {
    //         _id: '638b4500ff02de89d4bcbb1c',
    //         is_active: true,
    //         parent_manager_id: '638b4500ff02de89d4bcbb1a',
    //         person_card_id: '344060115487',
    //         email: 'wrchyx@police.com',
    //         phone_number: '0924607735',
    //         prefix_name: 'นาง',
    //         first_name: 'wrchyx',
    //         last_name: 'police',
    //         middle_name: '-',
    //         gender: 'ชาย',
    //         domicile: 'อุดรธานี',
    //         position: 'ผู้บัญชาการ',
    //         position_abbreviation: 'ผบ.',
    //         main_agency: 'สืบสวน',
    //         main_agency_abbreviation: 'สส.',
    //         dominate: 'ว่าที่พันตำรวจโทหญิง',
    //         dominate_abbreviation: 'ว่าที่ พ.ต.ท. หญิง',
    //         station: 'สถานีตำรวจภูธรเมืองอุดรธานี',
    //       },
    //     ],
    //     subordinates: [
    //       {
    //         _id: '638b5f32ff02de89d4bf3af2',
    //         is_active: true,
    //         person_card_id: '344060115487',
    //         email: 'wrchyx@police.com',
    //         phone_number: '0924607735',
    //         prefix_name: 'นาง',
    //         first_name: 'test3',
    //         last_name: 'police',
    //         middle_name: '-',
    //         gender: 'ชาย',
    //         domicile: 'อุดรธานี',
    //         position: 'ผู้บังคับการ',
    //         position_abbreviation: 'ผบก.',
    //         main_agency: 'สืบสวน',
    //         main_agency_abbreviation: 'สส.',
    //         dominate: 'ว่าที่พันตำรวจโทหญิง',
    //         dominate_abbreviation: 'ว่าที่ พ.ต.ท. หญิง',
    //         station: 'สถานีตำรวจภูธรเมืองอุดรธานี',
    //       },
    //     ],
    //   },
    // };
  },
  createRoleLevelOrganization: async (options = {}) => {
    return personnel({
      method: 'POST',
      url: '/personnel_role_level/organization',
      ...options,
    });
  },
  getRoleLevelOrganization: async (options = {}) => {
    return personnel({
      method: 'GET',
      url: '/personnel_role_level/organization',
      ...options,
    });
  },
  getRoleLevelPosition: async (options = {}) => {
    return personnel({
      method: 'GET',
      url: '/personnel_role_level/position',
      ...options,
    });
  },
  createRoleLevelDepartment: async (options = {}) => {
    return personnel({
      method: 'POST',
      url: '/personnel_role_level/department',
      ...options,
    });
  },
  updateRoleLevelDepartment: async (options = {}) => {
    return personnel({
      method: 'PUT',
      url: '/personnel_role_level/department',
      ...options,
    });
  },
  getRoleLevelDepartment: async (options = {}) => {
    return personnel({
      method: 'GET',
      url: '/personnel_role_level/department',
      ...options,
    });
  },
  getCountByType: async (options = {}) => {
    return personnel({
      method: 'GET',
      url: '/personnel_role_level/count_by_type',
      ...options,
    });
  },
  getByType: async (options = {}) => {
    return personnel({
      method: 'GET',
      url: '/personnel_role_level/by_type',
      ...options,
    });
  },
  getSubordinate: async (options = {}) => {
    return personnel({
      method: 'GET',
      url: '/personnel_role_level/subordinate',
      ...options,
    });
  },
  getLeader: async (options = {}) => {
    return personnel({
      method: 'GET',
      url: '/personnel_role_level/leader',
      ...options,
    });
  },
  getPosition: async (options = {}) => {
    return personnel({
      method: 'GET',
      url: '/position',
      ...options,
    });
  },
  getPositionById: async ({ id }) => {
    return personnel({
      method: 'GET',
      url: '/position/detail',
      params: { position_id: id },
    });
  },
  updatePosition: async (options = {}) => {
    return personnel({
      method: 'PUT',
      url: '/position/detail',
      ...options,
    });
  },
  createPosition: async (options = {}) => {
    return personnel({
      method: 'POST',
      url: '/position',
      ...options,
    });
  },
  getDepartment: async (options = {}) => {
    return personnel({
      method: 'GET',
      url: '/department',
      ...options,
    });
  },
  getDepartmentById: async ({ id }) => {
    return personnel({
      method: 'GET',
      url: '/department/detail',
      params: { department_id: id },
    });
  },
  updateDepartment: async (options = {}) => {
    return personnel({
      method: 'PUT',
      url: '/department/detail',
      ...options,
    });
  },
  createDepartment: async (options = {}) => {
    return personnel({
      method: 'POST',
      url: '/department',
      ...options,
    });
  },
  useGetOrgnanization: (props) => {
    return useQuery({
      queryKey: ['organization-list', props?.queryParams],
      queryFn: async () =>
        await personnel({
          method: 'GET',
          url: '/organization_info',
          params: { all_org: 'yes' },
        }),
      select: (response) => {
        return response?.response;
      },
    });
  },
  useGetOrgnanizationTree(props) {
    return useQuery({
      queryKey: ['organization-tree', props?.queryParams],
      queryFn: async () =>
        await personnel({
          method: 'GET',
          url: '/organization_info/tree',
          params: props?.queryParams,
        }),
      select: (response) => {
        return response?.response;
      },
    });
  },
  useGetOrgnanizationByPath(props) {
    return useQuery({
      queryKey: ['organization-tree-params', props?.queryParams],
      enabled: !_.isEmpty(props?.searchOrganization),
      queryFn: async () =>
        await personnel({
          method: 'GET',
          url: '/organization_info/tree',
          params: props?.queryParams,
        }),
      select: (response) => {
        return response?.response;
      },
    });
  },
  useGetOrgnanizationById(props) {
    return useQuery({
      enabled: !props?.view,
      queryKey: ['organization-detail', props?.queryParams],
      queryFn: async () =>
        await personnel({
          method: 'GET',
          url: '/organization_info/detail',
          params: props?.queryParams,
        }),
      select: (response) => {
        return response?.response;
      },
    });
  },
};

export default PersonnelService;
