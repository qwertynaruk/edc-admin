import { List, Typography } from 'antd';

import { CaretRightOutlined } from '@ant-design/icons';
import Guarded from 'components/shared-components/Guarded';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import useUser from 'hooks/services/useUser';

export const dataSettingList = [
  {
    name: 'คุณลักษณะ',
    route: 'attribute',
    active: false,
    parentKey: 'system_administration',
  },
  {
    name: 'รหัสมาตรฐาน',
    route: 'standard-code',
    active: false,
    parentKey: 'system_administration',
  },
  {
    name: 'การจับคู่คุณลักษณะกับรหัสมาตรฐาน',
    route: 'match',
    active: false,
    parentKey: 'system_administration',
  },
  {
    name: 'ผู้ใช้งาน',
    route: 'user',
    active: false,
    parentKey: 'system_administration',
  },
  {
    name: 'สิทธิ์การใช้งาน',
    route: 'role',
    active: true,
    parentKey: 'system_administration',
  },
  {
    name: 'ฟิลด์ข้อมูล',
    route: 'field',
    active: false,
    parentKey: 'system_administration',
  },
  {
    name: 'พื้นที่รับผิดชอบ',
    route: 'area-of-responsibility',
    active: true,
    parentKey: 'system_administration',
  },
  {
    name: 'ข้อมูลสารสนเทศภูมิศาสตร์',
    route: 'gis',
    active: false,
    parentKey: 'system_administration',
  },
  {
    name: 'ตัวจัดการองค์กร',
    route: 'organization',
    active: true,
    parentKey: 'system_administration',
  },
  {
    name: 'ประวัติการเข้าใช้งานในระบบ',
    route: 'history',
    active: false,
    parentKey: 'system_administration',
  },
];

const ListItem = styled(List.Item)`
  color: #fff !important;
  cursor: pointer;
  &:hover {
    background-color: #161e2b;
  }
`;

const MenuPanelItem = (props) => {
  const { item } = props;
  const navigate = useNavigate();
  return (
    <Guarded
      query={{
        group: 'System Administration',
        type: item.name,
      }}
    >
      <ListItem
        className={`gx-flex-row ${item.route === '#' ? 'gx-not-allowed' : ''}`}
        onClick={() => {
          item.route !== '#' && navigate(item.route);
        }}
      >
        {item.name}
        <CaretRightOutlined />
      </ListItem>
    </Guarded>
  );
};

const MenuPanel = () => {
  const { loading } = useUser();

  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'ตั้งค่า' }} />

      <List
        loading={loading}
        style={{ backgroundColor: '#1c2536', marginBottom: 70 }}
        size="large"
        header={
          <Typography.Title level={5} className="gx-mb-0">
            การตั้งค่า
          </Typography.Title>
        }
        footer={null}
        bordered={true}
        dataSource={dataSettingList.filter((ss) => ss.active)}
        renderItem={(item) => <MenuPanelItem item={item} />}
      />
    </>
  );
};

export default MenuPanel;
