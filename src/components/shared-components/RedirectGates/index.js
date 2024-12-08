import useUser from 'hooks/services/useUser';
import { Navigate } from 'react-router-dom';
import { getAbilitiesByGroup } from 'hooks/useAbility';
import _ from 'lodash';
import Guarded from '../Guarded';

export const PathProviders = ({ query, children, target = null }) => {
  return (
    <Guarded query={query} onNoPermission={<Navigate to={target || '/app/launchpad'} />}>
      {children}
    </Guarded>
  );
};

const RedirectGates = ({ routeQueries }) => {
  const { roles } = useUser();

  const filterRouterList = (arrs = []) => {
    try {
      const abilities = getAbilitiesByGroup(roles);

      return arrs.filter((ss) => {
        if (ss?.query?.group) {
          const primaries = abilities[ss?.query?.group];

          if (ss?.query?.type && primaries) {
            const secondaries = primaries.filter((uu) => uu?.type === ss?.query?.type) || [];

            if (ss?.query?.name) {
              const thrities = secondaries.filter((zz) => zz?.name === ss?.query?.name) || [];
              return thrities.length > 0;
            }

            if (ss?.query?.directAccess) {
              return ss?.query?.directAccess;
            }

            return secondaries.length > 0;
          }

          return primaries || null;
        }

        return null;
      });
    } catch (error) {
      return arrs;
    }
  };

  const disParseRoute = _.first(filterRouterList(routeQueries))?.url || _.first(routeQueries)?.url;

  return <Navigate to={disParseRoute} replace />;
};

export default RedirectGates;
