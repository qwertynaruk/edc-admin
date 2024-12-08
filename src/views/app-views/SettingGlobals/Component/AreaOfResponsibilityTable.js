import { IdcardOutlined } from '@ant-design/icons';
import { Avatar, Checkbox, Space } from 'antd';
import CustomTable from 'components/shared-components/CustomTable';
import produce from 'immer';
import { useEffect, useMemo, useState } from 'react';
import { renderPersonnelName, renderPosition } from 'utils/stringRender';
import _ from 'lodash';

const COLUMNS = [
  {
    title: 'รูปภาพ',
    dataIndex: 'cover_image_file',
    render: (text) => {
      return (
        <Avatar src={text}>
          <IdcardOutlined />
        </Avatar>
      );
    },
  },
  {
    title: 'ยศ ชื่อ สกุล',
    dataIndex: 'name',
    render: (_, record) => renderPersonnelName(record),
  },
  {
    title: 'ฝ่ายงาน',
    dataIndex: 'department',
    render: (department) => {
      // return <DepartmentSelectWidget viewMode value={department} />;
      return _.get(department, '0.name', '-');
    },
  },
  {
    title: 'ตำแหน่ง',
    dataIndex: 'position',
    render: (_, personnel) => renderPosition(personnel),
  },
  {
    title: 'นามเรียกขาน',
    dataIndex: 'middle_name',
    render: (text) => text || '-',
  },
  {
    title: 'การแจ้งเตือน',
    dataIndex: 'is_notify',
    render: (text) => (text ? 'เปิดการแจ้งเตือน' : 'ปิดการแจ้งเตือน'),
  },
  {
    title: 'เบอร์โทร',
    dataIndex: 'phone_number',
    render: (text) => text || '-',
  },
];

const COLUMNS_EDIT = (disabled = false) =>
  produce(COLUMNS, (draft) => {
    const index = draft.findIndex((item) => item.dataIndex === 'is_notify');
    if (index === -1) return;
    draft.splice(index, 1);
    draft.push({
      title: 'การแจ้งเตือน',
      dataIndex: 'is_notify',
      render: (_, record) => {
        return (
          <Space direction="vertical" align="center">
            <Checkbox value={`${record._id}`} disabled={disabled} />
          </Space>
        );
      },
    });
  });

const getSelectedIdsFromDataSource = (dataSource) => {
  if (!dataSource) return [];
  return dataSource.filter((item) => item.is_notify).map((item) => item._id);
};

const AreaOfResponsibilityTable = (props) => {
  const { edit = false, disabled = false, agents } = props;
  const [state, setState] = useState({
    selectedIds: getSelectedIdsFromDataSource(agents),
  });
  const columns = useMemo(() => {
    if (edit) {
      return COLUMNS_EDIT(disabled);
    }
    return COLUMNS;
  }, [disabled, edit]);

  const onCheckboxChange = (ids) => {
    setState(
      produce((draft) => {
        draft.selectedIds = ids;
      })
    );
    if (props.onChange) {
      props.onChange(agents.map((item) => ({ ...item, is_notify: ids.includes(item._id) })));
    }
  };

  useEffect(() => {
    if (!agents) return;
    setState(
      produce((draft) => {
        draft.selectedIds = getSelectedIdsFromDataSource(agents);
      })
    );
  }, [agents]);

  return (
    <Checkbox.Group style={{ width: '100%' }} value={state.selectedIds} onChange={onCheckboxChange} disabled={disabled}>
      <CustomTable columns={columns} dataSource={agents} pagination={false} />
    </Checkbox.Group>
  );
};

export default AreaOfResponsibilityTable;
