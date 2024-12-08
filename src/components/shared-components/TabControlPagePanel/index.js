import { observer } from 'mobx-react';

import { Card, Tabs } from 'antd';
import SearchMultiverse from 'components/shared-components/SearchMultiverse';
import { useLocation, useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;

const TabControlPagePanel = (props) => {
  const { setFilteredData, sourceData, items } = props;
  const location = useLocation();
  const navigate = useNavigate();

  const mm = location.pathname.split('/');
  const xt = mm[mm.length - 1];

  return (
    <Card bodyStyle={{ padding: 0 }}>
      <Tabs
        className="with-extra-hightlight"
        defaultActiveKey={xt}
        tabBarStyle={{ padding: '0 18px' }}
        onChange={(el) => {
          navigate(`../${el}`);
        }}
      >
        {items.map((el) => (
          <TabPane tab={el.name} key={el.key}>
            <SearchMultiverse mode="auto" nodeData={sourceData} onSetNodeData={(el) => setFilteredData(el)} />
          </TabPane>
        ))}
      </Tabs>
    </Card>
  );
};

export default observer(TabControlPagePanel);
