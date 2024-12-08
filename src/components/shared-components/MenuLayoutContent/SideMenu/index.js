import { Card, Menu } from 'antd';
import React from 'react';

const SideMenu = (props) => {
  const { listSideMenu = [], propsSideMenu = () => {} } = props;
  React.useEffect(() => {
    // console.log(propsSideMenu())
  }, [propsSideMenu]);
  return (
    <>
      <Card style={{ height: '100%' }}>
        <Menu {...propsSideMenu()} style={{ border: 0 }}>
          {listSideMenu.map(({ key = '', icon = '', labelMenu = '' }) => (
            <Menu.Item key={key}>
              {icon}
              <span>{labelMenu}</span>
            </Menu.Item>
          ))}
        </Menu>
      </Card>
    </>
  );
};

export default SideMenu;
