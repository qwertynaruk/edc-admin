import { Select } from 'antd';
import { MAX_API_LIMIT } from 'constants/ApiConstant';
import useService from 'hooks/useService';
import _ from 'lodash';
import { useMemo } from 'react';
import UserService from 'services/UserService';
import { serviceWrapper } from 'utils/serviceHelper';
import { renderDash } from 'utils/tableRender';
import CustomSelect from '../CustomSelect';

const { Option } = Select;

function renderUser(user) {
  return renderDash([_.get(user, 'prefix_name', '-'), _.get(user, 'first_name', '-'), _.get(user, 'last_name', '-')]);
}

const UserSelectWidget = (props) => {
  const {
    viewMode = false,
    userId = null,
    category,
    filterValueProps = false,
    disabledOption = '',
    json = false,
    value,
    ...otherProps
  } = props;
  const id = _.get(userId, '_id', userId);
  const { data, loading } = useService(serviceWrapper(UserService.get_users), () => {
    if (!userId) {
      return {
        main_agency: category,
        limit: MAX_API_LIMIT,
      };
    }
    return {
      _id: id,
    };
  });

  const options = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.map((user) => {
      return {
        label: renderUser(user),
        value: json ? JSON.stringify(user) : user._id,
      };
    });
  }, [data, json]);

  if (viewMode) {
    if (!data) {
      return '-';
    }
    const user = data.find((user) => user._id === id);
    return renderUser(user);
  }

  return (
    <CustomSelect value={loading ? [] : value} loading={loading} disabled={loading} options={options} {...otherProps} />
  );
};

export default UserSelectWidget;
