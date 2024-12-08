import CustomSelect from 'components/shared-components/CustomSelect';
import { observer } from 'mobx-react';
import RoleStore from 'mobx/RoleStore';
import { useEffect, useMemo } from 'react';

const RoleSelector = (props) => {
  const { roles } = RoleStore;
  const options = useMemo(() => {
    return roles.map((role) => {
      return {
        value: role.name,
        label: role.name,
      };
    });
  }, [roles]);
  useEffect(() => {
    RoleStore.GetRoles();
  }, []);
  return <CustomSelect {...props} options={options} />;
};

export default observer(RoleSelector);
