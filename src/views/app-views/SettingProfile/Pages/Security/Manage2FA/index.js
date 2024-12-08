import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, Form, Image, Input, Modal, Row, Space, Spin, Switch, Typography } from 'antd';
import DialogNotification from 'components/shared-components/DialogNotification';
import _ from 'lodash';
import { observer } from 'mobx-react';
import TwoFactorAuthenStore from 'mobx/TwoFactorAuthenStore';
import { useEffect, useMemo, useState } from 'react';

const Manage2FA = () => {
  const [form] = Form.useForm();
  const { twoFactorAuthInfo } = TwoFactorAuthenStore;
  const [keyEnable, setKeyEnable] = useState(false);
  const [visible, setVisible] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const keyList = useMemo(() => _.get(twoFactorAuthInfo, 'fa_keys', []) || [], [twoFactorAuthInfo]);

  useEffect(() => {
    const isEnableCheck = _.get(twoFactorAuthInfo, 'is_enable_2fa', false) || false;
    setKeyEnable(isEnableCheck);
  }, [twoFactorAuthInfo]);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({ name: keyList.length > 0 ? keyList[0] : '' });
    }
  }, [form, keyList, visible]);

  const onExitModal = () => {
    form.resetFields();
    setVisible(false);
  };

  const onChangeEnable = (ss) => {
    setKeyEnable(ss);

    TwoFactorAuthenStore.updateTwoFactorAuthInfo({
      is_enable_2fa: ss,
    }).catch(() => {
      setKeyEnable(!ss);
    });
  };

  const onRemoveKey = () => {
    setFormLoading(true);
    TwoFactorAuthenStore.deleteTwoFactorAuthInfo()
      .then(() => {
        setVisible(false);
        setTimeout(() => {
          window.location.href = '/app/setting-profile/security';
        }, 500);
      })
      .finally(() => setFormLoading(false));
  };

  const onFinishForm = (values) => {
    setFormLoading(true);
    const { name = '' } = values;
    TwoFactorAuthenStore.updateTwoFactorAuthInfo({
      old_fa_key_name: keyList.length > 0 ? keyList[0] : '',
      new_fa_key_name: name,
    })
      .then(() => setVisible(false))
      .finally(() => setFormLoading(false));
  };

  return (
    <>
      <Space className="gx-full-width gx-space-between">
        <Typography.Text strong>เปิด-ปิด การยืนยันแบบ 2 ชั้นตอนแล้ว</Typography.Text>
        <Switch
          style={{ backgroundColor: '#D0D4D7' }}
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          checked={keyEnable}
          onChange={onChangeEnable}
        />
      </Space>
      <Divider className="gx-my-4" />
      <Space className="gx-full-width" direction="vertical">
        <Typography.Text strong>คีย์ที่ลงทะเบียน</Typography.Text>
        {keyList.length > 0
          ? keyList.map((key, index) => {
              return (
                <Card key={index}>
                  <Row align="middle">
                    <Col span={2}>
                      <Image src="/img/ghost-key-icon.png" width={33} height={33} preview={false} />
                    </Col>
                    <Col span={19}>
                      <Space direction="vertical">
                        <Typography.Text style={{ color: '#ffffff66' }}>USB security key</Typography.Text>
                        <Typography.Text>{key}</Typography.Text>
                      </Space>
                    </Col>
                    <Col span={3}>
                      <Button type="primary" onClick={() => setVisible(true)}>
                        แก้ไข
                      </Button>
                    </Col>
                  </Row>
                </Card>
              );
            })
          : null}
      </Space>

      <Modal
        title="ข้อมูลคีย์"
        maskClosable={false}
        width={570}
        visible={visible}
        onCancel={onExitModal}
        footer={
          <Space className="gx-full-width gx-space-between">
            <Button ghost style={{ color: '#FF3744' }} onClick={onRemoveKey}>
              นำคีย์ออก
            </Button>

            <Space>
              <Button onClick={onExitModal}>ยกเลิก</Button>
              <Button type="primary" onClick={() => form.submit()}>
                เสร็จ
              </Button>
            </Space>
          </Space>
        }
      >
        <Spin spinning={formLoading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinishForm}
            onFinishFailed={() => DialogNotification('warning', 'ไม่สามารถทำรายการได้', 'กรุณากรอกข้อมูลให้ครบ')}
          >
            <Form.Item
              name="name"
              label="ชื่อกุญแจรักษาความปลอดภัย"
              rules={[{ required: true, message: 'กรุณากรอกชื่อกุญแจรักษาความปลอดภัย' }]}
            >
              <Input placeholder="กรอกชื่อกุญแจรักษาความปลอดภัย" />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};

export default observer(Manage2FA);
