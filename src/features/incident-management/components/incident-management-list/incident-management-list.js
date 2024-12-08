import 'dayjs/locale/th';

import { Dropdown, Menu, Typography, notification } from 'antd';
import { useEffect, useState } from 'react';
import { usePagination, useSearchParamsState } from '../../../shared';

import Flex from 'components/shared-components/Flex';
import { GuardHandlesV2 } from 'components/shared-components/Guarded';
import { INCIDENT_MANAGEMENT_STATUS_MATA } from '../../constants';
import { IncidentManagementChangeCancelStatusConfirmDialog } from '../incident-management-change-cancel-status-confirm-dialog';
import { IncidentManagementChangeCompleteStatusConfirmDialog } from '../incident-management-change-complete-status-confirm-dialog';
import { MoreOutlined } from '@ant-design/icons';
import { REPORT_TYPE_ID } from 'constants/IncidentConstant';
import TableHeros from 'components/shared-components/TableHeros';
import dayjs from 'dayjs';
import { useChangeIncidentManagementStatus } from '../../api/change-incident-management-status';
import { useListIncidentManagement } from '../../api/list-incident-management';
import { useToggle } from '@mantine/hooks';

dayjs.locale('th');

const getMenuDropdown = (status) => {
  const options = INCIDENT_MANAGEMENT_STATUS_MATA?.map((item) => ({
    key: item.label,
    label: item.label,
  }));

  if (['เสร็จสิ้น', 'ยกเลิก'].includes(status)) {
    return [];
  }

  if (status === 'กำลังดำเนินการ') {
    return options.filter((option) => ['เสร็จสิ้น', 'ยกเลิก'].includes(option.label));
  }

  if (status === 'รอดำเนินการ') {
    return options.filter((option) => option.label !== 'รอดำเนินการ');
  }

  return options;
};

