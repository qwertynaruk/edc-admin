/* eslint-disable prettier/prettier */
import 'dayjs/locale/th';
import './cms-banner-list.css';

import { DownIcon, DownLastIcon, UpFirstIcon, UpIcon } from '../../icons';
import { Dropdown, Menu, Typography } from 'antd';
import { MenuOutlined, MoreOutlined } from '@ant-design/icons';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { useMemo, useState } from 'react';

import { CmsBannerCancelDialog } from '../cms-banner-cancel-dialog';
import { CmsBannerDeleteDialog } from './components/cms-banner-delete-dialog';
import { CmsBannerPublishNowDialog } from '../cms-banner-publish-now-dialog';
import { CmsBannerPublishScheduleDialog } from '../cms-banner-publish-schedule-dialog';
import DialogNotification from 'components/shared-components/DialogNotification';
import { GuardHandlesV2 } from 'components/shared-components/Guarded';
import TableHeros from 'components/shared-components/TableHeros';
import { arrayMoveImmutable } from 'array-move';
import { css } from '@emotion/css';
import dayjs from 'dayjs';
import moment from 'moment';
import { useListCmsBanner } from '../../api/list-cms-banner';
import { useToggle } from '@mantine/hooks';
import { useUpdateCmsBanner } from '../../api/update-cms-banner';
import { useUpdateCmsBannerOrders } from '../../api/update-cms-banner-orders';

dayjs.locale('th');

const getIconReOrderClass = (active) => {
  if (!active) {
    return 'reorder-icon reorder-icon-inactive';
  }

  return 'reorder-icon';
};

const DragHandle = SortableHandle(() => (
  <MenuOutlined
    style={{
      cursor: 'grab',
      color: '#999',
    }}
  />
));

const SortableItem = SortableElement((props) => <tr {...props} />);
const SortableBody = SortableContainer((props) => <tbody {...props} />);

