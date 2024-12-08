import { Button, Divider, Form, Input, Modal, Space, Spin, Typography } from 'antd';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { lazy, useEffect, useState } from 'react';

import DialogNotification from 'components/shared-components/DialogNotification';
import Manage2FA from './Manage2FA';
import RouterErrorElement from 'components/shared-components/RouterErrorElement';
import TwoFactorAuthenStore from 'mobx/TwoFactorAuthenStore';
import UserStore from 'mobx/UserStore';
import _ from 'lodash';
import fetch from 'axios/FetchMaster';
import { observer } from 'mobx-react';
import useUser from 'hooks/services/useUser';

const ChangePassword = lazy(() => import('./ChangePassword'));
const TwoFA = lazy(() => import('./2fa'));
const SignaturePage = lazy(() => import('./Signature'));

const Security = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { user, loading } = useUser();

  const { twoFactorAuthInfo } = TwoFactorAuthenStore;
  const keyList = _.get(twoFactorAuthInfo, 'fa_keys', []) || [];
  const isEnable2fa = _.get(twoFactorAuthInfo, 'is_enable_2fa', false);

  const [visibleModal, setVisibleModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    // TwoFactorAuthenStore.getTwoFactorAuthInfo();
  }, []);

  const isHome = params['*'] === '';

  const onVerify2FA = async (values) => {
    setFormLoading(true);
    const { password = '' } = values;
    const { email = '' } = UserStore.accessAuthen;

    try {
      const resp = await fetch.authentication({
        method: 'POST',
        url: '/verify_password',
        data: { username: email, password, auth_type: 'police' },
      });

      const { statusCode = 400 } = resp;

      if (statusCode !== 200) {
        DialogNotification('error', 'ไม่สามารถตรวจสอบได้', 'เนื่องจากรหัสผ่านของคุณไม่ถูกต้อง');
        return;
      }

      setVisibleModal(false);
      navigate('2fa');
    } catch (error) {
      DialogNotification('error', 'ขออภัย', 'ระบบขัดข้อง');
    } finally {
      setFormLoading(false);
    }
  };

  if (!isHome)
    return (
      <Routes>
        <Route errorElement={<RouterErrorElement />} path="change-password" element={<ChangePassword />} />
        <Route errorElement={<RouterErrorElement />} path="signature" element={<SignaturePage />} />
        <Route errorElement={<RouterErrorElement />} path="my-2fa-key" element={<Manage2FA />} />
        <Route errorElement={<RouterErrorElement />} path="2fa/*" element={<TwoFA />} />
      </Routes>
    );
  return (
    <>
      <Space align="start" className="gx-space-between">
        <Space direction="vertical" size={15}>
          <Typography.Text strong>เปลี่ยนรหัสผ่าน</Typography.Text>
          <Typography.Text style={{ opacity: 0.4 }}>
            ควรใช้รหัสผ่านที่รัดกุมซึ่งไม่ซ้ำกับรหัสผ่านที่คุณใช้ที่อื่น
          </Typography.Text>
        </Space>
        <Button type="primary" onClick={() => navigate('change-password')}>
          แก้ไข
        </Button>
      </Space>

      {/* <Divider className="gx-my-4" /> */}

      {/* <Space align="start" className="gx-space-between">
        <Space direction="vertical" size={15}>
          <Typography.Text strong>การยืนยันตัวตนแบบสองชั้น</Typography.Text>

          <Typography.Paragraph className="gx-mb-0">
            <Typography.Text style={{ opacity: 0.4, fontSize: 18 }}>คีย์รักษาความปลอดภัย</Typography.Text>

            {isEnable2fa ? (
              <>
                <CheckCircleTwoTone style={{ fontSize: 14 }} twoToneColor=" #3e79f7" className="gx-ml-2 gx-mr-1" />
                <Typography.Text style={{ fontSize: 18 }}>เปิด</Typography.Text>
              </>
            ) : (
              <>
                <MinusCircleTwoTone style={{ fontSize: 14 }} twoToneColor=" #ff3744" className="gx-ml-2 gx-mr-1" />
                <Typography.Text style={{ fontSize: 18 }}>ปิด</Typography.Text>
              </>
            )}
          </Typography.Paragraph>

          <Typography.Text style={{ opacity: 0.4 }}>
            ใช้คีย์รักษาความปลอดภัยตัวจริงเพื่อช่วยปกป้องบัญชีของคุณจากการเข้าถึงที่ไม่ได้รับอนุญาต
            โดยที่คุณจะไม่จำเป็นต้องป้อนรหัส
          </Typography.Text>
        </Space>
        {keyList.length > 0 ? (
          <Button type="primary" onClick={() => navigate('my-2fa-key')}>
            จัดการคีย์ของฉัน
          </Button>
        ) : (
          <Button type="primary" onClick={() => setVisibleModal(true)}>
            แก้ไข
          </Button>
        )}
      </Space> */}

      {/* <Divider className="gx-my-4" />

      <Space align="start" className="gx-space-between">
        <Space direction="vertical" size={15}>
          <Typography.Text strong>ลายเซ็นของฉัน</Typography.Text>

          <Signature src={user?.signature} loading={loading} />

          <Typography.Text style={{ opacity: 0.4 }}>
            ใช้สำหรับเพิ่มลายมือชื่อสำหรับใช้ในงานเอกสารภายในระบบ
          </Typography.Text>
        </Space>
        <Button type="primary" onClick={() => navigate('signature')}>
          แก้ไข
        </Button>
      </Space> */}

      <Divider className="gx-my-4" />

      <Modal
        visible={visibleModal}
        title="โปรดป้อนรหัสผ่านของคุณอีกครั้ง"
        onCancel={() => setVisibleModal(false)}
        footer={[
          <Button form="myForm" key="back" onClick={() => setVisibleModal(false)}>
            ยกเลิก
          </Button>,
          <Button form="myForm" type="primary" htmlType="submit" key="submit" loading={formLoading}>
            ลงชื่อเข้าใช้
          </Button>,
        ]}
      >
        <Spin spinning={formLoading}>
          <Form id="myForm" layout="vertical" name="login-form" onFinish={onVerify2FA}>
            <p>เพื่อความปลอดภัยของคุณ คุณต้องป้อนรหัสผ่านอีกครั้งเพื่อดำเนินการต่อ</p>
            <Form.Item
              name="password"
              label="รหัสผ่าน"
              rules={[
                {
                  required: true,
                  message: 'กรุณากรอกรหัสผ่าน',
                },
              ]}
              style={{ marginBottom: 0 }}
            >
              <Input.Password placeholder="โปรดใส่รหัสผ่านของคุณ" />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};

export default observer(Security);
