import { Card, Col, Modal, Row, Space, Typography } from 'antd';
import { lazy, useEffect, useState } from 'react';

import ChangePassword from './Pages/Security/ChangePassword';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import { ProfilesPages } from 'features/profiles';
import { SettingOutlined } from '@ant-design/icons';
import UserStore from 'mobx/UserStore';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';

const { Title } = Typography;

const EditProfile = lazy(() => import('./Pages/EditProfile'));
const Security = lazy(() => import('./Pages/Security'));

const SettingProfile = () => {
  const params = useParams();
  const isEditProfile = params['*'] === 'edit-profile';

  const [open, setOpen] = useState(false);
  // const [submitBtn, setSubmitBtn] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Content of the modal');
  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    // setTimeout(() => {
    //   setOpen(false);
    //   setConfirmLoading(false);
    // }, 2000);
  };
  const handleCancel = () => {
    setConfirmLoading(false);
    setOpen(false);
  };

  useEffect(() => {
    UserStore.GetUser();
  }, []);

  return (
    <>
      <Row justify="space-between" className="gx-px-3">
        <Col>
          <PageBreadcrumb pageLabel={{ master: 'การตั้งค่าโปรไฟล์ทั่วไป' }} master="การตั้งค่าโปรไฟล์ทั่วไป" />
        </Col>
        {/* <Col>
          <Button
            onClick={() => showModal()}
            style={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
            type="text"
          >
            เปลี่ยนรหัสผ่าน
          </Button>
        </Col> */}
      </Row>

      <Card
        style={{ display: 'none' }}
        title={
          <Space>
            <SettingOutlined style={{ fontSize: 24 }} />
            <Title level={5} className="gx-mb-0">
              การตั้งค่าโปรไฟล์ทั่วไป
            </Title>
          </Space>
        }
      >
        <EditProfile />
      </Card>
      <Modal
        title="เปลี่ยนรหัสผ่าน"
        visible={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <ChangePassword confirmLoading={confirmLoading} setConfirmLoading={setConfirmLoading} onFinish={handleCancel} />
      </Modal>

      <ProfilesPages />
    </>
  );
};

export default observer(SettingProfile);
