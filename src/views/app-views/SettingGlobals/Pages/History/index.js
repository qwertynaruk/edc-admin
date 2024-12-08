import { Card, Col, Form, Input, Row, Space } from 'antd';
import DatePicker from 'components/shared-components/DatePicker';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import CustomTable from 'components/shared-components/CustomTable';
import useColumnFilter from 'components/shared-components/CustomTable/useColumnFilter';
import { columnDateRender } from 'components/shared-components/CustomTable/useTableColumnRender';
import useTableDataSource from 'components/shared-components/CustomTable/useTableDataSource';
import useTableExport from 'components/shared-components/CustomTable/useTableExport';
import ExportButton from 'components/shared-components/ExportButton';
import SearchMultiverse from 'components/shared-components/SearchMultiverse';
import UserSelectWidget from 'components/shared-components/UserSelectWidget';
import useService from 'hooks/useService';
import produce from 'immer';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import LogService from 'services/LogService';
import { serviceWrapper } from 'utils/serviceHelper';
import { iso8601Sorter, textSorter } from 'utils/tableSorter';

const { RangePicker } = DatePicker;

const AdvancedFilter = () => {
  return (
    <>
      <Row gutter={[16, 16]} className="gx-flex-row">
        <Col span={16}>
          <Form.Item name="start_stop_time" label="ช่วงวันเวลาที่ทำรายการ">
            <RangePicker placeholder={['วันที่เริ่มใช้งาน', 'วันที่สิ้นสุดการใช้งาน']} className="gx-full-width" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="ignore_ips" label="ยกเว้น IP">
            <Input placeholder="กรอก IP ที่ต้องการยกเว้น" />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

const uniqBy = (histories, key) => {
  if (!histories) return [];
  return _.uniqBy(
    histories.map((history) => {
      return {
        label: history[key],
        value: history[key],
      };
    }),
    (item) => item.value
  );
};
const History = () => {
  const { columnFilter, columnSearch } = useColumnFilter();
  const { exportColumns, exportDataSource } = useTableExport();
  const tableDataSource = useTableDataSource();
  const [state, setState] = useState({
    formValues: {},
    pagination: {
      current: 1,
      pageSize: 20,
      total: 0,
    },
  });
  const { formValues, pagination } = state;
  const {
    data: histories,
    raw,
    loading,
  } = useService(serviceWrapper(LogService.log), () => {
    return {
      params: { ..._.pickBy(formValues, _.identity), page: pagination.current, limit: pagination.pageSize },
    };
  });

  const { dataSource, currentDataSource, setDataSource } = tableDataSource;

  const columns = [
    {
      title: 'วันเวลาที่ทำรายการ',
      dataIndex: 'created_at',
      sorter: (a, b) => iso8601Sorter(a.created_at, b.created_at),
      render: (e) => columnDateRender(e),
    },
    {
      title: 'ผู้ใช้งาน',
      dataIndex: 'created_by',
      // sorter: (a, b) => textSorter(a, b),
      ...columnSearch('created_by', {
        placeholder: 'ค้นหาชื่อผู้ใช้',
      }),
      render: (user) => {
        return <UserSelectWidget viewMode={true} userId={user} />;
      },
    },
    {
      title: 'แหล่งที่มา',
      dataIndex: 'source',
      ...columnFilter('source', {
        // [
        //   { label: 'System', value: 'System' },
        //   { label: 'Master Indices', value: 'Master Indices' },
        //   { label: 'Incident Managment', value: 'Incident Managment' },
        //   { label: 'Task', value: 'Task' },
        // ],
        filters: uniqBy(histories, 'source'),
      }),
    },
    {
      title: 'การกระทำ',
      dataIndex: 'action',
      ...columnFilter('action', {
        // filters: [
        //   { label: 'ออกจากระบบ', value: 'ออกจากระบบ' },
        //   { label: 'เข้าสู่ระบบ', value: 'เข้าสู่ระบบ' },
        //   { label: 'แก้ไข', value: 'แก้ไข' },
        //   { label: 'เพิ่ม', value: 'เพิ่ม' },
        //   { label: 'เข้าสู่ระบบ', value: 'เข้าสู่ระบบ' },
        // ],
        filters: uniqBy(histories, 'action'),
      }),
    },
    {
      title: 'ข้อมูล',
      dataIndex: 'log_text',
      ...columnSearch('log_text', {
        placeholder: 'ค้นหาข้อมูล',
      }),
      render: (e) => e || '-',
    },
    {
      title: 'ที่อยู่ IP',
      dataIndex: 'ip',
      sorter: (b, a) => textSorter(a.ip, b.ip),
    },
  ];

  const onSearchFilterSubmit = (values) => {
    const [startTime, endTime] = _.get(values, 'start_stop_time', []).map((e) => e.unix());
    setState(
      produce((draft) => {
        draft.formValues = {
          startTime,
          endTime,
          ignore_ips: values.ignore_ips,
        };
        draft.pagination.current = 1;
      })
    );
  };

  useEffect(() => {
    if (!histories) return;
    setDataSource(histories);
  }, [histories, setDataSource]);

  useEffect(() => {
    if (!raw) {
      return;
    }
    setState(
      produce((draft) => {
        draft.pagination.total = raw.countAll;
      })
    );
  }, [raw, setState]);

  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'ตั้งค่า', subpath: 'ประวัติการเข้าใช้งานในระบบ' }} />
      <Card>
        <SearchMultiverse
          mode="auto"
          filter={{
            active: true,
            onSubmit: onSearchFilterSubmit,
            dropHeader: 'รายละเอียดการใช้งานระบบ',
          }}
          nodeData={dataSource}
          onSetNodeData={(data) => {
            tableDataSource.setCurrentDataSource(data);
          }}
        >
          <AdvancedFilter />
        </SearchMultiverse>
      </Card>
      <Card>
        <Space direction="vertical" align="end">
          {currentDataSource.length === 0 ? null : (
            <ExportButton
              column={exportColumns(columns)}
              dataSource={exportDataSource(tableDataSource.exportDataSource, columns)}
              fileName="history-export"
            />
          )}
        </Space>
        <CustomTable
          rowKey="auditable_id"
          columns={columns}
          dataSource={currentDataSource}
          size="middle"
          loading={loading}
          pagination={pagination}
          onChange={(pagination) =>
            setState(
              produce((draft) => {
                draft.pagination = pagination;
              })
            )
          }
        />
      </Card>
    </>
  );
};

export default History;
