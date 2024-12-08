import { Button, Card, Col, Dropdown, Menu, Row, Typography } from 'antd';
import { useEffect, useState } from 'react';

import DialogNotification from 'components/shared-components/DialogNotification';
import EmptyDisplay from 'utils/EmptyDisplay';
import Guarded from 'components/shared-components/Guarded';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import PasswordEditor from 'views/app-views/SettingGlobals/Component/Modal/PasswordEditor';
import RolesCollapse from 'components/shared-components/RolesCollapse';
import UserBasicInformationCard from 'components/shared-components/UserBasicInformationCard';
import UserStore from 'mobx/UserStore';
import _ from 'lodash';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';

const { Text } = Typography;

const UserDetail = () => {
  const { id } = useParams();

  const [roles, setRoles] = useState([]);
  const [user, setUser] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const [isPasswordEditorVisible, setIsPasswordEditorVisible] = useState(false);

  const [error, setError] = useState(null);

  const menu = (
    <Menu
      items={[
        {
          key: 'รีเซ็ตรหัสผ่าน',
          label: 'รีเซ็ตรหัสผ่าน',
        },
      ]}
      onClick={(e) => {
        if (e.key === 'รีเซ็ตรหัสผ่าน') {
          setIsPasswordEditorVisible(true);
        }
      }}
    />
  );

  const onChangePassword = (values) => {
    UserStore.ChangePolicePassword(user?.person_card_id, values.password)
      .then(() => {
        DialogNotification('success', 'แก้ไขรหัสผ่านสำเร็จ');
        setIsPasswordEditorVisible(false);
      })
      .catch((err) => {
        DialogNotification('error', 'แก้ไขรหัสผ่านไม่สำเร็จ');
        return err;
      });
  };

  useEffect(() => {
    setIsFetching(true);
    setError(null);
    UserStore.GetUser(id)
      .then((resp) => {
        setRoles(_.get(resp, 'data.role', []));
        setUser(_.get(resp, 'data.user', {}));
      })
      .catch((error) => {
        console.error(error);
        setError(error);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [id]);

  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'ตั้งค่าผู้ใช้งาน', subpath: 'เรียกดูผู้ใช้งาน' }}>
        <Guarded query={{ group: 'System Administration', type: 'ผู้ใช้งาน', action: 'update' }}>
          <Dropdown overlay={menu}>
            <Button ghost>เพิ่มเติม</Button>
          </Dropdown>
        </Guarded>
      </PageBreadcrumb>
      <Card loading={isFetching}>
        {error && EmptyDisplay.default}
        {!error && <UserBasicInformationCard user={user} />}
        {/* <Row>
          <Col span={24}>
            <Text strong>ไฟล์แนบเอกสารที่เกี่ยวข้อง</Text>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <List
              className="gx-mt-4"
              itemLayout="horizontal"
              dataSource={user.files}
              split={false}
              renderItem={(item) => (
                <Row>
                  <Col span={24}>
                    <AttachmentListItem item={item} />
                  </Col>
                </Row>
              )}
            />
          </Col>
        </Row> */}
      </Card>
      {!error && !!roles.length && (
        <Card loading={isFetching}>
          <Row>
            <Col span={24}>
              <Text className="gx-mb-3">สิทธิ์การใช้งาน</Text>
            </Col>
            <Col span={24} className="gx-mt-4">
              <RolesCollapse roles={roles} defaultActiveKey={roles.map((v) => v._id)} />
            </Col>
          </Row>
        </Card>
      )}
      <PasswordEditor
        visible={isPasswordEditorVisible}
        setVisible={setIsPasswordEditorVisible}
        onSubmit={onChangePassword}
        onCancel={() => setIsPasswordEditorVisible(false)}
        isActionLoading={UserStore.actionLoading}
      />
    </>
  );
};

export default observer(UserDetail);
