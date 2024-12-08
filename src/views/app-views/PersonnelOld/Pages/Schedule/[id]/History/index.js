import { Avatar, Card, Space, Timeline, Typography } from 'antd';

import ExportButton from 'components/shared-components/ExportButton';
import Guarded from 'components/shared-components/Guarded';
import { LinkOutlined } from '@ant-design/icons';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import { ThaiDateTime } from 'utils/ThaiDateTime';
import _ from 'lodash';
import { renderPersonnelName } from 'utils/stringRender';
import styled from '@emotion/styled';
import useLog from 'hooks/services/useLogs';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import useUsers from 'hooks/services/useUsers';

const { Title, Text } = Typography;

const ACTION_TEXT = {
  create: 'สร้างตารางปฏิบัติการ',
  update: 'แก้ไขตารางปฏิบัติการ',
};

const EXPORT_COLUMN = [
  { label: 'ลำดับ', key: 'index' },
  { label: 'วิธีการ', key: 'action' },
  { label: 'เพิ่ม', key: 'add_agents' },
  { label: 'ลบ', key: 'remove_agents' },
  { label: 'เหตุผลการแก้ไขข้อมูล', key: 'edit_message' },
  { label: 'ผู้ดำเนินการ', key: 'created_by' },
];

const getIds = (logs) => {
  const ids = [];
  logs?.forEach((log) => {
    ids.push(log.created_by);
    if (log.audited_logs) {
      if (log.audited_logs.add_agents) {
        ids.push(...log.audited_logs.add_agents);
      }
      if (log.audited_logs.remove_agents) {
        ids.push(...log.audited_logs.remove_agents);
      }
    }
  });
  return ids;
};

const getPersonnel = (personnel, id) => {
  return _.get(personnel, `${id}.0`);
};

const renderPersonnel = (personnel) => {
  if (!personnel) return '-';
  return renderPersonnelName(personnel);
};

const transformScheduleLogsIntoExportTable = (personnel, logs) => {
  return logs.map((log, index) => {
    return {
      index: index + 1,
      action: ACTION_TEXT[log.action],
      add_agents: log.audited_logs?.add_agents?.map((id) => renderPersonnel(getPersonnel(personnel, id))).join(', '),
      remove_agents: log.audited_logs?.remove_agents
        ?.map((id) => renderPersonnel(getPersonnel(personnel, id)))
        .join(', '),
      edit_message: log.audited_logs?.edit_message,
      created_by: renderPersonnel(getPersonnel(personnel, log.created_by)),
    };
  });
};

const TimeLineDot = () => {
  return (
    <Avatar
      size="small"
      icon={<LinkOutlined style={{ color: '#1B2531' }} />}
      style={{
        backgroundColor: '#fff',
      }}
    />
  );
};

const TimelineItem = (props) => {
  const { children, ...otherProps } = props;
  return (
    <Timeline.Item dot={<TimeLineDot />} {...otherProps}>
      {children}
    </Timeline.Item>
  );
};

const TimelineDetailContainer = styled(Space)`
  background-color: rgba(55, 66, 86, 0.4);
  padding: 10px;
  margin: 10px 0;
`;

const TimelineDetail = (props) => {
  const { log, personnel } = props;

  const { action, audited_logs: auditedLogs, created_by: createdBy, created_at: createdAt } = log;

  const getPersonnelHof = (id) => {
    return getPersonnel(personnel, id);
  };

  return (
    <>
      <Space>
        <Title level={5} className="gx-m-0">
          {renderPersonnel(getPersonnelHof(createdBy))}
        </Title>
        <Text>{ACTION_TEXT[action] || action}</Text>
      </Space>
      <Text style={{ color: '#FFFFFF', opacity: '0.4' }}>{ThaiDateTime(createdAt, 'short-month-full')}</Text>
      {auditedLogs && (
        <TimelineDetailContainer direction="vertical">
          {auditedLogs && (
            <Space direction="vertical">
              {auditedLogs.add_agents &&
                auditedLogs.add_agents.map((id, index) => {
                  return (
                    <Text key={`create,${createdAt},${id},${index}`}>
                      เพิ่มข้อมูล {'"'}
                      {renderPersonnel(getPersonnelHof(id))}
                      {'"'}
                    </Text>
                  );
                })}
              {auditedLogs.remove_agents &&
                auditedLogs.remove_agents.map((id, index) => {
                  return (
                    <Text key={`remove,${createdAt},${id},${index}`}>
                      ลบข้อมูล {'"'}
                      {renderPersonnel(getPersonnelHof(id))}
                      {'"'}
                    </Text>
                  );
                })}
            </Space>
          )}
          {auditedLogs.edit_message && (
            <Space>
              <Text strong>เหตุผลการแก้ไขข้อมูล : </Text>
              <Text>{auditedLogs.edit_message}</Text>
            </Space>
          )}
        </TimelineDetailContainer>
      )}
    </>
  );
};

const History = () => {
  const { id } = useParams();
  const { data: logs, loading } = useLog({
    params: { ids: id, types: 'duty' },
  });
  const { data: _personnel } = useUsers({
    params: {
      _id: getIds(logs),
    },
  });

  const personnel = useMemo(() => {
    if (!_personnel) return {};
    return _.groupBy(_personnel, '_id');
  }, [_personnel]);

  const exportDataSource = useMemo(() => {
    if (!logs) return [];
    return transformScheduleLogsIntoExportTable(personnel, logs);
  }, [logs, personnel]);

  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'ตารางปฏิบัติหน้าที่', subpath: 'ประวัติ' }}>
        <Guarded
          query={{
            group: 'Personnel',
            type: 'ตารางปฏิบัติหน้าที่',
            name: 'แก้ไขข้อมูลตารางปฏิบัติหน้าที่',
          }}
        >
          <ExportButton column={EXPORT_COLUMN} dataSource={exportDataSource} fileName="edit-history-export" />
        </Guarded>
      </PageBreadcrumb>
      <Card loading={loading}>
        <Title level={4}>ประวัติ</Title>
        <Timeline className="gx-mt-4 gx-ml-4">
          {logs?.map((log, index) => {
            return (
              <TimelineItem key={index}>
                <TimelineDetail personnel={personnel} log={log} />
              </TimelineItem>
            );
          })}
        </Timeline>
      </Card>
    </>
  );
};

export default History;
