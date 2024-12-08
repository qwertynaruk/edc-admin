import _ from 'lodash';
import useUser from './services/useUser';

export const defaultPermissions = {
  canCreate: false,
  canRead: false,
  canUpdate: false,
  canDelete: false,
};
export const getPermissions = (abilities) => {
  return (query) => {
    const { group, type, name, ignoreName = null } = query;

    const groupAbilities = abilities[group];
    if (!groupAbilities) return defaultPermissions;
    const filteredType = groupAbilities.filter((item) => {
      if (!type) return true;
      return item.type === type;
    });
    const canCreate = filteredType.some((item) => item.name.startsWith('สร้าง') || item.name.startsWith('เพิ่ม'));
    const canRead = filteredType.some((item) => {
      if (name) {
        return item.name.includes(name);
      }

      if (ignoreName) {
        return !item.name.includes(ignoreName);
      }

      return item.name.startsWith('ดู') || item.name.startsWith('ใช้งาน') || item.name.startsWith('ติดตาม');
    });
    const canUpdate = filteredType.some((item) => {
      return (
        item.name.startsWith('แก้ไข') ||
        item.name.startsWith('อัพเดทสถานะ') ||
        item.name.startsWith('เรียกคิว') ||
        item.name.startsWith('นำเข้า') ||
        item.name.startsWith('จัดการ')
      );
    });
    const canDelete = filteredType.some((item) => item.name.startsWith('ลบ'));
    return { canCreate, canRead, canUpdate, canDelete };
  };
};

export const getAbilitiesByGroup = (roles) => {
  return [];
  // return _.chain(roles?.map((role) => role?.abilities))
  //   .union()
  //   .flatten()
  //   .uniqBy('_id')
  //   .groupBy('group')
  //   .value();
};

const useAbility = (query) => {
  const { roles, loading } = useUser();
  if (_.isEmpty(query) || _.isEmpty(roles)) return { ...defaultPermissions, loading };
  const abilities = getAbilitiesByGroup(roles);
  const permissions = getPermissions(abilities)(query);
  return { ...permissions, loading };
};

export default useAbility;
