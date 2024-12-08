import 'dayjs/locale/th';

import Flex from 'components/shared-components/Flex';
import ReportService from 'services/ReportServices';
import TableHeros from 'components/shared-components/TableHeros';
import { Typography } from 'antd';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { usePagination } from '../../../shared';
import utc from 'dayjs/plugin/utc';

dayjs.extend(buddhistEra);

dayjs.extend(utc);
dayjs.locale('th');

export const IncidentManagementForwardedList = ({ search, onEdit, filterOganization }) => {
  const { page, pageSize, onPaginationChange, Pagination } = usePagination({});

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
    },
    {
      title: 'ชื่อผู้แจ้ง',
      key: 'reporter.name_th',
      dataIndex: ['reporter', 'name_th'],
      width: 200,
      ellipsis: true,
    },
    {
      title: 'กลุ่มการแจ้งเหตุ',
      key: 'report_detail.group_type_name',
      dataIndex: ['report_detail', 'group_type_name'],
      width: 150,
      ellipsis: true,
    },
    {
      title: 'ประเภทการแจ้งเหตุ',
      key: 'report_detail.type_name',
      dataIndex: ['report_detail', 'type_name'],
      // dataIndex: 'report_type',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'วันที่แจ้ง',
      // key: 'created_at',
      // dataIndex: 'created_at',
      key: 'audited_logs.created_at',
      dataIndex: ['audited_logs', 'created_at'],
      width: 180,
      ellipsis: true,
      render: (date) => (date ? dayjs.utc(date).local().format('DD MMM BBBB HH:mm') : null),
    },
    {
      title: 'ช่องทางการแจ้งเหตุ',
      // key: 'source_device',
      // dataIndex: 'source_device',
      key: 'audited_logs.report_channel',
      dataIndex: ['audited_logs', 'report_channel'],
      width: 150,
      ellipsis: true,
    },
    // {
    //   title: 'สถานะ',
    //   key: 'status',
    //   dataIndex: 'status',
    //   width: 125,
    //   ellipsis: true,
    // },
    {
      title: 'จากหน่วยงาน',
      // key: 'forwarded_from',
      // dataIndex: 'forwarded_from',
      key: 'transfer_from_org.full_name_th',
      dataIndex: ['transfer_from_org', 'full_name_th'],
      width: 200,
      ellipsis: true,
    },
    {
      title: 'ถึงหน่วยงาน',
      // key: 'forwarded_to',
      // dataIndex: 'forwarded_to',
      key: 'transfer_to_org.full_name_th',
      dataIndex: ['transfer_to_org', 'full_name_th'],
      width: 200,
      ellipsis: true,
    },
  ];

  const { data, isLoading, refetch } = ReportService.useGetLogReportForwardList({
    queryParams: {
      search,
      page,
      page_size: pageSize,
      org_id: filterOganization !== 'all' ? filterOganization : undefined,
    },
  });

  const mapNewData = useMemo(() => {
    return (data?.data || []).map((rowData) => {
      return {
        ...rowData,
        report_record_id: rowData?.audited_logs?.report_record_id,
        reporter: rowData?.audited_logs?.reporter,
        report_detail: rowData?.audited_logs?.report_detail,
        audited_logs: rowData?.audited_logs,
        transfer_from_org: rowData?.transfer_from_org,
        transfer_to_org: rowData?.transfer_to_org,
      };
    });
  }, [data]);

  return (
    <>
      <TableHeros
        rowKey="id"
        tableLayout="fixed"
        loading={isLoading}
        columns={columns}
        dataSource={mapNewData}
        pagination={false}
      />
      <Flex justifyContent="end" className="gx-w-100 gx-mt-2">
        <Pagination total={data?.total_record} current={page} pageSize={pageSize} onChange={onPaginationChange} />
      </Flex>
    </>
  );
};
