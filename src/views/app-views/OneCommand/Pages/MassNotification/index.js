/* eslint-disable prettier/prettier */
import { Button, Card, Form, Menu, Space, Spin, Tooltip, Typography } from 'antd';
import IconCustom, { ClockCircleOutlined, CloseCircleOutlined, DeleteOutlined, SoundOutlined } from '@ant-design/icons';
import MassNotificationStore, { CASE_STATUS } from 'mobx/MassNotificationStore';
import { useEffect, useMemo, useState } from 'react';

import AddCommuPeopleModal from '../../Modal/AddCommuPeopleModal';
import AddCommuPoliceModal from '../../Modal/AddCommuPoliceModal';
import CancelPublish from '../../Modal/CancelPublish';
import CategoryMassNoti from '../../Modal/CategoryMassNoti';
import DataMassnotification from './DataMassnotification';
import DialogNotification from 'components/shared-components/DialogNotification';
import Guarded from 'components/shared-components/Guarded';
import LabsContent from 'components/layout-components/LabsContent';
import { ReactComponent as MassNotificationIcon } from 'assets/images/MassNotification.svg';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import PublishedTimeModal from '../../Modal/PublishedTimeModal';
import SearchMultiverse from 'components/shared-components/SearchMultiverse';
import _ from 'lodash';
import { observer } from 'mobx-react';
import styled from '@emotion/styled';
import { toJS } from 'mobx';
import useTableDataSource from 'components/shared-components/CustomTable/useTableDataSource';

const MenuItem = (props = {}) => {
  const { left, right } = props;
  return (
    <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
      <span>{left}</span>
      <CountLabel>{right}</CountLabel>
    </Space>
  );
};

const { Title } = Typography;
const CountLabel = styled.span`
  font-size: 12px;
`;

