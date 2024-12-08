import { Card, Collapse } from 'antd';
import _ from 'lodash';
import ReportStore from 'mobx/ReportStore';
import { useEffect, useState } from 'react';
import ArrestList from './ArrestList';
import BasicInformationList from './BasicInformationList';
import IncidenceList from './IncidenceList';
import InvestigationList from './InvestigationList';
import OffenseList from './OffenseList';

const { Panel } = Collapse;

const ElementContainer = () => {
  const { reportItems = {} } = ReportStore;
  const [menuStack, setMenuStack] = useState([]);

  useEffect(() => {
    const _tx = _.get(reportItems, 'departments', []).map((ss) => ss.name);
    setMenuStack(_tx);
  }, []);

  return (
    <Card
      title="ข้อมูลในรายงาน"
      bodyStyle={{
        paddingLeft: 5,
        paddingRight: 5,
      }}
    >
      <Collapse className="gx-replace-collapse" defaultActiveKey={['1']}>
        {menuStack.includes('ข้อมูลพื้นฐานการแจ้งเหตุ') && (
          <Panel header="ข้อมูลพื้นฐานการแจ้งเหตุ" key="1">
            <BasicInformationList />
          </Panel>
        )}

        {menuStack.includes('ความผิด') && (
          <Panel header="ความผิด" key="2">
            <OffenseList />
          </Panel>
        )}

        {menuStack.includes('เหตุการณ์') && (
          <Panel header="เหตุการณ์" key="3">
            <IncidenceList />
          </Panel>
        )}

        {menuStack.includes('การสืบสวน') && (
          <Panel header="การสืบสวน" key="4">
            <InvestigationList />
          </Panel>
        )}

        {menuStack.includes('การจับกุม') && (
          <Panel header="การจับกุม" key="5">
            <ArrestList />
          </Panel>
        )}

        {menuStack.length <= 0 && <Panel header="ไม่พบข้อมูล" key="99"></Panel>}
      </Collapse>
    </Card>
  );
};

export default ElementContainer;
