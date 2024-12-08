import { Button, Menu, Skeleton, Space, Typography } from 'antd';
import { PersonnelDeleteDialog, PersonnelList, PersonnelSearch, useListPersonnel } from 'features/personnel';

import { FallbackError } from 'components/util-components/fallback-error';
import Flex from 'components/shared-components/Flex';
import Guarded from 'components/shared-components/Guarded';
import { IdcardOutlined } from '@ant-design/icons';
import LabsContent from 'components/layout-components/LabsContent';
import OrganizationAll from 'components/shared-components/OrganizationAll';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import UserStore from 'mobx/UserStore';
import { css } from '@emotion/css';
import { useNavigate } from 'react-router-dom';
import { useSearch } from 'features/shared';
import { useState } from 'react';
import { useToggle } from '@mantine/hooks';

const defaultFilter = 'all';

const StatusLabel = ({ label, count }) => (
  <Flex alignItems="center" className="gx-mb-2" justifyContent="between">
    <span className="ant-menu-title-content">{label}</span>
    <span className="ant-menu-title-content gx-ml-2">{count}</span>
  </Flex>
);

const getPersonnelStatus = (status) => {
  const ORDER = ['กำลังพลทั้งหมด', 'ใช้งาน', 'ไม่ใช้งาน'];
  return ORDER.map((key) => ({
    key,
    label: <StatusLabel label={key} count={status[key] ?? 0} />,
  }));
};

const PersonnelListPage = () => {
  const [selectedStatus, setSelectedStatus] = useState('กำลังพลทั้งหมด');
  const { search, onSearch, debouncedSearch } = useSearch({});
  const [selectOrganization, setSelectOrganization] = useState(defaultFilter);
  const [isOpenDeleteDialog, toggleDeleteDialog] = useToggle();
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);
  const { user, organization } = UserStore;

  const navigate = useNavigate();

  // const { data: organizationTreeList, isLoading: isLoadinGorganizationTreeList } =
  //   PersonnelService.useGetOrgnanizationTree({
  //     queryParams: { org_level: 9999, organization: organization?.db_name },
  //   });

  // const organizationList = useMemo(() => mapOrgTreeToOneLevle(organizationTreeList, true), [organizationTreeList]);

  const { data, isLoading, isError } = useListPersonnel({});

  if (isError) {
    return <FallbackError />;
  }

  const onCreate = () => navigate('./create');

  const onEdit = (personnel) => navigate(`./${personnel.id}`);

  const onToggleDeleteDialog = (personnel) => {
    setSelectedPersonnel(personnel ?? null);
    toggleDeleteDialog();
  };

  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'กำลังพล' }} />
      <PersonnelSearch search={search} onSearch={onSearch} />
      <LabsContent
        titleContent={
          <Space>
            <IdcardOutlined style={{ fontSize: 24 }} />
            <Typography.Title level={5} className="gx-mb-0">
              กำลังพล
            </Typography.Title>
          </Space>
        }
        headerStyle={{ alignItems: 'end' }}
        header={
          <Flex justifyContent="between" className="gx-w-100">
            <OrganizationAll onChageOrganization={(value) => setSelectOrganization(value)} />
            {/* <Button type="primary">ออกรายงาน</Button> */}
          </Flex>
        }
        sideContent={
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '20px',
            }}
          >
            <Guarded query={{ group: 'Personnel', type: 'กำลังพล', action: 'create' }}>
              <Button type="primary" className="gx-mb-3" onClick={onCreate}>
                เพิ่ม
              </Button>
            </Guarded>
            {isLoading ? (
              <Skeleton />
            ) : (
              <Menu
                selectedKeys={[selectedStatus]}
                onSelect={({ key }) => setSelectedStatus(key)}
                className={css`
                  .ant-menu-item {
                    padding: 0 !important;
                  }
                `}
                mode="inline"
                items={getPersonnelStatus(data?.meta?.status)}
              />
            )}
          </div>
        }
      >
        <PersonnelList
          status={selectedStatus}
          search={debouncedSearch}
          onEdit={onEdit}
          onDelete={onToggleDeleteDialog}
          organization={selectOrganization}
        />
      </LabsContent>
      <PersonnelDeleteDialog
        title="ข้อมูลผู้ใช้งาน"
        open={isOpenDeleteDialog}
        onClose={toggleDeleteDialog}
        personnel={selectedPersonnel}
      />
    </>
  );
};

export default PersonnelListPage;
