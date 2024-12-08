import { LoadingOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';
import { Menu, Spin } from 'antd';
import SideMenuItem from 'components/layout-components/SideMenuItem';
import useService from 'hooks/useService';
import produce from 'immer';
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import PersonnelService from 'services/PersonelService';
import { serviceWrapper } from 'utils/serviceHelper';

export function getDepartments(department, subDepartment) {
  const sd = produce(subDepartment, () => {});
  const idMap = {};
  for (let i = 0; i < sd.length; i++) {
    idMap[sd[i].id] = sd[i];
  }

  const d = produce(department, (draft) => {
    for (let i = 0; i < draft.length; i++) {
      for (let j = 0; j < draft[i].root.length; j++) {
        const id = draft[i].root[j].id;
        if (idMap[id]) {
          draft[i].root[j].children = idMap[id].children;
        }
      }
    }
  });

  const result = produce(d, (draft) => {
    draft[0].children = draft[0].root;
    delete draft[0].root;
  });
  return result;
}

export default function PersonnelSideMenu(props) {
  const { state, countAll, onMenuChange } = props;
  const [subDepartment, setSubDepartment] = useState({});
  const [openKeys, setOpenKeys] = useState([]);

  const { data: departments, loading: departmentLoading } = useService(
    serviceWrapper(PersonnelService.getCountByType),
    () => {
      return {
        params: {
          hotfix: 'department',
        },
      };
    }
  );
  const { data: currentSubDepartment, loading: subDepartmentLoading } = useService(
    serviceWrapper(PersonnelService.getCountByType),
    () => {
      if (!departments) return null;
      if (state.menu === 'ผู้ใช้งานทั้งหมด' && openKeys.length === 0) {
        return null;
      }
      // const sids = departments.flatMap((d) => {
      //   return d.root_department.map((rd) => rd._id);
      // });
      return {
        params: {
          hotfix: 'sub-department',
          role_level_type: 'personnel_department',
          role_level_ids: openKeys.join(','),
        },
      };
    }
  );
  const groupDepartment = useCallback((departments, subDepartment = []) => {
    if (!departments) return [];
    if (!subDepartment) return [];
    return departments.map((item) => {
      return {
        ...item,
        children: item?.root_department?.map((rd) => {
          return {
            ...rd,
            children: subDepartment[rd._id]?.department_subordinates,
          };
        }),
      };
    });
  }, []);

  const getCount = useCallback((item, loading) => {
    if (loading) return <LoadingOutlined />;
    if (!item) return 0;
    if (item.department_personnel_count) return item.department_personnel_count;
    if (item.organization_personnel_count) return item.organization_personnel_count;
    return 0;
  }, []);
  const menuItems = useMemo(() => {
    const all = {
      key: 'ผู้ใช้งานทั้งหมด',
      label: <SideMenuItem left="ผู้ใช้งานทั้งหมด" right={countAll} />,
    };
    if (!departments) return [all];
    const grouped = groupDepartment(departments, subDepartment);
    const toSideMenuItem = (item) => {
      return {
        key: item._id,
        label: <SideMenuItem left={item.name} right={getCount(item, subDepartmentLoading)} />,
        children: (item.children || []).length > 0 ? item.children?.map(toSideMenuItem) : null,
      };
    };
    return [all, ...grouped.map(toSideMenuItem)];
  }, [countAll, departments, getCount, groupDepartment, subDepartment, subDepartmentLoading]);

  const onOpenChange = (openKeys) => {
    if (!Array.isArray(openKeys)) {
      return;
    }

    if (openKeys.length < 1) {
      return;
    }

    const departmentKeys = _.compact(
      openKeys.flatMap((key) => departments.find((item) => item?._id === key)?.root_department).map((item) => item?._id)
    );
    // const subKeys = _.compact(openKeys.flatMap((key) => subDepartment[key]));
    // const allKeys = [...departmentKeys, ...subKeys];
    const allKeys = [...departmentKeys];
    setOpenKeys(allKeys);
  };

  useEffect(() => {
    if (!Array.isArray(currentSubDepartment)) return;
    setSubDepartment((prev) => {
      // const sub = currentSubDepartment
      //   .flatMap((s) => s.department_subordinates)
      //   .reduce((acc, item) => {
      //     acc[item._id] = item;
      //     return acc;
      //   }, {});
      const root = currentSubDepartment.reduce((acc, item) => {
        acc[item._id] = item;
        return acc;
      }, {});
      return {
        ...prev,
        // ...sub,
        ...root,
      };
    });
  }, [currentSubDepartment]);
  return (
    <Spin spinning={departmentLoading}>
      <Menu
        selectedKeys={[state.menu]}
        onClick={onMenuChange}
        mode="inline"
        items={menuItems}
        onOpenChange={onOpenChange}
        onSelect={(event) => {
          console.debug('onSelect', event);
        }}
        className={css`
          .ant-menu-sub {
            padding-left: 16px;
          }
          .ant-menu-submenu > .ant-menu.ant-menu-sub .ant-menu-item {
            padding-left: 24px !important;
          }
        `}
      />
    </Spin>
  );
}
