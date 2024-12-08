import { Button, Card, Space } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import DutiesTable from '../Components/DutiesTable';
import ExportButton from 'components/shared-components/ExportButton';
import Guarded from 'components/shared-components/Guarded';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import SearchMultiverse from 'components/shared-components/SearchMultiverse';
import SelectScheduleType from '../Components/Modal/SelectScheduleType';
import { observer } from 'mobx-react';
import produce from 'immer';
import useDuties from 'hooks/services/useDuties';
import useTableDataSource from 'components/shared-components/CustomTable/useTableDataSource';
import useTableExport from 'components/shared-components/CustomTable/useTableExport';

const Schedule = () => {
  const { data: duties, loading } = useDuties();

  const [state, setState] = useState({
    columns: [],
    selectScheduleTypeVisible: false,
  });

  const tableDataSource = useTableDataSource();
  const { setCurrentDataSource } = tableDataSource;

  const { exportColumns, exportDataSource } = useTableExport();

  const onSearchChange = (filtered) => {
    tableDataSource.setCurrentDataSource(filtered);
  };

  const selectScheduleType = () => {
    setState(
      produce((draft) => {
        draft.selectScheduleTypeVisible = true;
      })
    );
  };

  const setModalVisible = (visible) => {
    setState(
      produce((draft) => {
        draft.selectScheduleTypeVisible = visible;
      })
    );
  };

  const setColumns = useCallback((columns) => {
    setState(
      produce((draft) => {
        draft.columns = columns;
      })
    );
  }, []);

  useEffect(() => {
    if (!duties) return;
    setCurrentDataSource(duties);
  }, [duties, setCurrentDataSource]);

  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'ตารางปฏิบัติหน้าที่' }} />
      <Card>
        <SearchMultiverse mode="auto" nodeData={duties} onSetNodeData={onSearchChange} />
      </Card>
      <Card loading={loading}>
        <Guarded
          query={{
            group: 'Personnel',
            type: 'ตารางปฏิบัติหน้าที่',
            name: 'แก้ไขข้อมูลตารางปฏิบัติหน้าที่',
          }}
        >
          <Space className="gx-justify-content-between">
            <Button type="primary" onClick={selectScheduleType}>
              เพิ่ม
            </Button>
            <ExportButton
              column={exportColumns(state.columns)}
              dataSource={exportDataSource(tableDataSource.exportDataSource, state.columns)}
              fileName="schedule-export"
            />
          </Space>
        </Guarded>
        <DutiesTable setColumns={setColumns} dataSource={tableDataSource.currentDataSource} />
      </Card>
      <SelectScheduleType visible={state.selectScheduleTypeVisible} setVisible={setModalVisible} />
    </>
  );
};

export default observer(Schedule);
