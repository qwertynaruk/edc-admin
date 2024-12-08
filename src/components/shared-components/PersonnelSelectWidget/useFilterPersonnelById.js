// import  from 'hooks/services/usePersonnel';

import { MAX_API_LIMIT } from 'constants/ApiConstant';
import usePersonnel from 'hooks/services/usePersonnel';
import _ from 'lodash';
import TeamStore from 'mobx/TeamStore';
import { useMemo, useState } from 'react';
import { renderPersonnelName } from 'utils/stringRender';

export const useFilterPersonnelById = (category) => {
  // return {
  //   getPersonnelFormSelectWidget: () => {
  //     return [];
  //   },
  //   getAllPersonnelTeamFormSelectWidget: () => {
  //     return [];
  //   },
  //   loading: false,
  //   personnel: [],
  // };
  const [listUser, setListUser] = useState();

  const { data: _personnel = [], loading } = usePersonnel({
    params: {
      main_agency: category,
      limit: MAX_API_LIMIT,
      _id: listUser,
    },
  });
  const { teamList = [] } = TeamStore;
  const getAllPersonnelTeamFormSelectWidget = (teamId, _leaderTeam = () => {}) => {
    const [_tp = {}] = teamList.filter((team) => team._id === teamId);
    const { operation_officers = [], team_within = {} } = _tp;
    const { leader = '' } = team_within;
    _leaderTeam(leader);
    const propertyValues = Object.values(team_within);
    setListUser([...operation_officers, ...propertyValues]);
  };
  const getPersonnelFormSelectWidget = (userId, showList = false) => {
    if (_.isEmpty(_personnel)) return {};
    const _p = _personnel.filter((ez) => ez._id === userId);
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
  const personnel = useMemo(() => {
    if (_.isEmpty(_personnel)) return [];
    return _personnel.map(({ _id, ...otherDetail }) => {
      return {
        name_user: renderPersonnelName(otherDetail),
        _id,
      };
    });
  }, [_personnel]);
  return {
    getPersonnelFormSelectWidget,
    getAllPersonnelTeamFormSelectWidget,
    loading,
    personnel,
  };
};

export default useFilterPersonnelById;
