import { useLocation, useNavigate } from 'react-router-dom';

// import { getBreadcrumb } from 'utils/breadcrumbHis';
import { AppMenuList } from '../../views/app-views/launchpad/AppMenuList';
import { AppMenuListOneCommand } from '../../views/app-views/OneCommand/AppMenuList';
import Flex from 'components/shared-components/Flex';
import { Space } from 'antd';
import { dataSettingList } from 'views/app-views/SettingGlobals/Pages/MenuPanel';
import { pathNames } from '../../views/app-views/IncidentManagement/index';
import { useMemo } from 'react';
import { v4 as uuid } from 'uuid';

const PageBreadcrumb = (props) => {
  const { master, pageLabel, children, ...otherProps } = props;
  const { subpath = false } = pageLabel;

  const navigate = useNavigate();
  const location = useLocation();
  const propsFilter = Object.fromEntries(Object.entries(otherProps).filter((e) => e[0] !== 'className'));

  // console.log('location', location?.pathname?.split('/'));

  const getBreadcrumbList = useMemo(() => {
    // map child data
    // console.log('pathNames,pathNames', pathNames);
    let incidentManagementChildList = Object.values(pathNames) || [];
    // console.log('incidentManagementChildList', incidentManagementChildList);
    incidentManagementChildList = incidentManagementChildList.map((rowChild) => ({
      parentKey: rowChild.query.group,
      name: rowChild.query.type,
      direct_url: rowChild.url,
    }));
    // console.log('AppMenuListOneCommand', AppMenuListOneCommand);

    const oneCommandChildList = AppMenuListOneCommand.map((rowChild) => ({
      parentKey: rowChild.query.group,
      name: rowChild.query.type,
      direct_url: rowChild.direct_url,
    }));

    const settingChildList = dataSettingList.map((rowChild) => ({
      parentKey: rowChild.parentKey,
      name: rowChild.name,
      direct_url: rowChild.route,
    }));

    let masterList = [];
    Object.assign(masterList, AppMenuList);
    masterList = masterList.map((rowData) => {
      if (incidentManagementChildList.some((dd) => dd.parentKey === rowData.key)) {
        rowData.child = incidentManagementChildList;
      }
      if (oneCommandChildList.some((dd) => dd.parentKey === rowData.key)) {
        rowData.child = oneCommandChildList;
      }

      if (settingChildList.some((dd) => dd.parentKey === rowData.key)) {
        rowData.child = settingChildList;
      }
      // console.log('rowData.key', rowData.direct_url);
      const findMasterPath = location?.pathname?.search(rowData.direct_url);
      // console.log('findMasterPath', findMasterPath);
      if (findMasterPath >= 0) {
        rowData.active = true;
        if (rowData?.child?.length >= 0) {
          rowData.child = rowData.child.map((rowChild) => {
            const findMasterSubPath = location?.pathname?.search(rowChild.direct_url);
            if (findMasterSubPath >= 0 && rowChild.direct_url) {
              rowChild.active = true;
              rowChild.fullUrl = `${rowData.direct_url}/${rowChild.direct_url}`;
            } else {
              rowChild.active = false;
            }
            return rowChild;
          });
        }
      } else {
        rowData.active = false;
      }

      return rowData;
    });
    return masterList;
  }, [location?.pathname]);

  return (
    <div className={`gx-mb-5 ${otherProps.className || ''}`} {...propsFilter}>
      <Flex justifyContent="between">
        <div style={{ overflowX: 'scroll' }}>
          <Space style={{ width: 700 }}>
            <span onClick={() => (window.location.href = '/')} className="gx-pointer">
              หน้าหลัก
            </span>
            {master ? (
              <>/{master}</>
            ) : (
              getBreadcrumbList
                .filter((d) => d.active)
                .map((rowData) => (
                  <span key={uuid()} className="gx-mr-0">
                    {rowData.active && (
                      <>
                        {rowData.name && (
                          <>
                            <span className="gx-mr-2">/</span>
                            <span className="gx-pointer" onClick={() => navigate(rowData.direct_url)}>
                              {rowData.name}
                            </span>
                          </>
                        )}
                        {rowData?.child?.map((rowChild) => (
                          <span key={uuid()}>
                            {rowChild.active && rowChild.name && rowChild.name !== subpath && (
                              <>
                                <span className="gx-mx-2">/</span>
                                <span
                                  className={rowChild.fullUrl && subpath ? 'gx-pointer' : ''}
                                  onClick={() => (rowChild.fullUrl && subpath ? navigate(rowChild.fullUrl) : '')}
                                >
                                  {rowChild.name}
                                </span>
                              </>
                            )}
                          </span>
                        ))}
                      </>
                    )}
                  </span>
                ))
            )}
            {subpath && (
              <>
                {subpath &&
                  (Array.isArray(subpath) ? (
                    subpath.map((el, _key) => (
                      <>
                        {el && (
                          <span key={_key}>
                            <span className="gx-mr-2">/</span>
                            {el?.url ? (
                              <span className="gx-pointer" onClick={() => navigate(el.url)}>
                                {el.pathName}
                              </span>
                            ) : (
                              <span>{el?.pathName || el}</span>
                            )}
                          </span>
                        )}
                      </>
                    ))
                  ) : (
                    <>
                      {subpath && (
                        <>
                          <span>/</span>
                          <span>{subpath}</span>
                        </>
                      )}
                    </>
                  ))}
              </>
            )}
          </Space>
        </div>
        <Space>{children}</Space>
      </Flex>
    </div>
  );
};

export default PageBreadcrumb;
