import useAbility from 'hooks/useAbility';
import usePermissionWall from 'hooks/usePermissionWall';

export const GuardHandles = (props) => {
  const { query, abilities = null } = props;
  const tans = useAbility(query);

  if (abilities) {
    if (Array.isArray(abilities)) {
      const abi = [];
      abilities.forEach((secs) => {
        abi.push(tans[secs]);
      });

      return abi.includes(true);
    }

    if (abilities === 'all') {
      if (tans?.canRead || tans?.canCreate || tans?.canUpdate || tans?.canDelete) {
        return true;
      }
    }
    return tans[abilities];
  } else {
    return tans;
  }
};

export const GuardHandlesV2 = (props) => {
  const { group, type = '' } = props;
  const { hasTouchSubModules } = usePermissionWall();

  const canRead = hasTouchSubModules({
    moduleName: group,
    subModuleName: type,
    action: 'read',
  });

  const canCreate = hasTouchSubModules({
    moduleName: group,
    subModuleName: type,
    action: 'create',
  });

  const canUpdate = hasTouchSubModules({
    moduleName: group,
    subModuleName: type,
    action: 'update',
  });

  const canDelete = hasTouchSubModules({
    moduleName: group,
    subModuleName: type,
    action: 'delete',
  });

  return {
    canRead,
    canCreate,
    canUpdate,
    canDelete,
  };
};

const Guarded = (props) => {
  const { query, onNoPermission, directAccess = false } = props;
  const { hasTouchModules, hasTouchSubModules } = usePermissionWall();

  if (query?.directAccess) {
    return props.children;
  }

  if (!query && directAccess) {
    return props.children;
  }

  if (!props.children) return null;
  if (!query) return null;

  if (hasTouchModules(query?.group)) {
    if (query?.type) {
      const checkInRole = hasTouchSubModules({
        moduleName: query?.group,
        subModuleName: query?.type,
        action: query?.action || 'read',
      });

      return checkInRole ? props.children : null;
    }

    return props.children;
  }

  console.log(hasTouchModules(query?.group));

  return onNoPermission || null;
};

export default Guarded;
