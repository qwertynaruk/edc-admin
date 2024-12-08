import { Button, Form, Input, Menu, Space, Spin, Typography } from 'antd';
import { pick, values } from 'lodash';
import { useEffect, useState } from 'react';

import DialogNotification from 'components/shared-components/DialogNotification';
import Flex from 'components/shared-components/Flex';
import { GuardHandlesV2 } from 'components/shared-components/Guarded';
import LabsContent from 'components/layout-components/LabsContent';
import PersonnelService from 'services/PersonelService';
import { PositionForm } from './components/position-form';
import { SearchOutlined } from '@ant-design/icons';
import UserStore from 'mobx/UserStore';
import { css } from '@emotion/css';
import { toJS } from 'mobx';
import { useToggle } from '@mantine/hooks';

export const PersonnelPosition = () => {
  const [isShowInputSearch, toggleInputSearch] = useToggle();
  const [isCreatePosition, toggleCreatePosition] = useToggle();
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rawPositions, setRawPositions] = useState([]);
  const [positions, setPositions] = useState([]);
  const { organization } = UserStore;

  const { canUpdate, canCreate } = GuardHandlesV2({ group: 'Personnel', type: 'ตำแหน่ง' });

  const [form] = Form.useForm();

  const getListPostion = () => {
    PersonnelService.getPosition({ params: { organization_id: organization?._id } })
      .then((items) => {
        setPositions(items?.data || []);
        setRawPositions(items?.data || []);
      })
      .finally(() => setLoading(false));
  };

  const onCreatePosition = () => {
    form.resetFields();
    setSelectedPosition(null);
    toggleCreatePosition(true);
  };

  const onSelectedPosition = (key) => {
    setLoading(true);
    PersonnelService.getPositionById({ id: key })
      .then((res) => {
        toggleCreatePosition(false);
        if (res?.data) {
          form.setFieldsValue(res?.data);
        }
      })
      .catch(() => DialogNotification('error', 'ไม่สามารถแสดงรายละเอียดของตำแหน่งงานนี้ได้ กรุณาลองใหม่อีกครั้ง'))
      .finally(() => setLoading(false));

    setSelectedPosition(key);
  };

  const onFinish = (formData) => {
    setLoading(true);
    const { _id } = toJS(organization);

    const payload = {
      organization_id: _id,
      ...formData,
    };

    if (selectedPosition) {
      PersonnelService.updatePosition({
        data: payload,
        params: { position_id: selectedPosition },
      })
        .then(() => {
          getListPostion();
          DialogNotification('success', 'แก้ไขตำแหน่งสำเร็จ');
        })
        .catch(() => DialogNotification('error', 'แก้ไขตำแหน่งไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'))
        .finally(() => setLoading(false));
    } else {
      PersonnelService.createPosition({
        data: payload,
      })
        .then(() => {
          getListPostion();
          toggleCreatePosition(false);
          DialogNotification('success', 'สร้างตำแหน่งสำเร็จ');
        })
        .catch((errs) => {
          const defaultMessage = 'กรุณาลองใหม่อีกครั้ง';
          const msg =
            errs && errs.message.includes('duplicate')
              ? `เนื่องจากชื่อตำแหน่ง (${errs.message.includes('EN') ? 'EN' : 'TH'}) ซ้ำ`
              : defaultMessage;
          DialogNotification('error', `สร้างตำแหน่งไม่สำเร็จ ${msg}`);
        })
        .finally(() => setLoading(false));
    }
  };

  const onCancel = () => {
    toggleCreatePosition(false);
    setSelectedPosition(null);
  };

  const onSearch = (searchs) => {
    try {
      if (!searchs) {
        throw new Error('Empty!');
      }

      const tx = rawPositions.filter((ss) => {
        const searchKey = pick(ss, ['name_en', 'short_name_en', 'name_th', 'short_name_th']);
        const res = values(searchKey).filter((uu) => uu.includes(searchs));
        return res.length > 0;
      });

      setPositions(tx);
    } catch (error) {
      setPositions(rawPositions);
    }
  };

  useEffect(() => {
    getListPostion();
  }, []);

  const FooterContent = () => {
    return (
      <Space size={10} style={{ width: '100%', justifyContent: 'flex-end' }}>
        <Button onClick={onCancel} loading={loading}>
          ยกเลิก
        </Button>

        {selectedPosition && canUpdate && (
          <Button type="primary" onClick={() => form.submit()} loading={loading}>
            บันทึก
          </Button>
        )}

        {isCreatePosition && canCreate && (
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
            ตำแหน่ง
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
                <Button type="primary" block onClick={() => onCreatePosition()}>
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
              <Input placeholder="ค้นหาตำแหน่ง" className="gx-mb-3" onKeyUp={(e) => onSearch(e.target.value)} />
            )}
            <Spin spinning={loading}>
              {!positions || positions.length <= 0 ? (
                <Typography style={{ opacity: 0.4 }}>No Data</Typography>
              ) : (
                <Menu
                  defaultSelectedKeys={['all']}
                  defaultOpenKeys={['status']}
                  className={css`
                    .ant-menu-item {
                      padding: 0 !important;
                    }
                  `}
                  selectedKeys={[selectedPosition]}
                  onClick={({ key }) => onSelectedPosition(key)}
                  mode="inline"
                  items={positions?.map((ss) => ({
                    key: ss?._id || '',
                    label: ss?.name_th || 'unknown',
                  }))}
                />
              )}
            </Spin>
          </div>
        }
        header={<></>}
        footer={selectedPosition || isCreatePosition ? <FooterContent /> : undefined}
      >
        {!selectedPosition && !isCreatePosition && (
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
              <i>กรุณาเลือก ตำแหน่ง</i>
            </Typography.Title>
          </div>
        )}
        {(selectedPosition || isCreatePosition) && (
          <div className="gx-p-3">
            <Spin spinning={loading}>
              <PositionForm form={form} onFinish={onFinish} />
            </Spin>
          </div>
        )}
      </LabsContent>
    </div>
  );
};
