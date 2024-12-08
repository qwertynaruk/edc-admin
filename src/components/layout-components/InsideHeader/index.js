import { Dropdown, Layout, Menu, Typography } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { DatabaseOutlined } from '@ant-design/icons';
import LogoWithText from 'components/logo-components/logoWithText';
import NavNotification from '../NavNotification';
import NavProfile from '../NavProfile';
import RouteList from './route-list';
import SelectBranch from '../SelectBranch';
import TeamStore from 'mobx/TeamStore';
import _ from 'lodash';
import useBreakpoints from 'hooks/useBreakpoints';
import { useEffect } from 'react';
import usePermissionWall from 'hooks/usePermissionWall';
import useUser from 'hooks/services/useUser';

const { Header } = Layout;

const InsideHeader = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { roles } = useUser();
  const { isSmallScreen } = useBreakpoints();
  const selectedKeys = location.pathname;
  const explode = selectedKeys.split('/');

  const isNotSmallScreen = !isSmallScreen;

  const { hasTouchModules, hasTouchSubModules } = usePermissionWall();

  useEffect(() => {
    if (selectedKeys.includes('case-management')) {
      TeamStore.GetTeamList();
    }
  }, [selectedKeys]);

  const AttempSelect = () => {
    const jp = [...RouteList[explode[2]]].reverse().find((el) => el.path !== '' && selectedKeys.includes(el.path));
    return _.get(jp, 'path', null);
  };

  const AttempSubSelect = () => {
    const jp = RouteList[explode[2]].find((el) => el.path !== '' && selectedKeys.includes(el.path));
    // const jp = null

    if (jp && jp.children && jp.children.length > 0) {
      const atim = jp.children.find((ez) => selectedKeys.includes(ez.path));
      return _.get(atim, 'path', null);
    }

    return null;
  };

  const filterRouterList = (items = []) => {
    try {
      const modules = items?.filter((ss) => {
        const hasModules = hasTouchModules(ss?.query?.group);

        if (ss?.query?.type) {
          return (
            hasTouchSubModules({ moduleName: ss?.query?.group, subModuleName: ss?.query?.type, action: 'read' }) &&
            hasModules
          );
        }

        return hasModules;
      });
      return modules;
    } catch (error) {
      return [];
    }
  };

  return (
    <div className="gx-header-horizontal gx-header-horizontal-dark gx-inside-header-horizontal">
      <Header className="gx-header-horizontal-main">
        <div className="gx-container">
          <div className="gx-header-horizontal-main-flex">
            <div className="gx-d-lg-block gx-pointer gx-mr-xs-5 gx-logo gx-my-3">
              {isNotSmallScreen && (
                <Link to="/">
                  <div style={{ height: 40, width: 'auto' }}>
                    <LogoWithText size={9} src="/app/launchpad" />
                  </div>
                </Link>
              )}
              {isSmallScreen && (
                <div style={{ height: 40, width: 'auto' }}>
                  <LogoWithText size={3} src="/app/launchpad" />
                </div>
              )}
            </div>
            {/* {false && ( */}
            {isNotSmallScreen ? (
              <>
                <div className="gx-header-horizontal-nav gx-header-horizontal-nav-curve">
                  {/* lock path */}
                  {/* {explode.length > 2 && RouteList[explode[2]] && explode[2] !== 'incident-management' && ( */}
                  {explode.length > 2 && RouteList[explode[2]] && (
                    <Menu selectedKeys={[AttempSelect()]} mode="horizontal" className="ud-single-menu">
                      {filterRouterList(RouteList[explode[2]]).map((el) => (
                        <Menu.Item key={el.path}>
                          {!el.children ? (
                            <Link
                              to={el.path}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexDirection: 'row',
                                gap: 5,
                              }}
                            >
                              {el.icon} <span>{el.name}</span>
                            </Link>
                          ) : (
                            <Dropdown
                              overlay={
                                <Menu
                                  className="gx-mt-4"
                                  style={{ display: filterRouterList(el.children).length <= 0 ? 'none' : 'block' }}
                                  activeKey={AttempSubSelect()}
                                  onClick={(e) => {
                                    if (e.key === '#') {
                                      return;
                                    }
                                    navigate(el.path + e.key);
                                  }}
                                >
                                  {filterRouterList(el.children).map((es, _ix) => {
                                    if (!es.children) {
                                      return (
                                        <Menu.Item
                                          key={es.path}
                                          className={`gx-py-2 ${es.path === '#' && 'gx-not-allowed'}`}
                                        >
                                          {es.icon} <span className="gx-ml-1">{es.name}</span>
                                        </Menu.Item>
                                      );
                                    }
                                    return (
                                      <Menu.SubMenu key={es.path} title={es.name} icon={<DatabaseOutlined />}>
                                        {filterRouterList(es.children).map((ez, __) => (
                                          <Menu.Item key={ez.path}>
                                            {ez.icon} <span className="gx-ml-1">{ez.name}</span>
                                          </Menu.Item>
                                        ))}
                                      </Menu.SubMenu>
                                    );
                                  })}
                                </Menu>
                              }
                            >
                              <Typography.Text>
                                {el.icon} <span>{el.name}</span>
                              </Typography.Text>
                            </Dropdown>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu>
                  )}
                </div>
                <ul className="gx-header-notifications gx-ml-auto">
                  <li className="gx-notify">
                    <SelectBranch />
                  </li>
                  <li className="gx-notify">
                    <NavNotification {...props} />
                  </li>

                  <li className="gx-user-nav gx-m-0">
                    <NavProfile />
                  </li>
                </ul>
              </>
            ) : (
              <>
                <div className="gx-header-horizontal-nav gx-header-horizontal-nav-curve"></div>
                <ul className="gx-header-notifications gx-ml-auto">
                  <li className="gx-notify">
                    <SelectBranch />
                  </li>
                  <li className="gx-notify">
                    <NavNotification {...props} />
                  </li>
                  <li className="gx-user-nav gx-m-0">
                    <NavProfile />
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>
      </Header>
    </div>
  );
};

export default InsideHeader;