export const IncidentManagementList = ({ status = 'all', search, onEdit, filterOganization }) => {
  const { canUpdate } = GuardHandlesV2({ group: 'Incident Management', type: 'รายงานการแจ้งเหตุออนไลน์' });
  const { page, pageSize, onPaginationChange, Pagination } = usePagination({});

  const [currentIncidentId, setCurrentIncidentId] = useState(null);

  const [params, onChangeParams] = useSearchParamsState({
    keys: ['sort_field', 'sort_value', 'page', 'page_size', 'status', 'report_type_id'],
    defaultValues: [
      'created_at',
      'desc',
      page,
      pageSize,
      status,
      REPORT_TYPE_ID,
      // filterOganization === 'all' || filterOganization ? undefined : filterOganization,
    ],
  });

  useEffect(() => {
    if (filterOganization !== 'all') {
      onChangeParams({
        keys: ['org_id'],
        values: [filterOganization],
      });
    }
  }, [filterOganization]);

  const { submit, ...changeIncidentManagementStatus } = useChangeIncidentManagementStatus({
    incidentId: currentIncidentId,
    onSuccess: () => {
      notification.success({
        message: 'สำเร็จ',
        description: 'บันทึกสถานะสำเร็จ',
      });
    },
  });

  const [isOpenChangeCompleteStatusDialog, toggleChangeCompleteStatusDialog] = useToggle();
  const [isOpenChangeCancelStatusDialog, toggleChangeCancelStatusDialog] = useToggle();

  const { data, isLoading } = useListIncidentManagement({
    search,
    ...params,
    status: status === 'all' ? undefined : status,
    // status: params?.status === 'all' ? undefined : params?.status,
    report_type_id: REPORT_TYPE_ID,
  });

  const onConfirmChangeStatus = async (status) => {
    try {
      if (status === 'เสร็จสิ้น') {
        toggleChangeCompleteStatusDialog();
        return;
      }
      if (status === 'ยกเลิก') {
        toggleChangeCancelStatusDialog();
        return;
      }

      submit({ status });
    } catch (error) {
      console.error(error);
    }
  };

  const onHeaderCell = (columnKey) => {
    return {
      onClick: () => {
        onChangeParams({
          keys: ['sort_field', 'sort_value', 'page', 'page_size'],
          values: [columnKey, params?.sort_value === 'asc' ? 'desc' : 'asc', 1, 10],
        });
      },
    };
  };

  const getSortOrder = (columnKey) => {
    if (params?.sort_field === columnKey) {
      return params?.sort_value === 'asc' ? 'ascend' : 'descend';
    }
    return undefined;
  };

  const columns = [
    {
      title: 'หมายเลขการแจ้ง',
      key: 'report_record_id',
      width: 200,
      render: (data) => (
        <Typography.Link className="gx-text-danger" onClick={() => onEdit?.(data)}>
          {data?.report_record_id}
        </Typography.Link>
      ),
      sorter: true,
      sortOrder: getSortOrder('report_record_id'),
      onHeaderCell: () => onHeaderCell('report_record_id'),
    },
    {
      title: 'ชื่อผู้แจ้ง',
      key: 'reporter.name_th',
      dataIndex: ['reporter', 'name_th'],
      width: 200,
      ellipsis: true,
      sorter: true,
      sortOrder: getSortOrder('reporter.name_th'),
      onHeaderCell: () => onHeaderCell('reporter.name_th'),
    },
    {
      title: 'กลุ่มการแจ้งเหตุ',
      key: 'report_detail.group_type_name',
      dataIndex: ['report_detail', 'group_type_name'],
      width: 150,
      ellipsis: true,
      sorter: true,
      sortOrder: getSortOrder('report_detail.group_type_name'),
      onHeaderCell: () => onHeaderCell('report_detail.group_type_name'),
    },
    {
      title: 'หน่วยงาน',
      key: 'report_detail.department_name',
      dataIndex: ['organization', 'short_name_th'],
      width: 150,
      ellipsis: true,
      sorter: true,
      sortOrder: getSortOrder('organization.short_name_th'),
      onHeaderCell: () => onHeaderCell('organization.short_name_th'),
    },
    {
      title: 'ประเภทการแจ้งเหตุ',
      key: 'report_detail.type_name',
      dataIndex: ['report_detail', 'type_name'],
      width: 150,
      ellipsis: true,
      sorter: true,
      sortOrder: getSortOrder('report_detail.type_name'),
      onHeaderCell: () => onHeaderCell('report_detail.type_name'),
    },
    {
      title: 'วันที่แจ้ง',
      key: 'created_at',
      dataIndex: 'created_at',
      width: 180,
      ellipsis: true,
      sorter: true,
      sortOrder: getSortOrder('created_at'),
      onHeaderCell: () => onHeaderCell('created_at'),
      render: (date) => (date ? dayjs(date).format('DD MMM YYYY HH:mm') : null),
    },
    {
      title: 'ช่องทางการแจ้งเหตุ',
      key: 'source_device',
      dataIndex: 'source_device',
      width: 150,
      ellipsis: true,
      sorter: true,
      sortOrder: getSortOrder('source_device'),
      onHeaderCell: () => onHeaderCell('source_device'),
    },
    {
      title: 'สถานะ',
      key: 'status',
      dataIndex: 'status',
      width: 125,
      ellipsis: true,
      sorter: true,
      sortOrder: getSortOrder('status'),
      onHeaderCell: () => onHeaderCell('status'),
    },
    {
      key: 'action',
      width: 50,
      align: 'center',
      fixed: 'right',
      render: (incidentRecord) => {
        const isDisabled = ['เสร็จสิ้น', 'ยกเลิก'].includes(incidentRecord?.status);
        if (!canUpdate) {
          return undefined;
        }

        return (
          <Dropdown
            overlay={
              <Menu
                style={{
                  width: 150,
                }}
                items={getMenuDropdown(incidentRecord?.status)}
                onClick={({ key }) => {
                  setCurrentIncidentId(incidentRecord?.id);
                  onConfirmChangeStatus(key);
                }}
              />
            }
            disabled={isDisabled}
          >
            <MoreOutlined
              style={{
                cursor: isDisabled ? 'not-allowed' : 'pointer',
              }}
            />
          </Dropdown>
        );
      },
    },
  ];

  useEffect(() => {
    if (status !== params?.status && status !== 'all') {
      onChangeParams({
        keys: ['status'],
        values: [status],
      });
    }
  }, [status]);

  return (
    <>
      <TableHeros
        rowKey="id"
        tableLayout="fixed"
        loading={isLoading || changeIncidentManagementStatus.isLoading}
        columns={columns}
        dataSource={data?.data}
        pagination={false}
      />
      <Flex justifyContent="end" className="gx-w-100 gx-mt-2">
        <Pagination
          total={data?.total_record}
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
      </Flex>
      <IncidentManagementChangeCancelStatusConfirmDialog
        open={isOpenChangeCancelStatusDialog}
        onClose={() => {
          toggleChangeCancelStatusDialog();
          setCurrentIncidentId(null);
        }}
        incidentId={currentIncidentId}
      />
      <IncidentManagementChangeCompleteStatusConfirmDialog
        open={isOpenChangeCompleteStatusDialog}
        onClose={() => {
          toggleChangeCompleteStatusDialog();
          setCurrentIncidentId(null);
        }}
        incidentId={currentIncidentId}
      />
    </>
  );
};
