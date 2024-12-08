import { Card, Tabs } from 'antd';

export const IncidentReportOnlineComment = () => {
  return (
    <Card>
      <Tabs defaultActiveKey="citizen-coment" size="large">
        <Tabs.TabPane tab="ช่องทางการตอบกลับประชาชน" key="citizen-coment"></Tabs.TabPane>
        <Tabs.TabPane tab="ช่องทางการตอบกลับภายในระบบ" key="internal-coment"></Tabs.TabPane>
      </Tabs>
    </Card>
  );
};
