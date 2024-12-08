import useUser from './services/useUser';

const byPassEmail = ['admin@gmail.com'];

export default function usePermissionWall() {
  const { roles, user } = useUser();

  const permissionInRoles = roles?.permission_in_role || [];

  const hasTouchModules = (moduleName = '') => {
    if (byPassEmail.includes(user?.email)) {
      return true;
    }

    try {
      const inRoles = permissionInRoles?.find((ss) => ss?.module === moduleName);

      if (inRoles && inRoles?.sub_module?.length > 0) {
        const inSubRoles = inRoles?.sub_module?.filter((ss) => ss?.action === 'read');
        return inSubRoles?.length > 0;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  const hasTouchSubModules = ({ moduleName = '', subModuleName = '', action = '' }) => {
    if (byPassEmail.includes(user?.email)) {
      return true;
    }

    try {
      if (!moduleName || !permissionInRoles || permissionInRoles?.length <= 0) {
        throw new Error('this some field has been undefined values.');
      }

      const inRoles = permissionInRoles?.find((ss) => ss?.module === moduleName);
      const inSubRoles = inRoles?.sub_module?.find((ss) => {
        const checkSubModule = Array.isArray(subModuleName)
          ? subModuleName.includes(ss?.name_th)
          : ss?.name_th === subModuleName;
        return ss?.action === action && checkSubModule;
      });
      return !!inSubRoles;
    } catch (error) {
      return false;
    }
  };

  return {
    hasTouchModules,
    hasTouchSubModules,
  };
}
