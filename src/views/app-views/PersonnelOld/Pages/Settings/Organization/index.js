import { BankOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';
import { Button, Col, Divider, Form, Input, Menu, Row, Space, Spin, Typography } from 'antd';
import LabsContent from 'components/layout-components/LabsContent';
import LabsContentEmpty from 'components/layout-components/LabsContentEmpty';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import DialogNotification from 'components/shared-components/DialogNotification';
import useService from 'hooks/useService';
import produce from 'immer';
import { useMemo, useState } from 'react';
import PersonnelService from 'services/PersonelService';
import { serviceWrapper } from 'utils/serviceHelper';

export default function SettingOrganization() {
  const {
    data: organizations,
    loading,
    mutate,
  } = useService(serviceWrapper(PersonnelService.getRoleLevelOrganization), () => {
    return {
      params: {
        hotfix: 'organization',
      },
    };
  });
  const [state, setState] = useState({
    selectedMenu: null,
    isUpdating: false,
  });
  const [form] = Form.useForm();
  const onMenuChange = (e) => {
    form.resetFields();
    setState(
      produce((draft) => {
        draft.selectedMenu = e.key;
      })
    );
    const item = organizations.find((p) => p._id === e.key);
    form.setFieldsValue({
      ...item,
      role_level_id: item._id,
    });
  };
  const cancel = () => {
    setState(
      produce((draft) => {
        draft.selectedMenu = null;
      })
    );
    form.resetFields();
  };

  const create = () => {
    setState(
      produce((draft) => {
        draft.selectedMenu = 'create';
      })
    );
    form.resetFields();
  };

  const finish = (values) => {
    setState(
      produce((draft) => {
        draft.isUpdating = true;
      })
    );
    if (state.selectedMenu === 'create') {
      PersonnelService.createRoleLevelOrganization({
        data: values,
      })
        .then(() => {
          mutate();
          DialogNotification('success', 'สร้างสำเร็จ');
        })
        .catch(() => {
          DialogNotification('error', 'สร้างไม่สำเร็จ');
        })
        .finally(() => {
          setState(
            produce((draft) => {
              draft.isUpdating = false;
            })
          );
        });
      return;
    }
    PersonnelService.updateRoleLevel(values)
      .then(() => {
        mutate();
        DialogNotification('success', 'บันทึกสำเร็จ');
      })
      .catch(() => {
        DialogNotification('error', 'บันทึกไม่สำเร็จ');
      })
      .finally(() => {
        setState(
          produce((draft) => {
            draft.isUpdating = false;
          })
        );
      });
  };

  const menuItems = useMemo(() => {
    if (!organizations) return [];
    return organizations.map((item) => {
      return {
        key: item._id,
        label: item.name,
      };
    });
  }, [organizations]);

  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'ตั้งค่า', subpath: 'องค์กร' }} />
      <LabsContent
        loading={false}
        titleContent={
          <Space>
            <BankOutlined />
            <Typography.Title level={5} className="gx-mb-0">
              องค์กร
            </Typography.Title>
          </Space>
        }
        headerStyle={{ alignItems: 'end' }}
        header={<></>}
        sideContent={
          <Spin
            spinning={loading}
            className={css`
              min-height: 100px;
            `}
          >
            <Space direction="vertical">
              <div className="gx-p-2">
                <Button className="gx-full-width" type="primary" onClick={create}>
                  เพิ่ม
                </Button>
              </div>
              <Menu onClick={onMenuChange} mode="inline" items={menuItems} selectedKeys={[state.selectedMenu]} />
            </Space>
          </Spin>
        }
      >
        {state.selectedMenu ? (
          <div className="gx-p-4">
            <Typography.Title level={5}>ข้อมูลพื้นฐาน</Typography.Title>
            <Form form={form} onFinish={finish} layout="vertical">
              <Form.Item name="role_level_id" hidden>
                <Input />
              </Form.Item>
              <Row className="gx-flex-row">
                <Col span={12}>
                  <Form.Item label="ชื่อองค์กร" name="name">
                    <Input placeholder="กรอกชื่อองค์กร" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="ตัวย่อองค์กร" name="abbreviation">
                    <Input placeholder="กรอกตัวย่อองค์กร" />
                  </Form.Item>
                </Col>
              </Row>
              <Divider />
              <Space direction="vertical" align="end">
                <Space>
                  <Button onClick={cancel}>ยกเลิก</Button>
                  {state.selectedMenu === 'create' ? (
                    <Button type="primary" htmlType="submit" loading={state.isUpdating}>
                      สร้าง
                    </Button>
                  ) : (
                    <Button type="primary" htmlType="submit" loading={state.isUpdating}>
                      บันทึก
                    </Button>
                  )}
                </Space>
              </Space>
            </Form>
          </div>
        ) : (
          <LabsContentEmpty>กรุณาองค์กร</LabsContentEmpty>
        )}
      </LabsContent>
    </>
  );
}
