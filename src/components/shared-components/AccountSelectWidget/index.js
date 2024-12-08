import CustomSelect from '../CustomSelect';
import { useMemo } from 'react';
import useUsers from 'hooks/services/useUsers';
import _ from 'lodash';
import UserStore from 'mobx/UserStore';
import { renderPersonnelName } from 'utils/stringRender';
import PersonnelStore from 'mobx/PersonelStore';
import { MAX_API_LIMIT } from 'constants/ApiConstant';

const renderUserName = (item) => {
  if (!item) return '-';
  return [_.get(item, 'prefix_name', ''), _.get(item, 'first_name', ''), _.get(item, 'last_name', '')].join(' ');
};

export const RenderAccountWidget = (values) => {
  const { users } = UserStore;
  return renderUserName(users?.find((ss) => ss._id === values));
};

export const RenderPersonnelWidget = (values) => {
  if (typeof values !== 'string') {
    return renderPersonnelName(values);
  }
  const { personnels } = PersonnelStore;
  return renderPersonnelName(personnels?.find((ss) => ss._id === values));
};

const AccountSelectWidget = (props) => {
  const { category, ids, viewMode = { enable: false, values: '' }, json = false, ...otherProps } = props;
  const { data: _users, loading } = useUsers({
    params: {
      main_agency: category,
      limit: MAX_API_LIMIT,
      _id: ids,
    },
  });

  const packUser = _users?.map((item) => {
    return {
      label: renderUserName(item),
      value: json ? JSON.stringify(item) : item._id,
    };
  });

  const renderLabel = useMemo(() => {
    const _user = _users?.find((ss) => ss._id === viewMode.values);
    return renderUserName(_user);
  }, [_users]);

  return viewMode.enable ? renderLabel : <CustomSelect loading={loading} options={packUser} {...otherProps} />;
};

export default AccountSelectWidget;
