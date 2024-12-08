import { Card, List, Skeleton, Typography } from 'antd';
import { NotificationItem, NotificationItemMeta } from 'components/layout-components/NavNotification';
import { usePagination, useSearchParamsState } from 'features/shared';

import EmptyDisplay from 'utils/EmptyDisplay';
import NotificationService from 'services/NotificationService';
import NotificationStore from 'mobx/NotificationStore';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import { observer } from 'mobx-react';
import styled from '@emotion/styled';

const Title = styled(Typography.Title)`
  ${(props) => props.level === 1 && `font-size: 1.5rem !important;`}
`;

const NotificationList = (props) => {
  const { history, match } = props;
  const { onPaginationChange, Pagination } = usePagination({});
  const [params, onChangeParams] = useSearchParamsState({
    keys: ['sort_field', 'sort_value', 'page', 'page_size', 'from'],
    defaultValues: ['created_at', 'desc', 1, 10, 'web'],
  });
  // console.log('notifications', JSON.parse(JSON.stringify(notifications)));
  const {
    data: notificationList,
    isLoading,
    // refetch,
  } = NotificationService.useGetNotificationList({
    queryParams: {
      ...params,
    },
  });

  return (
    <>
      <PageBreadcrumb history={history} pageLabel={{ master: 'การแจ้งเตือน' }} />

      <Card>
        <Title level={4}>การแจ้งเตือน</Title>
        <div
          id="scrollableDiv"
          style={{
            maxHeight: '700px',
            overflow: 'auto',
          }}
        >
          {isLoading ? (
            <Skeleton />
          ) : (
            <List
              loading={NotificationStore.content_loading}
              dataSource={notificationList?.data}
              locale={EmptyDisplay.byLocale}
              renderItem={(item) => (
                <NotificationItem item={item} isLoading={isLoading}>
                  <NotificationItemMeta item={item} />
                </NotificationItem>
              )}
            />
          )}
        </div>
        <div style={{ marginTop: 10 }}>
          <Pagination
            total={notificationList?.total_record}
            current={parseInt(params?.page) ?? 1}
            pageSize={params?.page_size}
            onChange={(page, pageSize) => {
              onChangeParams({
                keys: ['page', 'page_size'],
                values: [page, pageSize],
              });
              onPaginationChange(page, pageSize);
            }}
          />
        </div>
      </Card>
    </>
  );
};

export default observer(NotificationList);
