import {
  IncidentManagementForwardedList,
  IncidentManagementList,
  IncidentManagementSearchBox,
  useListIncidentManagement,
} from 'features/incident-management';
import { Menu, Skeleton, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { ExceptionOutlined } from '@ant-design/icons';
import { FallbackError } from 'components/util-components/fallback-error';
import Flex from 'components/shared-components/Flex';
import LabsContent from 'components/layout-components/LabsContent';
import OrganizationAll from 'components/shared-components/OrganizationAll';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import { REPORT_TYPE_ID } from 'constants/IncidentConstant';
import ReportService from 'services/ReportServices';
import { css } from '@emotion/css';
import { useSearch } from 'features/shared';

const StatusLabel = ({ label, count }) => (
  <Flex alignItems="center" className="gx-mb-2" justifyContent="between">
    <span className="ant-menu-title-content">{label}</span>
    <span className="ant-menu-title-content gx-ml-2">{count}</span>
  </Flex>
);

const STATUS_ORDER = ['waiting', 'processing', 'completed', 'cancelled'];

const getIncidentStatus = (status, forwardedCount = 0) => {
  const allCount = status?.reduce((acc, item) => acc + item.count, 0);
  return [
    {
      label: <StatusLabel label="ทั้งหมด" count={allCount} />,
      key: 'all',
    },
    {
      label: 'สถานะรายงาน',
      key: 'status',
      children: [
        ...STATUS_ORDER.map((key) => {
          const item = status?.find((item) => item?.status_name_en === key);
          if (!item) return null;
          return {
            label: <StatusLabel label={item?.status_name_th} count={item.count} />,
            key: item?.status_name_th,
          };
        }),
      ],
    },
    {
      label: <StatusLabel label="ประวัติการส่งต่องาน" count={forwardedCount} />,
      key: 'forwarded',
    },
  ];
};
const defaultFilter = 'all';

const IncidentManagementListPage = () => {
  const [incidentCaseStatus, setIncidentCaseStatus] = useState('all');
  const { debouncedSearch, search, onSearch } = useSearch({});
  const [selectOrganization, setSelectOrganization] = useState(defaultFilter);

  const { data, isLoading, isError } = useListIncidentManagement({
    search: debouncedSearch,
    report_type_id: REPORT_TYPE_ID,
  });

  const { data: dataForwardList } = ReportService.useGetLogReportForwardList({
    queryParams: {
      search,
      page: 1,
      pageSize: 5,
    },
  });

  const [searchParams] = useSearchParams();

  const location = useLocation();
  const navigate = useNavigate();

  const onEdit = (data) => {
    if (incidentCaseStatus === 'forwarded') {
      // navigate(`${location.pathname}/${data.id}/forwarded`);
      window.location.href = `${location.pathname}/${data.id}/forwarded`;
    } else {
      navigate(`${location.pathname}/${data.id}`);
    }
  };

  useEffect(() => {
    if (searchParams.get('status')) {
      setIncidentCaseStatus(searchParams.get('status')?.toLowerCase() ?? 'all');
    }
  }, [searchParams]);

  if (isError) {
    return <FallbackError />;
  }

  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'Incident Management' }} />
      <IncidentManagementSearchBox searchValue={search} onSearchChange={onSearch} />
      <div
        className={css`
          .gx-module-box-content {
            overflow-y: auto !important;
          }

          .ant-menu-submenu-title {
            padding-left: 0 !important;
          }

          .ant-menu-submenu > .ant-menu.ant-menu-sub .ant-menu-item {
            padding-left: 24px !important;
          }
        `}
      >
        <LabsContent
          titleContent={
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 5,
              }}
            >
              <ExceptionOutlined
                style={{
                  fontSize: '30px',
                }}
              />
              <Typography.Title level={5} className="gx-mb-0">
                รายงานการแจ้งเหตุ
              </Typography.Title>
            </div>
          }
          sideContent={
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '20px',
              }}
            >
              {isLoading ? (
                <Skeleton />
              ) : (
                <Menu
                  defaultSelectedKeys={['all']}
                  selectedKeys={[incidentCaseStatus]}
                  onClick={({ key }) => setIncidentCaseStatus(key)}
                  defaultOpenKeys={['status']}
                  className={css`
                    .ant-menu-item {
                      padding: 0 !important;
                    }
                  `}
                  mode="inline"
                  items={getIncidentStatus(data?.count_status ?? [], dataForwardList?.total_record)}
                />
              )}
            </div>
          }
          header={
            <>
              <OrganizationAll onChageOrganization={(value) => setSelectOrganization(value)} />
            </>
          }
        >
          {incidentCaseStatus === 'forwarded' ? (
            <IncidentManagementForwardedList
              search={debouncedSearch}
              filterOganization={selectOrganization}
              onEdit={onEdit}
            />
          ) : (
            <IncidentManagementList
              status={incidentCaseStatus}
              filterOganization={selectOrganization}
              search={debouncedSearch}
              onEdit={onEdit}
            />
          )}
        </LabsContent>
      </div>
    </>
  );
};

export default IncidentManagementListPage;
