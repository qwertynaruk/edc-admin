import CustomTable from 'components/shared-components/CustomTable';
import useColumnFilter from 'components/shared-components/CustomTable/useColumnFilter';
import { columnDateRender } from 'components/shared-components/CustomTable/useTableColumnRender';
import _ from 'lodash';
import { observer } from 'mobx-react';
import AttributeStore from 'mobx/AttributeStore';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { renderDate } from 'utils/stringRender';
import { iso8601Sorter } from 'utils/tableSorter';

const DutiesTable = (props) => {
  const { setColumns } = props;
  const navigate = useNavigate();
  const { columnFilter, columnSearch } = useColumnFilter();

  const { ItemOfDropdownMaster } = AttributeStore;

  const departments = useMemo(() => {
    return _.get(ItemOfDropdownMaster, '78.options', []);
  }, [ItemOfDropdownMaster]);

  const matchDepartments = (text) => {
    if (Array.isArray(text)) {
      if (text.length < 1) {
        return 'ไม่ระบุ';
      } else if (text.length === 1) {
        return _.first(text)?.name;
      } else {
        return text.map((ss) => ss?.name).join(', ');
      }
    }

    return text || 'ไม่ระบุ';
  };

  const columns = useMemo(() => {
    return [
      {
        title: 'ชื่อตารางปฏิบัติหน้าที่',
        dataIndex: 'duty_name',
        render: (text) => text || '-',
        ...columnSearch('duty_name', {
          placeholder: 'ค้นหาตารางปฏิบัติหน้าที่',
        }),
      },
      {
        title: 'ฝ่ายงาน',
        dataIndex: 'department',
        render: (text) => matchDepartments(text),
        ...columnFilter('department', {
          filters: departments.map((department) => ({
            label: department.name_th,
            value: department.name_th,
          })),
        }),
      },
      {
        title: 'ประเภทตารางปฏิบัติหน้าที่',
        dataIndex: 'type',
        render: (text) => text || '-',
        ...columnFilter('type', {
          filters: [
            { label: 'ชุดปฏิบัติการ', value: 'ชุดปฏิบัติการ' },
            { label: 'บุคลากร', value: 'บุคลากร' },
          ],
        }),
      },
      {
        title: 'วันที่เริ่ม',
        dataIndex: 'start_time',
        render: (text) => renderDate(text),
        sorter: (a, b) => iso8601Sorter(a.created_at, b.created_at),
      },
      {
        title: 'วันที่สิ้นสุด',
        dataIndex: 'end_time',
        render: (text) => renderDate(text),
        sorter: (a, b) => iso8601Sorter(a.created_at, b.created_at),
      },
      {
        title: 'วันเวลาอัปเดตข้อมูล',
        dataIndex: 'updated_at',
        render: (text) => columnDateRender(text),
        sorter: (a, b) => iso8601Sorter(a.created_at, b.created_at),
      },
    ];
  }, [columnFilter, columnSearch, departments]);

  useEffect(() => {
    if (!setColumns) return;
    setColumns(columns);
  }, [columns, setColumns]);

  return (
    <CustomTable
      columns={columns}
      dataSource={props.dataSource}
      className="gx-my-4"
      onRow={(record) => {
        return {
          onClick: () => {
            navigate(record._id);
          },
        };
      }}
    />
  );
};

export default observer(DutiesTable);
