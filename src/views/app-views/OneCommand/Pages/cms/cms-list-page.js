import { Button, Menu, Skeleton, Typography } from 'antd';
import { CmsBannerCreateDialog, CmsBannerList, CmsIcon, useListCmsBanner } from 'features/content-management-system';

import { FallbackError } from 'components/util-components/fallback-error';
import Flex from 'components/shared-components/Flex';
import Guarded from 'components/shared-components/Guarded';
import LabsContent from 'components/layout-components/LabsContent';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import { css } from '@emotion/css';
import { useNavigate } from 'react-router-dom';
import { useSearchParamsState } from '../../../../../features/shared';
import { useState } from 'react';

const StatusLabel = ({ label, count }) => (
  <Flex alignItems="center" className="gx-mb-2" justifyContent="between">
    <span className="ant-menu-title-content">{label}</span>
    <span className="ant-menu-title-content gx-ml-2">{count}</span>
  </Flex>
);

const CmsListPage = () => {
  const [params, onChangeParams] = useSearchParamsState({
    keys: ['status'],
    defaultValues: ['เผยแพร่'],
  });

  const { data, isLoading, isError } = useListCmsBanner({
    limit: 9999,
  });

  const navigation = useNavigate();

  const [isOpenBannerContentCreateDialog, setOpenBannerContentCreateDialog] = useState(false);

  const onToggleBannerContentCreateDialog = () => {
    setOpenBannerContentCreateDialog((prev) => !prev);
  };

  const onEdit = (data) => navigation(`/app/one-command/cms/update/${data?._id}`);

  if (isError) {
    return <FallbackError />;
  }

  const statusMenu = () => {
    return Object.entries(data?.meta?.status ?? {}).map(([key, value]) => {
      return {
        label: <StatusLabel label={key} count={value} />,
        key,
      };
    });
  };

  return (
    <>
      <PageBreadcrumb pageLabel={{ subpath: 'Content Management System' }} />
      <div
        className={css`
          .gx-module-box-content {
            overflow-y: auto !important;
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
              <CmsIcon width={30} height={30} />
              <Typography.Title level={5} className="gx-mb-0">
                Content <br /> Management System
              </Typography.Title>
            </div>
          }
          sideContent={
            isLoading ? (
              <Skeleton active className="gx-p-3" />
            ) : (
              <div className="gx-p-3 gx-d-flex gx-flex-column">
                <Guarded query={{ group: 'One Command', type: 'Content Management System', action: 'create' }}>
                  <Button
                    type="primary"
                    block
                    style={{
                      marginBottom: '10px',
                    }}
                    onClick={onToggleBannerContentCreateDialog}
                  >
                    เพิ่ม
                  </Button>
                </Guarded>
                <Menu
                  selectedKeys={[params?.status]}
                  onClick={({ key }) => {
                    onChangeParams({
                      keys: ['status'],
                      values: [key],
                    });
                  }}
                  className={css`
                    .ant-menu-item {
                      padding: 0 !important;
                    }
                  `}
                  mode="inline"
                  items={statusMenu()}
                />
              </div>
            )
          }
          header={<></>}
        >
          <CmsBannerList status={params?.status} onEdit={onEdit} />
        </LabsContent>
        <CmsBannerCreateDialog visible={isOpenBannerContentCreateDialog} onClose={onToggleBannerContentCreateDialog} />
      </div>
    </>
  );
};

export default CmsListPage;
