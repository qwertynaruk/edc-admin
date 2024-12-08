import useAbility, {
  defaultPermissions,
  getAbilitiesByGroup,
  getPermissions as getPermissionsWithoutAbilities,
} from './useAbility';

import _ from 'lodash';
import mockAbilities from 'tests/fixtures/abilities';
import { renderHook } from '@testing-library/react';

jest.mock('./services/useUser', () => {
  return () => {
    return { loading: false, roles: [{ name: 'default', abilities: mockAbilities }] };
  };
});

const mockGroupAbilities = _.groupBy(mockAbilities, 'group');

describe('useAbility', () => {
  it('should return default CRUD as false', () => {
    const { result } = renderHook(() => useAbility());

    expect(result.current).toEqual({ ...defaultPermissions, loading: false });
  });
  it('should return permission when recieve group and type', () => {
    const { result } = renderHook(() =>
      useAbility({
        group: 'Personnel',
        type: 'กำลังพล',
      })
    );

    expect(result.current).toHaveProperty('canCreate', false);
    expect(result.current).toHaveProperty('canRead', true);
    expect(result.current).toHaveProperty('canUpdate', true);
    expect(result.current).toHaveProperty('canDelete', false);
  });
  it('should have loading', () => {
    const { result } = renderHook(() =>
      useAbility({
        group: 'Personnel',
        type: 'กำลังพล',
      })
    );
    expect(result.current).toHaveProperty('loading', false);
  });
});

describe('getAbilitiesByGroup', () => {
  const mockRoles = [
    { name: 'default', abilities: [{ _id: '1', group: 'a' }, { _id: '2' }] },
    { name: 'default2', abilities: [{ _id: '1' }, { _id: '3', group: 'a' }, { _id: '4' }] },
  ];
  it('should union and deduplicate roles abilities', () => {
    expect(getAbilitiesByGroup(mockRoles)).toHaveProperty('a', [
      { _id: '1', group: 'a' },
      { _id: '3', group: 'a' },
    ]);
  });
});

describe('getPermissions', () => {
  let getPermissions;
  beforeAll(() => {
    getPermissions = getPermissionsWithoutAbilities(mockGroupAbilities);
  });

  it('should can use without type', () => {
    expect(getPermissions({ group: 'Personnel' })).toEqual({
      canCreate: false,
      canRead: true,
      canUpdate: true,
      canDelete: false,
    });
  });
  it('should return default permission when cannot find group', () => {
    expect(
      getPermissions({
        group: 'random',
        type: 'ทรัพยากร',
      })
    ).toEqual(defaultPermissions);
  });
  it('should can read when have ใช้งาน', () => {
    expect(
      getPermissions({
        group: 'asset',
        type: 'ทรัพยากร',
      })
    ).toHaveProperty('canRead', true);
  });
  it('should can read when have ติดตาม', () => {
    expect(
      getPermissions({
        group: 'case',
        type: 'ติดตามภาระ',
      })
    ).toHaveProperty('canRead', true);
  });
  it('should can update when have อัพเดทสถานะ', () => {
    expect(
      getPermissions({
        group: 'Incident Management',
        type: 'เว็บฟอร์ม',
      })
    ).toHaveProperty('canUpdate', true);
  });
  it('should can delete when have ลบ', () => {
    expect(
      getPermissions({
        group: 'Incident Management',
        type: 'รายงานภายในองค์กร',
      })
    ).toHaveProperty('canDelete', true);
  });
  it('should can update when have เรียกคิว', () => {
    expect(
      getPermissions({
        group: 'queue_management',
        type: 'คิว',
      })
    ).toHaveProperty('canUpdate', true);
  });
  describe('name parameter', () => {
    it('should can read when have name', () => {
      expect(
        getPermissions({
          group: 'One Command',
          type: 'Crime Intelligence',
          name: 'Decision Support System & Recommendation System',
        })
      ).toHaveProperty('canRead', true);
    });
    it('should can read when partial have name', () => {
      expect(
        getPermissions({
          group: 'One Command',
          type: 'Crime Intelligence',
          name: 'Business Intelligence',
        })
      ).toHaveProperty('canRead', true);
    });
    it('should cannot read when name not including', () => {
      expect(
        getPermissions({
          group: 'One Command',
          type: 'Crime Intelligence',
          name: 'Random name',
        })
      ).toEqual(defaultPermissions);
    });
  });
});
