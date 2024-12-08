import 'styles/sweetalert/index.scss';

import { Button, Card, Input, Tag, Tooltip } from 'antd';
import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import _, { first } from 'lodash';
import { useEffect, useMemo, useState } from 'react';

import { GuardHandlesV2 } from 'components/shared-components/Guarded';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import PersonnelService from 'services/PersonelService';
import TableHeros from 'components/shared-components/TableHeros';
import UserStore from 'mobx/UserStore';
import { findAndPushDataToChildren } from 'utils/OrganizationHelper';
import { findTitleByKey } from 'utils/findChildren';
// import { findChildData } from 'utils/OrganizationHelper';
import { observer } from 'mobx-react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

const maxExpandLevel = 5;

export const GLOBALS_PROPS = {
  confirmButtonColor: '#1B2531',
  confirmButtonText: 'ยืนยัน',
  cancelButtonText: 'ยกเลิก',
};
const CustomButtonStyle = styled(Button)({
  '& svg': {
    color: '#ffffff',
  },
  '.ant-btn': {
    margin: '0px !important',
  },
});

const Organization = () => {
  const { canCreate, canUpdate } = GuardHandlesV2({ group: 'System Administration', type: 'ตัวจัดการองค์กร' });
  const navigate = useNavigate();
  const [searchOrganization, setSearchOrganization] = useState({});
  const [dataSourceTable, setDataSourceTable] = useState([]);
  const [searchText, setSearchText] = useState('');
  const { organization, selectBranch } = UserStore;
  const [currentOrgLv, setCurrentOrgLv] = useState(maxExpandLevel);
  const maxSearchExpandLevel = organization?.org_level ? organization?.org_level + maxExpandLevel : null;
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const mapData = useMemo(() => {
    const mapDataChildren = (dataSourceChildren = []) => {
      return dataSourceChildren.map((dataChild) => {
        return {
          key: dataChild._id,
          name: dataChild.full_name_th,
          abbreviation: dataChild.short_name_th,
          tags: dataChild.tags,
          level: dataChild.org_level,
          numberOfUsers: 0,
          isChildren: dataChild?.is_children,
          departmentPath: dataChild?.department_path,
          parentId: dataChild?.parent_id,
          children:
            dataChild?.is_children || (dataChild.children || []).length > 0
              ? mapDataChildren(dataChild.children)
              : null,
        };
      });
    };

    return (dataSource = {}) => {
      return [
        {
          key: dataSource._id,
          name: dataSource.full_name_th,
          abbreviation: dataSource.short_name_th,
          tags: dataSource.tags,
          organization: dataSource?.organization,
          level: dataSource.org_level,
          numberOfUsers: 0,
          isChildren: dataSource?.is_children,
          departmentPath: dataSource?.department_path,
          parentId: dataSource?.parent_id,
          children:
            dataSource?.is_children || (dataSource?.children || []).length > 0
              ? mapDataChildren(dataSource.children)
              : null,
        },
      ];
    };
  }, []);

  const { data, isLoading } = PersonnelService.useGetOrgnanizationTree({
    queryParams: { org_level: maxSearchExpandLevel, organization: selectBranch?.chooseBranch?.value },
  });

  const { data: dataChild, isLoading: isLoadingChild } = PersonnelService.useGetOrgnanizationByPath({
    searchOrganization,
    queryParams: {
      department_path: searchOrganization?.departmentPath,
      org_level: currentOrgLv || maxSearchExpandLevel,
      organization: selectBranch?.chooseBranch?.value,
    },
  });

  const findOrganaizationRelated = (record, action = 'create') => {
    let lv2Name = record?.key !== dataSourceTable?.[0]?.key ? record?.name : null;
    if (action === 'edit') {
      const findParent = findTitleByKey(dataSourceTable, record?.parentId, true);
      lv2Name = findParent?.name || null;
    }
    navigate(action, {
      state: {
        key: record?.key,
        level: record?.level,
        organizationLv1: dataSourceTable?.[0]?.key ? dataSourceTable?.[0]?.name : null,
        organizationLv2: lv2Name,
      },
    });
  };

  const columns = [
    {
      title: 'ชื่อ',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (text) => {
        return text.length > 155 ? (
          <Tooltip title={text}>
            <div style={{ whiteSpace: 'nowrap', width: '155px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {text}
            </div>
          </Tooltip>
        ) : (
          text
        );
      },
    },
    {
      title: 'ชื่อย่อ',
      dataIndex: 'abbreviation',
      key: 'abbreviation',
      width: 100,
    },
    {
      title: 'ป้ายกำกับ',
      dataIndex: 'tags',
      key: 'tags',
      width: 400,
      render: (tags) => (tags || []).map((tag, index) => <Tag key={index}>{tag}</Tag>),
    },
    {
      title: 'ระดับ',
      dataIndex: 'level',
      key: 'level',
      width: 100,
    },
    // {
    //   title: 'จำนวนผู้ใช้งาน',
    //   dataIndex: 'numberOfUsers',
    //   key: 'numberOfUsers',
    // },
    {
      title: '',
      key: 'action',
      width: 70,
      render: (record) => (
        <>
          {canCreate && (
            <CustomButtonStyle
              type="link"
              icon={<PlusCircleOutlined />}
              size="small"
              style={{ marginRight: '0px' }}
              onClick={() => findOrganaizationRelated(record)}
            />
          )}

          {canUpdate && (
            <CustomButtonStyle
              type="link"
              icon={<EditOutlined />}
              style={{ marginRight: '0px' }}
              size="small"
              onClick={() => findOrganaizationRelated(record, 'edit')}
            />
          )}
          {/* <CustomButtonStyle
            type="link"
            icon={<DeleteOutlined />}
            style={{ marginRight: '0px' }}
            size="small"
            onClick={() => {
              console.log('delete');
              // navigate('create');
              Swal.fire({
                title: 'ยืนยันการลบหน่วยงานหรือองค์กร',
                html: '<span>กรุณากรอกข้อความต่อไปนี้ “<span style="color: red">ORGANIZATION</span>” เพื่อยืนยันการลบ</span>',
                icon: 'warning',
                input: 'text',
                inputPlaceholder: 'กรอกข้อความ',
                inputValidator: (value) => {
                  if (!value) {
                    return 'กรุณากรอกข้อความ';
                  }
                  if (value !== 'ORGANIZATION') {
                    return 'กรุณากรอกข้อความให้ถูกต้อง';
                  }
                },
                showCancelButton: true,
                ...GLOBALS_PROPS,
                customClass: {
                  input: 'input-input-placeholder',
                  icon: 'swal2-icon-custom-color',
                },
                confirmButtonColor: '#e61414',
                cancelButtonColor: '#495762',
                reverseButtons: true,
              }).then((res) => {
                if (res.isConfirmed) {
                  console.log('confirm');
                } else {
                  console.log('cancel clear');
                }
              });
            }}
          /> */}
        </>
      ),
    },
  ];

  // ที่ ไชโย หาไม่เจอเพราะว่า มันไปหา ตามลำดับ พอมันไม่เจอแม่ ก็เลยไม่เเข้าไปหาลูกต่อ พักไว้ก่อน(รอแก้)
  function filterByName(dataSource = [], searchText) {
    console.log(searchText);
    return dataSource.filter((item) => {
      if (item.name.toLowerCase().includes(searchText.toLowerCase())) {
        if (item.children) {
          item.children = filterByName(item.children, searchText);
        }
        return true;
      }
      return false;
    });
  }

  useEffect(() => {
    if (data) {
      const mapDataList = Object.assign([], mapData(data));
      console.log('mapDataList', mapDataList);

      if (!_.isEmpty(searchOrganization) && !_.isEmpty(dataChild)) {
        findAndPushDataToChildren(
          mapDataList,
          searchOrganization?.departmentId,
          searchOrganization?.level,
          mapData(dataChild)
        );
      }
      if (searchText) {
        const searchResult = filterByName(mapDataList, searchText);
        setDataSourceTable(searchResult);
        return;
      }
      setDataSourceTable(mapDataList);

      setExpandedRowKeys([first(mapDataList)?.key]);
    }
  }, [data, dataChild, searchText]);

  const onSearch = (value) => {
    setSearchText(value);
  };

  const onSearchV2 = (txt) => {
    const value = txt.target.value;
    console.log(value);

    // const x = dataSourceTable.children
  };

  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'ตั้งค่า', subpath: 'ตัวจัดการองค์กร' }} />
      <Card>
        <Input.Search placeholder="ค้นหา" onSearch={onSearch} onKeyUp={onSearchV2} allowClear />
      </Card>
      <Card>
        <TableHeros
          rowKey="key"
          expandable={{
            expandedRowKeys,
            onExpand: (expan, record) => {
              if (expan) {
                setExpandedRowKeys((ss) => [...ss, record?.key]);
              } else {
                const bb = expandedRowKeys?.filter((ss) => ss !== record?.key);
                setExpandedRowKeys(bb);
              }
              setCurrentOrgLv(record?.level + maxExpandLevel);
              if (expan && record?.children?.length === 0) {
                setSearchOrganization({
                  departmentPath: record?.departmentPath,
                  departmentId: record?.key,
                  level: record?.level,
                });
              } else {
                setSearchOrganization({});
              }
            },
          }}
          loading={isLoading || isLoadingChild}
          columns={columns}
          dataSource={dataSourceTable}
        />
      </Card>
    </>
  );
};

export default observer(Organization);
