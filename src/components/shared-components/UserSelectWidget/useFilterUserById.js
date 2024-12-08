import { MAX_API_LIMIT } from 'constants/ApiConstant';
import useUsers from 'hooks/services/useUsers';
import _ from 'lodash';

import TeamStore from 'mobx/TeamStore';

export const useFilterUserById = () => {
  const { data: _user = [], loading } = useUsers({
    params: {
      limit: MAX_API_LIMIT,
    },
  });
  const { teamList = [] } = TeamStore;
  const getAllUserTeamFormSelectWidget = (teamId, _leaderTeam = () => {}) => {
    const [_tp = {}] = teamList.filter((team) => team._id === teamId);
    const { operation_officers = [], team_within = {} } = _tp;
    const { leader = '' } = team_within;
    _leaderTeam(leader);
    const propertyValues = Object.values(team_within);
    const resp = [...operation_officers, ...propertyValues].map((userId) => {
      return getUserFormSelectWidget(userId);
    });
    return resp;
  };
  const getUserFormSelectWidget = (userId, showList = false) => {
    const _p = _user.filter((ez) => ez._id === userId);
    if (_p.length > 0) {
      if (showList) {
        return _p;
      }

      return {
        name_user: [
          _.get(_p[0], 'prefix_name', '-') || '-',
          _.get(_p[0], 'first_name', '-') || '-',
          _.get(_p[0], 'last_name', '') || '',
        ].join(' '),
        _id: userId,
      };
    }

    return { name_user: '-', _id: userId };
  };
  return {
    getUserFormSelectWidget,
    getAllUserTeamFormSelectWidget,
    loading,
    _user,
  };
};

export default useFilterUserById;
