import { Card, Tabs } from 'antd';
import _ from 'lodash';
import { observer } from 'mobx-react';
import ReportStore from 'mobx/ReportStore';
import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import MenuContent from 'views/app-views/MasterIndices/Components/MenuContent';

const { TabPane } = Tabs;

const RenderRelatedProfile = ({ reportId }) => {
  const { reportInvolve, reportItems } = ReportStore;
  const { event = {}, offense = {}, arrest = {}, notification = {} } = reportItems;
  const [currentMasterIndices, setCurrentMasterIndices] = useState('person');
  const [relationScreenLoading, setRelationScreenLoading] = useState(false);

  const tabItems = [
    {
      name: 'บุคคล',
      nameKey: 'person',
      component: (
        <MenuContent.RelationContent dataSource={_.get(reportInvolve, 'person', [])} loading={relationScreenLoading} />
      ),
    },
    {
      name: 'สถานที่',
      nameKey: 'location',
      component: (
        <MenuContent.PlaceContent
          dataSource={_.get(event, 'venue', [])
            .concat(
              _.get(offense, 'venue', []),
              _.get(arrest, 'arresting_location', []),
              _.get(notification, 'venue', [])
            )
            .filter((ss) => Object.keys(ss).length > 0)
            .map((em) => ({
              ...em,
              relation: 'สถานที่เกิดเหตุ',
              updatedAt: _.get(reportItems, 'updated_at', ''),
            }))}
          loading={relationScreenLoading}
        />
      ),
    },
    {
      name: 'องค์กร',
      nameKey: 'organization',
      component: (
        <MenuContent.OrganizationContent
          dataSource={_.get(reportInvolve, 'organization', [])}
          loading={relationScreenLoading}
        />
      ),
    },
    {
      name: 'ยานพาหนะ',
      nameKey: 'vehicle',
      component: (
        <MenuContent.VehicleContent dataSource={_.get(reportInvolve, 'vehicle', [])} loading={relationScreenLoading} />
      ),
    },
    {
      name: 'ทรัพย์สิน',
      nameKey: 'property',
      component: (
        <MenuContent.AssetsContent dataSource={_.get(reportInvolve, 'property', [])} loading={relationScreenLoading} />
      ),
    },
  ];

  useEffect(() => {
    processApi('person');
  }, []);

  const tabs = {
    onChange(el) {
      setCurrentMasterIndices(el);
      processApi(el);
    },
  };

  const processApi = (involveType) => {
    if (involveType !== 'location') {
      setRelationScreenLoading(true);
      ReportStore.getReportInvolve({ involveType, reportId }).finally(() => setRelationScreenLoading(false));
    }
  };

  return (
    <Card bodyStyle={{ padding: 10 }}>
      <Card bodyStyle={{ padding: 0 }} className="gx-mb-1">
        <TabCloseContent
          className="with-extra-hightlight"
          defaultActiveKey={currentMasterIndices}
          tabBarStyle={{ padding: '0 18px' }}
          onChange={tabs.onChange}
        >
          {tabItems.map(({ name = '', nameKey = '' }) => (
            <TabPane tab={name} key={nameKey} />
          ))}
        </TabCloseContent>
      </Card>
      <div style={{ height: 500, overflowY: 'scroll' }}>
        {tabItems.find((_tx) => _tx.nameKey === currentMasterIndices).component}
      </div>
    </Card>
  );
};

export default observer(RenderRelatedProfile);

const TabCloseContent = styled(Tabs)`
  & div.ant-tabs-content-holder {
    display: none;
  }
`;
