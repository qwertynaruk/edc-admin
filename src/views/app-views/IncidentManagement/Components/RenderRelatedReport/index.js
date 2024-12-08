import { Button, Card, Space, Typography } from 'antd';
import CustomTable from 'components/shared-components/CustomTable';
import useColumnFilter from 'components/shared-components/CustomTable/useColumnFilter';
import Guarded from 'components/shared-components/Guarded';
import PersonnelSelectWidget from 'components/shared-components/PersonnelSelectWidget';
import _ from 'lodash';
import { observer } from 'mobx-react';
import ReportStore from 'mobx/ReportStore';
import { useEffect, useState } from 'react';
import A2O from 'utils/A2O';
import { renderDateTime, renderReportType } from 'utils/stringRender';
import { iso8601Sorter } from 'utils/tableSorter';
import MergeReport from '../MenuControlPanel/ModalList/merge-report';

const RenderRelatedReport = ({ reportId, guardedProps = null }) => {
  const { reportInvolveReport, typesList } = ReportStore;
  const { report = [] } = reportInvolveReport;

  const { columnSearch, columnFilter } = useColumnFilter();

  const [loading, setLoading] = useState(false);
  const [visibleMergeReportModal, setVisibleMergeReportModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    ReportStore.getTypesList();
    initialSource();
  }, []);

  const initialSource = () =>
    ReportStore.getReportInvolve({ involveType: 'report', reportId }).finally(() => setLoading(false));

  const onDataSelect = (record) => {
    const { _id = '', report_type_id = '' } = record;
    const findItems = _.find(typesList, (ss) => ss._id === report_type_id);
    const groupTypeName = _.get(findItems, 'group_type');

    if (_id && groupTypeName) {
      const mapGroupName = {
        รายงานประจำวัน: 'daily/management',
        รายงานภายในองค์กร: 'internal/management',
        รายงานการปฏิบัติหน้าที่: 'onduty/management',
        รายงานแจ้งเหตุออนไลน์: 'online/detail',
        รายงานจากเว็บฟอร์ม: 'webform/detail',
      };

      const _url = `/app/incident-management/report/${mapGroupName[groupTypeName]}/${_id}`;
      window.open(_url, '_blank');
    }
  };

  const newReportSource = report.map((ss) => ({
    ...ss,
    report_type_name: renderReportType(ss, typesList),
    report_owner_id: _.get(
      ss,
      'report_owner_id.reporter.name_th',
      <PersonnelSelectWidget viewMode={{ enable: true, values: ss.report_owner_id }} />
    ),
  }));

  const columns = [
    {
      title: 'หมายเลขรายงาน',
      key: 'report_record_id',
      width: '15%',
      ...columnSearch('report_record_id', {
        placeholder: 'ค้นหาหมายเลขรายงาน',
      }),
      render: (_text) => (
        <Button type="ghost" ghost className="gx-text-danger" onClick={() => onDataSelect(_text)}>
          {_text?.report_record_id}
        </Button>
      ),
    },
    {
      title: 'ประเภทรายงาน',
      dataIndex: 'report_type_name',
      width: '22%',
      ...columnFilter('report_type_name', {
        filters: A2O.GENERATE_FILTER_ITEMS(newReportSource, 'report_type_name'),
      }),
    },
    {
      title: 'เจ้าของรายงาน',
      dataIndex: 'report_owner_id',
      width: '25%',
      ...columnSearch('report_owner_id', {
        placeholder: 'ค้นหาเจ้าของรายงาน',
      }),
    },
    {
      title: 'วันที่สร้าง',
      dataIndex: 'created_at',
      width: '20%',
      sorter: iso8601Sorter,
      render: (el) => renderDateTime(el),
    },
    {
      title: 'เกี่ยวข้องโดย',
      dataIndex: 'related_by',
      width: '18%',
      ...columnFilter('related_by', {
        filters: [
          { label: 'เหตุการณ์เดียวกัน', value: 'เหตุการณ์เดียวกัน' },
          { label: 'เป็นเหตุการณ์ต่อเนื่องกัน', value: 'เป็นเหตุการณ์ต่อเนื่องกัน' },
          { label: 'รายงานที่เกี่ยวข้อง', value: 'รายงานที่เกี่ยวข้อง' },
        ],
      }),
    },
  ];

  return (
    <Card
      className="head-border gx-mb-0"
      title={
        <Space size={20}>
          <Typography.Text>รายงาน</Typography.Text>
          <Guarded {...guardedProps}>
            <Button type="primary" onClick={() => setVisibleMergeReportModal(true)}>
              เพิ่ม
            </Button>
          </Guarded>
        </Space>
      }
      bodyStyle={{ padding: '15px 5px' }}
    >
      <CustomTable
        columns={columns}
        dataSource={newReportSource}
        pagination={{
          pageSize: 5,
          total: newReportSource.length,
        }}
        loading={loading}
      />

      <MergeReport
        visible={visibleMergeReportModal}
        setVisible={setVisibleMergeReportModal}
        ignoreList={_.concat(
          _.map(newReportSource, (ss) => ss._id),
          reportId
        )}
        afterSuccess={() => initialSource()}
      />
    </Card>
  );
};

export default observer(RenderRelatedReport);
