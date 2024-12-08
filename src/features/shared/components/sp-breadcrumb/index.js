import { Breadcrumb, Typography } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import React, { useMemo } from 'react';

const rootRoute = [
  {
    name: 'หน้าหลัก',
    url: '/app',
  },
];

export function SpBreadCrumb(props) {
  const { pageName = '', parentRoute = [] } = props;

  const locations = useLocation();
  const { convert } = useRenderUrl(locations.pathname);

  const pathRoutes = useMemo(() => {
    try {
      const paths = locations.pathname.split('/');
      const childParentPaths = paths.filter((ss) => ss);

      const handleLastIndex = pageName
        ? childParentPaths.filter((_, index) => index !== childParentPaths.length - 1)
        : childParentPaths;

      const routes = handleLastIndex?.map((ss, index) => ({
        name: ss === 'app' ? 'หน้าหลัก' : ss.replaceAll('-', ' '),
        url: index === handleLastIndex.length - 1 && !pageName ? '' : convert(ss),
      }));

      return routes;
    } catch (error) {
      return [];
    }
  }, [locations.pathname, pageName]);

  const BreadcrumbItems = ({ routeItems = [] }) => {
    return routeItems.map((ss, index) => (
      <React.Fragment key={index}>
        {index > 0 && <Breadcrumb.Separator />}
        {ss.url ? (
          <Link to={ss.url}>
            <Typography.Text style={{ textTransform: 'capitalize' }}>{ss.name}</Typography.Text>
          </Link>
        ) : (
          <Typography.Text style={{ textTransform: 'capitalize', opacity: 0.8 }}>{ss.name}</Typography.Text>
        )}
      </React.Fragment>
    ));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
      {parentRoute && parentRoute.length > 0 ? (
        <BreadcrumbItems routeItems={rootRoute.concat(parentRoute)} />
      ) : (
        <BreadcrumbItems routeItems={pathRoutes} />
      )}

      {pageName && <Breadcrumb.Separator />}
      {pageName && <Typography.Text style={{ textTransform: 'capitalize', opacity: 0.8 }}>{pageName}</Typography.Text>}
    </div>
  );
}

function useRenderUrl(basePathName) {
  const convert = (keys) => {
    try {
      const paths = basePathName.split('/').filter((ss) => ss);

      const keyIndex = paths.findIndex((ss) => ss === keys);

      const cutPath = paths.slice(0, keyIndex + 1);

      return `/${cutPath.join('/')}`;
    } catch (error) {
      return '/';
    }
  };

  return {
    convert,
  };
}
