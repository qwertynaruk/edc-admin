import { DeleteOutlined } from '@ant-design/icons';
import { css, cx } from '@emotion/css';
import { Button, Col, Form, Modal, Row, Space } from 'antd';
import PermissionSelectWidget from 'components/shared-components/PermissionSelectWidget';
import UserSelectWidget from 'components/shared-components/UserSelectWidget';
import useResetFormOnCloseModal from 'hooks/useResetFormOnCloseModal';
import { observer } from 'mobx-react';
import { useEffect } from 'react';

function SettingPermissionModal({ controls = [], onFinish, permissions = [] }) {
  const [visible, setVisible] = controls;
  const [form] = Form.useForm();

  useResetFormOnCloseModal({
    form,
    open: visible,
  });

  const close = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (!visible) return;
    form.setFieldsValue({
      list_permission: permissions,
    });
  }, [form, permissions, visible]);

  return (
    <Modal
      visible={visible}
      onCancel={close}
      title="ตั้งค่าสิทธิ์การเข้าถึง"
      centered={true}
      width={700}
      footer={
        <Space direction="vertical" align="end">
          <Space>
            <Button onClick={close}>ยกเลิก</Button>
            <Button type="primary" onClick={form.submit}>
              บันทึก
            </Button>
          </Space>
        </Space>
      }
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.List name="list_permission">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <Row
                  key={field.key}
                  gutter={8}
                  className={cx([
                    'gx-flex-row',
                    css`
                      margin: 0 -4px !important;
                    `,
                  ])}
                >
                  <Col span={12}>
                    <Form.Item name={[field.name, 'user_id']} label="ผู้ใช้งาน">
                      <UserSelectWidget showSearch placeholder="กรุณาเลือกผู้ใช้งาน" />
                    </Form.Item>
                  </Col>
                  <Col flex={1}>
                    <Form.Item name={[field.name, 'permission_id']} label="สิทธิ์การเข้าถึง">
                      <PermissionSelectWidget placeholder="กรุณาเลือกสิทธิ์การเข้าถึง" />
                    </Form.Item>
                  </Col>
                  <Col
                    span={2}
                    className={css`
                      display: flex;
                      align-items: center;
                      padding-top: 12px;
                    `}
                  >
                    <Button ghost onClick={() => remove(field.name)}>
                      <DeleteOutlined />
                    </Button>
                  </Col>
                </Row>
              ))}
              <Button type="primary" onClick={() => add()}>
                เพิ่มผู้ใช้งาน
              </Button>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
}

export default observer(SettingPermissionModal);