const MassNotification = (props) => {
  const [form] = Form.useForm();
  const [categorySelectVisible, setCategorySelectVisible] = useState(false);
  const [menuFocus, setOnMenuFocus] = useState('all');
  const [itemSelect, setItemSelect] = useState([]);
  const [publishedTimeVisible, setPublishedTimeVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [cancelPublishTimeConfirm, setCancelPublishTimeConfirm] = useState(false);
  const [visiblePeople, setVisiblePeople] = useState(false);
  const [visiblePolice, setVisiblePolice] = useState(false);

  const { notifications, actionLoading } = MassNotificationStore;

  const tableDataSource = useTableDataSource();

  const { dataSource, currentDataSource } = tableDataSource;

  const filterMenu = (e) => {
    setOnMenuFocus(e.key);
  };

  const menu = useMemo(() => {
    return [
      {
        key: 'all',
        label: <MenuItem left="ทั้งหมด" right={dataSource.length} />,
      },
      {
        key: 'case-status-filter',
        label: <MenuItem left="สถานะ" />,
        children: _.map(_.omit(CASE_STATUS, 'SEND'), (value, key) => {
          const filtered = currentDataSource.filter((x) => x.status === value);
          return {
            key: value,
            label: <MenuItem left={value} right={filtered.length} />,
          };
        }),
      },
    ];
  }, [dataSource, currentDataSource]);

  const handleError = () => {
    DialogNotification('error', 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
  };
  const handleSuccess = () => {
    DialogNotification('success', 'บันทึกสำเร็จ');
  };
  const handleBulkPublish = async (itemSelect) => {
    return MassNotificationStore.Notify(itemSelect, {
      status: CASE_STATUS.SEND,
    })
      .then(handleSuccess)
      .then(() => {
        setItemSelect([]);
      })
      .catch(handleError);
  };
  const handleBulkDelete = async (itemSelect) => {
    return MassNotificationStore.Update(itemSelect, {
      status: CASE_STATUS.DELETED,
    })
      .then(handleSuccess)
      .then(() => {
        setItemSelect([]);
      })
      .catch(handleError);
  };
  const handleBulkPublishTime = (itemSelect) => {
    form.resetFields();
    setCurrentRecord(null);
    setPublishedTimeVisible(true);
  };

  const onFormBulkPublishTimeSubmit = async (itemSelect, values) => {
    return MassNotificationStore.Notify(itemSelect, {
      status: CASE_STATUS.PENDING,
      publish_time: values.publish_time.toISOString(),
    })
      .then(handleSuccess)
      .then(() => {
        setItemSelect([]);
        setPublishedTimeVisible(false);
      })
      .catch(handleError);
  };

  const handleBulkCancelPublishTime = async (itemSelect) => {
    return MassNotificationStore.Update(itemSelect, {
      status: CASE_STATUS.DRAFT,
      publish_time: null,
    })
      .then(handleSuccess)
      .then(() => {
        setItemSelect([]);
        setPublishedTimeVisible(false);
      })
      .catch(handleError);
  };

  const handleUpdate = async (itemSelectCurrent, values) => {
    if (values?.publish_time && currentRecord) {
      values.status = CASE_STATUS.PENDING;
    }
    return MassNotificationStore.Update(currentRecord ? itemSelectCurrent : itemSelect, values)
      .then(handleSuccess)
      .then(() => {
        setItemSelect([]);
        setPublishedTimeVisible(false);
      })
      .catch(handleError);
  };

  // useEffect(() => {
  //   if (actionLoading) {
  //     return;
  //   }
  //   MassNotificationStore.Get();
  // }, [actionLoading]);

  useEffect(() => {
    tableDataSource.setDataSource(toJS(notifications));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications]);

  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'Mass Notification' }} />

      <Card>
        <SearchMultiverse
          mode="auto"
          nodeData={notifications}
          onSetNodeData={(nodes) => {
            tableDataSource.setCurrentDataSource(nodes);
          }}
        />
      </Card>

      <LabsContent
        titleContent={
          <>
            <div>
              <IconCustom className="gx-mr-2" component={MassNotificationIcon} style={{ fontSize: 24 }} />
            </div>
            <Title level={5} className="gx-mb-0">
              MASS NOTIFICATION
            </Title>
          </>
        }
        sideContent={
          <>
            <Guarded
              query={{
                group: 'One Command',
                type: 'Mass Notification',
                action: 'create',
              }}
            >
              <Button
                type="primary"
                style={{ margin: '20px auto 15px', width: '85%' }}
                onClick={() => {
                  form.resetFields();
                  setCurrentRecord(null);
                  setCategorySelectVisible(true);
                }}
              >
                เพิ่ม
              </Button>
            </Guarded>

            <Menu
              defaultSelectedKeys={[menuFocus]}
              defaultOpenKeys={['case-status-filter']}
              mode="inline"
              onClick={filterMenu}
              items={menu}
            />
          </>
        }
        header={
          <>
            <Space>
              {/* {itemSelect.length > 0 && (
                <div className="gx-mr-3">
                  <span>({itemSelect.length}) รายการที่ถูกเลือก</span>
                  <Button type="text" shape="circle" icon={<DeleteOutlined />} />
                </div>
              )} */}
              {itemSelect.length > 0 && (
                <Spin spinning={actionLoading}>
                  <Space direction="horizontal">
                    {itemSelect.every((item) =>
                      [CASE_STATUS.PENDING, CASE_STATUS.SEND, CASE_STATUS.FAILED, CASE_STATUS.DRAFT].includes(
                        item.status
                      )
                    ) && (
                        <Tooltip placement="bottom" title="เผยแพร่">
                          <Button
                            type="primary"
                            className="gx-flex-row gx-align-items-center gx-p-2"
                            onClick={() => handleBulkPublish(itemSelect)}
                          >
                            <SoundOutlined style={{ fontSize: 15 }} />
                          </Button>
                        </Tooltip>
                      )}

                    {itemSelect.every((item) => [CASE_STATUS.DRAFT].includes(item.status)) && (
                      <Tooltip placement="bottom" title="กำหนดเวลา">
                        <Button
                          type="primary"
                          className="gx-flex-row gx-align-items-center gx-p-2"
                          onClick={() => handleBulkPublishTime(itemSelect)}
                        >
                          <ClockCircleOutlined style={{ fontSize: 15 }} />
                        </Button>
                      </Tooltip>
                    )}

                    {itemSelect.every((item) => [CASE_STATUS.PENDING, CASE_STATUS.SEND].includes(item.status)) && (
                      <Tooltip placement="bottom" title="ยกเลิกกำหนดเวลา">
                        <Button
                          type="primary"
                          className="gx-flex-row gx-align-items-center gx-p-2"
                          onClick={() => {
                            setCurrentRecord(null);
                            setCancelPublishTimeConfirm(true);
                          }}
                        >
                          <CloseCircleOutlined style={{ fontSize: 15 }} />
                        </Button>
                      </Tooltip>
                    )}

                    {itemSelect.every((item) =>
                      [
                        CASE_STATUS.PENDING,
                        CASE_STATUS.SEND,
                        CASE_STATUS.FAILED,
                        CASE_STATUS.DELETED,
                        CASE_STATUS.DRAFT,
                      ].includes(item.status)
                    ) && (
                        <Tooltip placement="bottom" title="ลบ">
                          <Button
                            type="primary"
                            className="gx-flex-row gx-align-items-center gx-p-2"
                            onClick={() => handleBulkDelete(itemSelect)}
                          >
                            <DeleteOutlined style={{ fontSize: 15 }} />
                          </Button>
                        </Tooltip>
                      )}
                  </Space>
                </Spin>
              )}
            </Space>
          </>
        }
      >
        <DataMassnotification
          isContentLoading={MassNotificationStore.content_loading}
          menufocus={menuFocus}
          itemSelect={itemSelect}
          setItemSelect={setItemSelect}
          setCurrentRecord={setCurrentRecord}
          modal={{
            setCancelPublishTimeConfirm,
            setPublishedTimeVisible,
            setVisiblePeople,
            setVisiblePolice,
          }}
          data={currentDataSource}
          handle={{
            delete: handleBulkDelete,
            publish: handleBulkPublish,
            cancelPublishTime: handleBulkCancelPublishTime,
          }}
        />
      </LabsContent>
      <CategoryMassNoti
        visible={categorySelectVisible}
        setVisible={setCategorySelectVisible}
        setVisiblePeople={setVisiblePeople}
        setVisiblePolice={setVisiblePolice}
        record={currentRecord}
      />
      <CancelPublish
        visible={cancelPublishTimeConfirm}
        setVisible={setCancelPublishTimeConfirm}
        onConfirm={() => {
          if (currentRecord) {
            handleBulkCancelPublishTime([currentRecord]);
            return;
          }
          handleBulkCancelPublishTime(itemSelect);
        }}
      />

      <AddCommuPeopleModal visible={visiblePeople} setVisible={setVisiblePeople} record={currentRecord} />

      <AddCommuPoliceModal visible={visiblePolice} setVisible={setVisiblePolice} record={currentRecord} />
      <Form
        form={form}
        onFinish={(values) => {
          if (currentRecord) {
            handleUpdate([currentRecord], values);
            return;
          }
          onFormBulkPublishTimeSubmit(itemSelect, values);
        }}
      >
        <PublishedTimeModal
          form={form}
          visible={publishedTimeVisible}
          setVisible={setPublishedTimeVisible}
          record={currentRecord}
        />
      </Form>
    </>
  );
};

export default observer(MassNotification);
