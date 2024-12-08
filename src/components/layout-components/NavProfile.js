import { Avatar, Popover } from 'antd';
import { EditOutlined, LogoutOutlined } from '@ant-design/icons';

import Icon from 'components/util-components/Icon';
import UserStore from 'mobx/UserStore';
import { observer } from 'mobx-react';
import { useGetUsers } from 'features/profiles/hooks';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const menuItem = [
  {
    title: 'แก้ไขโปรไฟล์',
    icon: EditOutlined,
    path: '/app/setting-profile',
  },
];

export const NavProfile = () => {
  const { data } = useGetUsers();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  const menu = {
    onClickListItem(path) {
      setVisible(false);
      return navigate(path);
    },
  };

  const userMenuOptions = (
    <ul className="gx-user-popover">
      {menuItem.map((el, i) => (
        <li
          key={i}
          onClick={() => menu.onClickListItem(el.path)}
          className={`gx-py-2 ${el.path === '#' && 'gx-not-allowed'}`}
        >
          <Icon className="gx-mr-3" type={el.icon} />
          <span className="gx-font-weight-normal">{el.title}</span>
        </li>
      ))}

      <li onClick={() => UserStore.SignOutAccess()} className="gx-py-2">
        <span>
          <LogoutOutlined className="gx-mr-3" />
          <span className="gx-font-weight-normal">ออกจากระบบ</span>
        </span>
      </li>
    </ul>
  );

  return (
    <Popover
      overlayClassName="gx-popover-horizantal"
      placement="bottomRight"
      content={userMenuOptions}
      trigger="click"
      className="m-0"
      visible={visible}
      onVisibleChange={setVisible}
    >
      <Avatar src={data?.user?.image_url || '/img/thumb-avatar/personel.png'} className="gx-avatar gx-pointer" alt="" />
    </Popover>
  );
};

export default observer(NavProfile);
