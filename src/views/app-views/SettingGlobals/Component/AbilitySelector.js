import CustomTreeSelect from 'components/shared-components/CustomTreeSelect';
import _ from 'lodash';
import { observer } from 'mobx-react';
import AbilityStore, { ABILITY_GROUP } from 'mobx/AbilityStore';
import { useEffect, useMemo } from 'react';

const AbilitySelector = (props) => {
  const { abilities, content_loading } = AbilityStore;
  const treeData = useMemo(() => {
    return _.map(abilities, (abilities, key) => {
      return {
        title: ABILITY_GROUP[key],
        value: key,
        disabled: true,
        children: _.map(abilities, (value, key) => {
          return {
            value: value.name,
            title: value.name,
          };
        }),
      };
    });
  }, [abilities]);
  const expandedKeys = useMemo(() => {
    return _.keys(abilities);
  }, [abilities]);
  useEffect(() => {
    AbilityStore.Get();
  }, []);
  return (
    <CustomTreeSelect
      {...props}
      multiple={props.mode ? props.mode === 'multiple' : false}
      treeData={treeData}
      treeExpandedKeys={expandedKeys}
      loading={content_loading}
    />
  );
};

export default observer(AbilitySelector);
