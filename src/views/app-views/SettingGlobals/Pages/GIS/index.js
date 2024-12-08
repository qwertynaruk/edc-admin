import { Button, Col, Menu, Row, Select, Space, Spin, Typography } from 'antd';
import Guarded, { GuardHandles } from 'components/shared-components/Guarded';
import { useEffect, useState } from 'react';

import DialogNotification from 'components/shared-components/DialogNotification';
import GISForm from '../../Component/Form/GISForm';
import GISService from 'services/GISService';
import LabsContent from 'components/layout-components/LabsContent';
import LabsContentEmpty from 'components/layout-components/LabsContentEmpty';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import { SearchOutlined } from '@ant-design/icons';
import ShapefilesBrowser from '../../Component/ShapfilesBrowser';
import { fileNameAndExtensionSerializer } from 'utils/serializer';
import produce from 'immer';
import useGISZones from 'hooks/services/useGISZones';

const { Title } = Typography;

const GIS = () => {
  const { data: zones, loading, mutate } = useGISZones({});
  const canUpdated = GuardHandles({
    query: {
      group: 'System Administration',
      type: 'ข้อมูลสารสนเทศภูมิศาสตร์',
      action: 'update',
    },
    abilities: 'canUpdate',
  });
  const [state, setState] = useState({
    menu: '',
    showSearch: false,
    sideMenuItems: [],
  });
  const onCancelClick = () => {
    setState(
      produce((draft) => {
        draft.menu = '';
      })
    );
  };
  const onMenuClick = (e) => {
    setState(
      produce((draft) => {
        draft.menu = e.key;
      })
    );
  };
  const doUpload = (menuItem, info) => {
    mutate(
      GISService.createZone({
        data: {
          data: {
            name: menuItem.key,
            json_file: info.content,
          },
        },
      })
    )
      .then((resp) => {
        setState(
          produce((draft) => {
            const index = draft.sideMenuItems.findIndex((item) => item.key === menuItem.key);
            if (index === -1) return;
            draft.sideMenuItems[index].key = resp.id;
            draft.sideMenuItems[index].label = resp.key;
            draft.sideMenuItems[index].disabled = false;
          })
        );
        DialogNotification('success', 'อัพโหลดไฟล์สำเร็จ');
      })
      .catch(() => {
        setState(
          produce((draft) => {
            const index = draft.sideMenuItems.findIndex((item) => item.key === menuItem.key);
            if (index === -1) return;
            draft.sideMenuItems.splice(index, 1);
          })
        );
        DialogNotification('error', 'ไม่สามารถอัพโหลดไฟล์ได้');
      });
  };
  const onShapefileBrowseChange = (obj) => {
    const { file, content } = obj;
    if (file.status !== 'done') return;
    const [name] = fileNameAndExtensionSerializer(file.name);
    const duplicate = zones.filter((item) => item.name.startsWith(name));
    const key = duplicate.length > 0 ? `${name} (${duplicate.length})` : name;
    const newMenuItem = { key, label: <Spin spinning={true}>{key}</Spin>, disabled: true };
    setState(
      produce((draft) => {
        draft.sideMenuItems.push(newMenuItem);
      })
    );
    doUpload(newMenuItem, { file, content });
  };

  useEffect(() => {
    if (!zones) return;
    setState(
      produce((draft) => {
        draft.sideMenuItems = zones.map((zone) => ({ key: zone._id, label: zone.name, disabled: false }));
      })
    );
  }, [zones]);

  useEffect(() => {
    if (!canUpdated) {
      setState(
        produce((draft) => {
          draft.showSearch = !draft.showSearch;
        })
      );
    }
  }, [canUpdated]);

  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'ตั้งค่า', subpath: 'ข้อมูลสารสนเทศภูมิศาสตร์' }} />
      <LabsContent
        titleContent={
          <Space>
            <Title level={5} className="gx-mb-0">
              ข้อมูลสารสนเทศภูมิศาสตร์
            </Title>
          </Space>
        }
        header={<></>}
        sideContent={
          <Spin spinning={loading}>
            <Guarded
              query={{
                group: 'System Administration',
                type: 'ข้อมูลสารสนเทศภูมิศาสตร์',
                name: 'แก้ไขข้อมูลสารสนเทศภูมิศาสตร์',
              }}
            >
              <Row className="gx-mt-2 gx-px-2 gx-flex-row" gutter={[8, 8]}>
                <Col flex="auto">
                  <ShapefilesBrowser onChange={onShapefileBrowseChange} />
                </Col>
                <Col>
                  <Button
                    type="primary"
                    onClick={() =>
                      setState(
                        produce((draft) => {
                          draft.showSearch = !draft.showSearch;
                        })
                      )
                    }
                  >
                    <SearchOutlined />
                  </Button>
                </Col>
              </Row>
            </Guarded>
            {state.showSearch && (
              <Select
                className="gx-p-2 gx-w-100"
                showSearch
                showArrow={false}
                onSelect={(_, item) => {
                  setState(
                    produce((draft) => {
                      draft.menu = item.value;
                      draft.showSearch = false;
                    })
                  );
                }}
                filterOption={(input, option) => {
                  return option.label.includes(input);
                }}
                options={zones?.map((zone) => ({ value: zone._id, label: zone.name }))}
                placeholder="ระบุคำที่ต้องการค้นหา"
              />
            )}
            <Menu
              style={{ overflowY: 'scroll' }}
              className="gx-mt-2"
              mode="inline"
              onClick={onMenuClick}
              selectedKeys={state.menu}
              items={state.sideMenuItems}
            />
          </Spin>
        }
      >
        {!state.menu && (
          <LabsContentEmpty>
            <Space direction="vertical">
              <span>โปรดเลือกข้อมูล</span>
              <span>สารสนเทศภูมิศาสตร์</span>
            </Space>
          </LabsContentEmpty>
        )}
        {state.menu && <GISForm onCancel={onCancelClick} id={state.menu} mutate={mutate} />}
      </LabsContent>
    </>
  );
};

export default GIS;