export const CmsBannerList = ({ status, onEdit }) => {
  const { canUpdate, canDelete } = GuardHandlesV2({ group: 'One Command', type: 'Content Management System' });
  const [isOpenDeleteDialog, toggleDeleteDialog] = useToggle();
  const [isPublishDialog, togglePublishDialog] = useToggle();
  const [isPublishScheduleDialog, togglePublishScheduleDialog] = useToggle();
  const [isCancelDialog, toggleCancelDialog] = useToggle();
  const [selectedData, setSelectedData] = useState(null);

  const { data, isLoading } = useListCmsBanner({
    status,
    limit: 9999,
  });

  const updateCmsBannerOrders = useUpdateCmsBannerOrders({
    status,
  });

  const sortDataRes = useMemo(() => {
    return (data?.data || []).sort((a, b) => a?.order - b?.order);
  }, [data?.data]);

  const updateCmsBanner = useUpdateCmsBanner({
    bannerId: selectedData?._id,
    onSuccess: () => {
      if (isPublishDialog) {
        togglePublishDialog();
      }
      if (isPublishScheduleDialog) {
        togglePublishScheduleDialog();
      }
      if (isCancelDialog) {
        toggleCancelDialog();
      }
      setSelectedData(null);
      DialogNotification('success', 'สำเร็จ', `เวลา ${moment().format('LT ll')}`);
    },
  });

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const dataSource = data?.data ?? [];
      const newData = arrayMoveImmutable(dataSource.slice(), oldIndex, newIndex).filter((el) => !!el);
      const newOrder = newData.map((el, index) => ({
        ObjectUUID: el._id,
        order: index + 1,
      }));
      updateCmsBannerOrders.submit(newOrder);
    }
  };

  const DraggableContainer = (props) => (
    <SortableBody useDragHandle disableAutoscroll helperClass="row-dragging" onSortEnd={onSortEnd} {...props} />
  );

  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    const index = data?.data.findIndex((x) => x?._id === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  const onUpFirst = (index) => onSortEnd({ oldIndex: index, newIndex: 0 });
  const onUp = (index) => onSortEnd({ oldIndex: index, newIndex: index - 1 });
  const onDown = (index) => onSortEnd({ oldIndex: index, newIndex: index + 1 });
  const onDownLast = (index) => onSortEnd({ oldIndex: index, newIndex: data?.data.length - 1 });

  const onDelete = (data) => {
    setSelectedData(data);
    toggleDeleteDialog();
  };

  const onPublishNow = (data) => {
    setSelectedData(data);
    togglePublishDialog();
  };

  const onPublishSchedule = (data) => {
    setSelectedData(data);
    togglePublishScheduleDialog();
  };

  const onCancelBanner = (data) => {
    setSelectedData(data);
    toggleCancelDialog();
  };

  const getActionMenu = (data) => {
    const viewMenu = {
      label: 'ดูข้อมูล',
      key: 'view',
      onClick: () => onEdit?.(data),
    };

    const cancelMenu = canUpdate
      ? {
        label: 'ยุติการเผยแพร่',
        key: 'cancel',
        onClick: () => onCancelBanner(data),
      }
      : undefined;

    const deleteMenu = canDelete
      ? {
        label: 'ลบ',
        key: 'delete',
        onClick: () => onDelete(data),
      }
      : undefined;

    const editMenu = canUpdate
      ? {
        label: 'แก้ไข',
        key: 'edit',
        onClick: () => onEdit?.(data),
      }
      : undefined;

    const publishMenu = canUpdate
      ? {
        label: 'เผยแพรทันที',
        key: 'publish',
        onClick: () => onPublishNow(data),
      }
      : undefined;

    const publishScheduleMenu = canUpdate
      ? {
        label: 'กำหนดวันเผยแพร่',
        key: 'publish-schedule',
        onClick: () => onPublishSchedule(data),
      }
      : undefined;

    switch (data?.status) {
      case 'เผยแพร่':
        return [viewMenu, cancelMenu];
      case 'ฉบับร่าง':
        return [deleteMenu, editMenu, publishMenu, publishScheduleMenu];
      case 'หยุดเผยแพร่':
        return [editMenu, publishMenu, publishScheduleMenu];
      default:
        return [];
    }
  };

  const columns = [
    {
      dataIndex: 'sort',
      key: 'sort',
      width: 60,
      align: 'center',
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      title: 'ลำดับ',
      key: 'index',
      width: 80,
      align: 'center',
      className: 'drag-visible',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'รูปแบนเนอร์',
      key: 'banner_image_url',
      width: 180,
      className: 'drag-visible',
      render: (data) => (
        <div
          onClick={() => {
            onEdit?.(data);
          }}
          style={{
            width: 150,
            height: 80,
            backgroundImage: `url(${data?.banner_image_url})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'left center',
            cursor: 'pointer',
          }}
        />
      ),
    },
    {
      title: 'ชื่อแบนเนอร์',
      key: 'name',
      dataIndex: 'name',
      className: 'drag-visible',
      width: 200,
    },
    {
      title: 'ประเภทแบนเนอร์',
      key: 'banner_type',
      dataIndex: 'banner_type',
      className: 'drag-visible',
      width: 150,
    },
    {
      title: 'วันที่อัปเดต',
      key: 'updated_at',
      className: 'drag-visible',
      width: 200,
      render: ({ updated_at, updated_by }) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
          }}
        >
          <Typography.Text
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {dayjs(updated_at).format('DD MMM YYYY HH:mm')}
          </Typography.Text>
          <Typography.Text
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            ผู้แก้ไข : {updated_by}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: 'สถานะ',
      key: 'status',
      dataIndex: 'status',
      width: 120,
      className: 'drag-visible',
    },
    {
      title: 'ตั้งการลำดับแสดง',
      key: 'order',
      width: 200,
      className: 'drag-invisible',
      render: (record, records, index) => {
        const isFist = index === 0;
        const isLasted = index === (data?.data?.length ?? 0) - 1;

        return (
          <div
            className={css`
              display: flex;
              gap: 5px;

              .reorder-icon {
                cursor: pointer;
                transition: all 0.3s;

                :hover {
                  color: #1890ff;
                }
              }

              .reorder-icon-inactive {
                color: #7f838d;
                cursor: not-allowed;
                pointer-events: none;
              }
            `}
          >
            <UpFirstIcon className={getIconReOrderClass(!isFist)} onClick={() => onUpFirst(index)} />
            <UpIcon className={getIconReOrderClass(!isFist)} onClick={() => onUp(index)} />
            <DownIcon className={getIconReOrderClass(!isLasted)} onClick={() => onDown(index)} />
            <DownLastIcon className={getIconReOrderClass(!isLasted)} onClick={() => onDownLast(index)} />
          </div>
        );
      },
    },
    {
      key: 'action',
      width: 50,
      align: 'center',
      fixed: 'right',
      className: 'drag-invisible',
      render: (data) => (
        <Dropdown
          overlay={
            <Menu
              style={{
                width: 150,
              }}
              items={getActionMenu(data)}
            />
          }
        >
          <MoreOutlined
            style={{
              cursor: 'pointer',
            }}
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <>
      <TableHeros
        loading={isLoading || updateCmsBannerOrders.isLoading}
        className={css`
          .ant-table-tbody > tr > td {
            vertical-align: top;
          }
        `}
        tableLayout="fixed"
        columns={canUpdate ? columns : columns.filter((ss) => !['order', 'sort'].includes(ss.key) && ss.key)}
        dataSource={sortDataRes}
        pagination={false}
        components={{
          body: {
            wrapper: DraggableContainer,
            row: DraggableBodyRow,
          },
        }}
      />
      <CmsBannerDeleteDialog
        open={isOpenDeleteDialog}
        data={selectedData}
        onClose={() => {
          toggleDeleteDialog();
          setSelectedData(null);
        }}
      />
      <CmsBannerPublishNowDialog
        open={isPublishDialog}
        onClose={() => {
          togglePublishDialog();
          setSelectedData(null);
        }}
        okButtonProps={{
          loading: updateCmsBanner.isLoading && isPublishDialog,
          onClick: () =>
            updateCmsBanner.submit({
              ...selectedData,
              status: 'เผยแพร่',
            }),
        }}
      />
      <CmsBannerPublishScheduleDialog
        open={isPublishScheduleDialog}
        onClose={() => {
          togglePublishScheduleDialog();
          setSelectedData(null);
        }}
        okButtonProps={{
          loading: updateCmsBanner.isLoading && isPublishScheduleDialog,
          onClick: (publish_date_str) =>
            updateCmsBanner.submit({
              ...selectedData,
              status: 'ฉบับร่าง',
              publish_date_str,
            }),
        }}
      />
      <CmsBannerCancelDialog
        open={isCancelDialog}
        onClose={() => {
          toggleCancelDialog();
          setSelectedData(null);
        }}
        okButtonProps={{
          loading: updateCmsBanner.isLoading && isCancelDialog,
          onClick: () =>
            updateCmsBanner.submit({
              ...selectedData,
              status: 'หยุดเผยแพร่',
            }),
        }}
      />
    </>
  );
};
