import _ from 'lodash';
import CollapseFromData from '../CollapseFromData';

const RolesCollapse = (props) => {
  const { roles, ...otherProps } = props;
  const rolesData = _.map(roles, (value) => {
    return {
      key: value._id,
      header: value.name,
      children: _.chain(_.get(value, 'abilities', []))
        .compact()
        .value()
        .map((ability) => {
          const { _id, name, description } = ability;
          return {
            key: _id,
            header: name,
            description,
          };
        }),
    };
  });
  return <CollapseFromData data={rolesData} {...otherProps} />;
};

export default RolesCollapse;
