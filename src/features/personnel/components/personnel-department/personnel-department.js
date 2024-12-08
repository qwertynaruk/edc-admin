import { Button, Form, Input, Menu, Space, Spin, Typography } from 'antd';
import { pick, values } from 'lodash';
import { useEffect, useState } from 'react';

import { DepartmentForm } from './components/department-form';
import DialogNotification from 'components/shared-components/DialogNotification';
import Flex from 'components/shared-components/Flex';
import { GuardHandlesV2 } from 'components/shared-components/Guarded';
import LabsContent from 'components/layout-components/LabsContent';
import PersonnelService from 'services/PersonelService';
import { SearchOutlined } from '@ant-design/icons';
import UserStore from 'mobx/UserStore';
import { css } from '@emotion/css';
import { toJS } from 'mobx';
import { useToggle } from '@mantine/hooks';

export const PersonnelDepartment = () => {
  const [isShowInputSearch, toggleInputSearch] = useToggle();
  const [isCreateDepartment, toggleCreateDepartment] = useToggle();
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [departmentsMaster, setDepartmentsMaster] = useState([]);
  const { organization } = UserStore;
  const [form] = Form.useForm();

  const { canUpdate, canCreate } = GuardHandlesV2({ group: 'Personnel', type: 'ฝ่ายงาน' });

  const getListDepartment = () => {
    PersonnelService.getDepartment({ params: { organization_id: organization?._id } })
      .then((items) => {
        setDepartments(items?.data || []);
        setDepartmentsMaster(items?.data || []);
      })
      .finally(() => setLoading(false));
  };

  const onCreateDepartment = () => {
    form.resetFields();
    setSelectedDepartment(null);
    toggleCreateDepartment(true);
  };

  const onSelectedDepartment = (key) => {
    setLoading(true);
    PersonnelService.getDepartmentById({ id: key })
      .then((res) => {
        toggleCreateDepartment(false);
        if (res?.data) {
          form.setFieldsValue(res?.data);
        }
      })
      .catch(() => DialogNotification('error', 'ไม่สามารถแสดงรายละเอียดของฝ่ายงานนี้ได้ กรุณาลองใหม่อีกครั้ง'))
      .finally(() => setLoading(false));

    setSelectedDepartment(key);
  };

  const onFinish = (formData) => {
    setLoading(true);
    const { _id } = toJS(organization);

    const payload = {
      organization_id: _id,
      ...formData,
    };

    if (selectedDepartment) {
      PersonnelService.updateDepartment({
        data: payload,
        params: { department_id: selectedDepartment },
      })
        .then(() => {
          getListDepartment();
          DialogNotification('success', 'แก้ไขฝ่ายงานสำเร็จ');
        })
        .catch(() => DialogNotification('error', 'แก้ไขฝ่ายงานไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'))
        .finally(() => setLoading(false));
    } else {
      PersonnelService.createDepartment({
        data: payload,
      })
        .then(() => {
          getListDepartment();
          toggleCreateDepartment(false);
          DialogNotification('success', 'สร้างฝ่ายงานสำเร็จ');
        })
        .catch(() => DialogNotification('error', 'สร้างฝ่ายงานไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'))
        .finally(() => setLoading(false));
    }
  };

  const onCancel = () => {
    toggleCreateDepartment(false);
    setSelectedDepartment(null);
  };

  useEffect(() => {
    getListDepartment();
  }, []);

  const onSearch = (searchs) => {
    try {
      if (!searchs) {
        throw new Error('Empty!');
      }

      const tx = departmentsMaster.filter((ss) => {
        const searchKey = pick(ss, ['name_en', 'short_name_en', 'name_th', 'short_name_th']);
        const res = values(searchKey).filter((uu) => uu.includes(searchs));
        return res.length > 0;
      });
      setDepartments(tx);
    } catch (error) {
      setDepartments(departmentsMaster);
    }
  };

  const FooterContent = () => {
    return (
      <Space size={10} style={{ width: '100%', justifyContent: 'flex-end' }}>
        <Button onClick={onCancel} loading={loading}>
          ยกเลิก
        </Button>

        {selectedDepartment && canUpdate && (
          <Button type="primary" onClick={() => form.submit()} loading={loading}>
            บันทึก
          </Button>
        )}

        {isCreateDepartment && canCreate && (
          <Button type="primary" onClick={() => form.submit()} loading={loading}>
            ยืนยัน
          </Button>
        )}
      </Space>
    );
  };

  return (
    <div
      className={css`
        .gx-module-box {
          @media (min-width: 992px) {
            max-width: calc(100% - 240px) !important;
          }
        }

        .gx-module-side-content {
          max-width: 235px !important;
        }

        .gx-module-box-content {
          overflow-y: auto !important;
        }

        .ant-menu-submenu-title {
          padding-left: 0 !important;
        }

        .ant-menu-submenu > .ant-menu.ant-menu-sub .ant-menu-item {
          padding-left: 24px !important;
        }
      `}
    >
      <LabsContent
        titleContent={
          <Typography.Title level={4} className="gx-mb-0">
            ฝ่ายงาน
          </Typography.Title>
        }
        sideContent={
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '20px',
              maxHeight: 'calc(100vh - 265px)',
              overflowY: 'auto',
            }}
          >
            <Flex className="gx-mb-3 gx-flex-nowrap" justifyContent="between">
              {canCreate && (
                <Button type="primary" block onClick={() => onCreateDepartment()}>
                  เพิ่ม
                </Button>
              )}
              <Button
                style={{
                  border: '2px solid #1b2531',
                }}
                onClick={() => toggleInputSearch()}
              >
                <SearchOutlined />
              </Button>
            </Flex>
            {isShowInputSearch && (
              <Input placeholder="ค้นหาฝ่ายงาน" className="gx-mb-3" onKeyUp={(e) => onSearch(e.target.value)} />
            )}
            <Spin spinning={loading}>
              <Menu
                defaultSelectedKeys={['all']}
                defaultOpenKeys={['status']}
                className={css`
                  .ant-menu-item {
                    padding: 0 !important;
                  }
                `}
                selectedKeys={[selectedDepartment]}
                onClick={({ key }) => onSelectedDepartment(key)}
                mode="inline"
                items={departments.map((ss) => ({
                  key: ss?._id || '',
                  label: ss?.name_th || 'unknown',
                }))}
              />
            </Spin>
          </div>
        }
        header={<></>}
        footer={selectedDepartment || isCreateDepartment ? <FooterContent /> : undefined}
      >
        {!selectedDepartment && !isCreateDepartment && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Typography.Title
              level={2}
              style={{
                color: 'rgba(84, 96, 111, 0.6)',
              }}
            >
              <i>กรุณาเลือก ฝ่ายงาน</i>
            </Typography.Title>
          </div>
        )}
        {(selectedDepartment || isCreateDepartment) && (
          <div className="gx-p-3">
            <Spin spinning={loading}>
              <DepartmentForm form={form} onFinish={onFinish} />
            </Spin>
          </div>
        )}
      </LabsContent>
    </div>
  );
};
