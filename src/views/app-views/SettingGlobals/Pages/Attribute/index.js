import { ArrowLeftOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Col, Menu, Row, Select, Space, Spin, Typography } from 'antd';
import Guarded, { GuardHandles } from 'components/shared-components/Guarded';
import { useEffect, useMemo, useState } from 'react';

import AddAttribute from '../../Component/Modal/AddAttribute';
import AttributeEditor from '../../Component/AttributeEditor';
import AttributeStore from 'mobx/AttributeStore';
import CustomTable from 'components/shared-components/CustomTable';
import DialogNotification from 'components/shared-components/DialogNotification';
import EmptyDisplay from 'utils/EmptyDisplay';
import LabsContent from 'components/layout-components/LabsContent';
import MasterAttributeStore from 'mobx/MasterAttributeStore';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import { ThaiDateTime } from 'utils/ThaiDateTime';
import moment from 'moment';
import { observer } from 'mobx-react';

const { Title } = Typography;

const columns = [
  {
    title: 'ชื่อคุณลักษณะ (ชื่อย่อ)',
    dataIndex: 'name_th',
    key: 'name',
  },
  {
    title: 'วันเวลาที่อัปเดตข้อมูล',
    dataIndex: 'updated_at',
    key: 'date',
    width: '20%',
    render: (text) => {
      return text ? ThaiDateTime(moment.utc(text), 'short-month-full') : 'ไม่พบรายการ';
    },
  },
];

const AttributeManagement = (props) => {
  const canUpdated = GuardHandles({
    query: {
      group: 'System Administration',
      action: 'update',
      name: 'แก้ไขข้อมูลคุณลักษณะ',
    },
    abilities: 'canUpdate',
  });
  const [visibleModal, setVisibleModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [panelLoading, setPanelLoading] = useState(false);
  const [record, setRecord] = useState(null);
  const [currentPages, setCurrentPages] = useState(1);
  const { content_loading: isLoading } = AttributeStore;
  const { attributeTypes, attributeItems } = MasterAttributeStore;
  const [isShowTypeSearch, setIsShowTypeSearch] = useState(false);

  const [currentMenu, setCurrentMenu] = useState();

  const onMenuClick = (_eKey) => {
    setCurrentMenu(_eKey);
    onFetchData(_eKey, 1);
  };

  const onFetchData = (selectMenus, atPage = 1) => {
    setPanelLoading(true);
    setCurrentPages(atPage);
    MasterAttributeStore.getAttributeItems(selectMenus, true, {
      page: atPage,
      limit: 10,
    }).finally(() => setPanelLoading(false));
  };

  const computedData = useMemo(() => {
    try {
      return attributeItems ? attributeItems.map((x) => ({ ...x, key: x._id })) : [];
    } catch (error) {
      return [];
    }
  }, [attributeItems]);

  const onBackClick = () => {
    setRecord(null);
  };

  const onRowItemClick = (record) => {
    return () => {
      setRecord(record);
    };
  };

  const onCancel = () => {
    setRecord(null);
  };

  const onSubmit = (values) => {
    AttributeStore.Update(record._id, values)
      .then(() => {
        DialogNotification('success', 'แก้ไขคุณลักษณะสำเร็จ');
        setVisibleModal(false);
        setRecord(null);
        onFetchData(currentMenu, 1);
      })
      .catch(() => {
        DialogNotification('error', 'แก้ไขคุณลักษณะไม่สำเร็จ');
      });
  };

  useEffect(() => {
    setLoading(true);
    MasterAttributeStore.getAttributeTypes().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!attributeTypes) return;
    if (attributeTypes.length === 0) return;
    onMenuClick(attributeTypes[0]._id);
  }, [attributeTypes]);

  useEffect(() => {
    if (!canUpdated) {
      setIsShowTypeSearch(true);
    }
  }, [canUpdated]);

  return (
    <>
      <div className="gx-main-content">
        <PageBreadcrumb history={props.history} pageLabel={{ master: 'ตั้งค่า', subpath: 'คุณลักษณะ' }} />
        <LabsContent
          titleContent={
            <Space>
              <SettingOutlined style={{ fontSize: 24 }} />
              <Title level={5} className="gx-mb-0">
                คุณลักษณะ
              </Title>
            </Space>
          }
          sideContent={
            <>
              <Spin spinning={loading}>
                <Guarded
                  query={{
                    group: 'System Administration',
                    type: 'คุณลักษณะ',
                    action: 'update',
                  }}
                >
                  <Row className="gx-mt-2 gx-px-2 gx-flex-row" gutter={[8, 8]}>
                    <Col flex="auto">
                      <Button className="gx-full-width" type="primary" onClick={() => setVisibleModal(true)}>
                        เพิ่ม
                      </Button>
                    </Col>
                    <Col>
                      <Button type="primary" onClick={() => setIsShowTypeSearch(!isShowTypeSearch)}>
                        <SearchOutlined />
                      </Button>
                    </Col>
                  </Row>
                </Guarded>
                {isShowTypeSearch && (
                  <Select
                    className="gx-p-2 gx-w-100"
                    showSearch
                    showArrow={false}
                    onSelect={(_, item) => {
                      onMenuClick(item.key);
                      setIsShowTypeSearch(false);
                    }}
                    optionFilterProp="children"
                    filterOption={(input, option) => option.children.includes(input)}
                  >
                    {attributeTypes.map((type) => (
                      <Select.Option key={type._id} value={type.name_th}>
                        {type.name_th}
                      </Select.Option>
                    ))}
                  </Select>
                )}
                <Menu
                  style={{ height: '550px', overflowY: 'scroll' }}
                  onClick={(e) => {
                    if (e.key !== currentMenu) {
                      setRecord(null);
                    }

                    onMenuClick(e.key);
                  }}
                  mode="inline"
                  selectedKeys={[currentMenu]}
                  items={attributeTypes.map((item) => ({
                    key: item._id,
                    label: item.name_th,
                  }))}
                />
              </Spin>
            </>
          }
          header={
            record ? (
              <ArrowLeftOutlined onClick={onBackClick} />
            ) : (
              <>
                {/* <Input.Search
                  className="gx-search-bar gx-lt-icon-search-bar-lg gx-module-search-bar gx-d-none gx-d-sm-block gx-mb-0"
                  placeholder="input search text"
                  ghost
                /> */}
              </>
            )
          }
        >
          {/* <Suspense fallback={<Loading cover="content" />}>
            <Routes>
              <Route
                exact
                path={`${match.path}`}
                component={lazy(() =>
                  import("views/app-views/SettingGlobals/Pages/Attribute/Edit")
                )}
              />
            </Routes>
          </Suspense> */}
          <Spin spinning={panelLoading}>
            {record ? (
              <AttributeEditor
                style={{ padding: '10px' }}
                // form={form}
                record={record}
                type={attributeTypes.name_th}
                onCancel={onCancel}
                onSubmit={onSubmit}
              />
            ) : (
              <CustomTable
                loading={isLoading}
                columns={columns}
                dataSource={computedData}
                onRow={(record, rowIndex) => {
                  return {
                    onClick: onRowItemClick(record),
                  };
                }}
                locale={EmptyDisplay.byLocale}
                pagination={{
                  pageSize: 10,
                  total: MasterAttributeStore.attributeItemsTotal,
                  current: currentPages,
                  onChange: (ss) => onFetchData(currentMenu, ss),
                }}
              />
            )}
          </Spin>
        </LabsContent>
      </div>

      <AddAttribute visible={visibleModal} setVisible={setVisibleModal} />
    </>
  );
};
export default observer(AttributeManagement);
