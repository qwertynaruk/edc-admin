import { Card } from 'antd';
import CustomTable from 'components/shared-components/CustomTable';
import { GuardHandles } from 'components/shared-components/Guarded';
import _ from 'lodash';
import CaseStore from 'mobx/CaseStore';
import ReportStore from 'mobx/ReportStore';
import { useEffect, useMemo, useState } from 'react';
import { renderDateTime } from 'utils/stringRender';
import { iso8601Sorter } from 'utils/tableSorter';

const RenderRelatedCase = ({ reportId }) => {
  const { reportInvolveCase } = ReportStore;
  const { case_type_list } = CaseStore;

  const { canRead } = GuardHandles({ query: { group: 'case', type: 'เคส' } });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    CaseStore.getCaseTypes();
    ReportStore.getReportInvolve({ involveType: 'case', reportId }).finally(() => setLoading(false));
  }, []);

  const propCaseList = useMemo(() => {
    const newCase = _.get(reportInvolveCase, 'case', []);
    if (newCase.length > 0) {
      return newCase.map((ss) => ({
        ...ss,
        type: _.get(
          _.find(case_type_list, (_tx) => _tx._id === _.get(ss, 'type', '-')),
          'name',
          '-'
        ),
        investigation_team: _.get(ss, 'investigation_team.team_name', '-'),
      }));
    } else {
      return [];
    }
  }, [case_type_list, reportInvolveCase]);

  const columns = [
    {
      title: 'หมายเลขเคส',
      dataIndex: 'case_record_id',
      width: '15%',
      sorter: (a, b) => a.case_record_id > b.case_record_id,
    },
    {
      title: 'ชื่อเคส',
      dataIndex: 'name',
      width: '15%',
      sorter: (a, b) => a.name > b.name,
    },
    {
      title: 'ประเภทเคส',
      dataIndex: 'type',
      width: '15%',
      sorter: (a, b) => a.type > b.type,
    },
    {
      title: 'ชุดปฏิบัติการ',
      dataIndex: 'investigation_team_detail',
      width: '15%',
      render: (teams = []) => {
        return teams.map((team) => team.team_name).join(', ');
      },
    },
    {
      title: 'วันเวลาที่สร้าง',
      dataIndex: 'created_at',
      width: '15%',
      sorter: iso8601Sorter,
      render: (el) => renderDateTime(el),
    },
  ];

  const onDataSelect = (record) => {
    if (!canRead) {
      return null;
    }

    const { _id = '' } = record;

    if (_id) {
      const _url = `/app/case-management/case-edit/${_id}`;
      window.open(_url, '_blank');
    }
  };

  return (
    <Card className="head-border gx-mb-0" bodyStyle={{ padding: '15px 5px' }} title="เคสที่เกี่ยวข้อง">
      <CustomTable
        columns={columns}
        dataSource={propCaseList}
        pagination={{
          pageSize: 10,
          total: propCaseList.length,
        }}
        onRow={(record) => {
          return {
            onClick: () => onDataSelect(record),
          };
        }}
        loading={loading}
      />
    </Card>
  );
};

export default RenderRelatedCase;
