import { Dropdown, Menu } from 'antd';

import { CASE_STATUS } from 'mobx/MassNotificationStore';
import CustomTable from 'components/shared-components/CustomTable';
import Guarded from 'components/shared-components/Guarded';
import UserSelectWidget from 'components/shared-components/UserSelectWidget';
import { columnDateRender } from 'components/shared-components/CustomTable/useTableColumnRender';
import { iso8601Sorter } from 'utils/tableSorter';
import useColumnFilter from 'components/shared-components/CustomTable/useColumnFilter';
import { useMemo } from 'react';

const DataMassnotification = (props) => {
  const {
    data,
    menufocus,
    itemSelect,
    setItemSelect,
    isContentLoading = false,
    setCurrentRecord,
    modal = {},
    handle = {},
  } = props;

  const menuActionItem = (record) => {
    let result = [];
    if ([CASE_STATUS.PENDING, CASE_STATUS.DRAFT, CASE_STATUS.FAILED].includes(record.status)) {
      result = [...result, { key: 'delete', label: 'ลบ' }];
    }
    if ([CASE_STATUS.PENDING, CASE_STATUS.DRAFT].includes(record.status)) {
      result = [
        ...result,
        {
          key: 'edit',
          label: 'แก้ไข',
        },
        {
          key: 'publish',
          label: 'เผยแพร่',
        },
      ];
    }
    if ([CASE_STATUS.DRAFT].includes(record.status)) {
      result = [...result, { key: 'schedule', label: 'กำหนดเวลา' }];
    }
    if ([CASE_STATUS.PENDING].includes(record.status)) {
      result = [
        ...result,
        { key: 're-schedule', label: 'กำหนดเวลาอีกครั้ง' },
        { key: 'cancel-schedule', label: 'ยกเลิกกำหนดเวลา' },
      ];
    }

    return result;
  };

  const { columnSearch, columnFilter } = useColumnFilter();

  const columns = [
    // {
    //   title: 'ประเภทการเตือน',
    //   dataIndex: 'alertType',
    //   render: (text, record) => {
    //     return text === 'อื่น ๆ' ? record?.alertTypeTitle : text;
    //   },
    //   ...columnSearch('alertType', {
    //     placeholder: 'ค้นหาหัวข้อ',
    //   }),
    // },
    {
      title: 'รายละเอียด',
      dataIndex: 'message',
      render: (text) => {
        return text && (text.length > 50 ? text.substring(0, 50) + '...' : text);
      },
      ...columnSearch('message', {
        placeholder: 'ค้นหารายละเอียด',
      }),
    },

    {
      title: 'วันเวลาที่สร้าง',
      dataIndex: 'created_at',
      sorter: (a = {}, b = {}) => iso8601Sorter(a.created_at, b.created_at),
      render: (e) => columnDateRender(e),
    },

    {
      title: 'วันเวลาที่กำหนดส่ง',
      dataIndex: 'publish_time',
      sorter: (a = {}, b = {}) => iso8601Sorter(a.publish_time, b.publish_time),
      render: (e) => columnDateRender(e),
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      ...columnFilter('status', {
        filters: Object.keys(CASE_STATUS).map((key) => {
          return {
            label: CASE_STATUS[key],
            value: CASE_STATUS[key],
          };
        }),
      }),
    },

    {
      title: 'วันเวลาที่แก้ไขล่าสุด',
      dataIndex: 'updated_at',
      sorter: (a = {}, b = {}) => iso8601Sorter(a.updated_at, b.updated_at),
      render: (e) => columnDateRender(e),
    },
    {
      title: 'ผู้สร้าง',
      dataIndex: 'created_by',
      ...columnSearch('created_by', {
        placeholder: 'ค้นหาผู้สร้าง',
      }),
      render: (createdBy) => {
        return <UserSelectWidget viewMode={true} userId={createdBy} />;
      },
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => {
        if ([CASE_STATUS.SEND, CASE_STATUS.DELETED].includes(record.status)) {
          return null;
        }

        return (
          <Guarded
            query={{
              group: 'One Command',
              action: 'update',
              type: 'Mass Notification',
            }}
          >
            {(menuActionItem(record) || []).length > 0 && (
              <Dropdown
                overlay={
                  <Menu
                    items={menuActionItem(record)}
                    onClick={({ key }) => {
                      if (key === 'delete') {
                        handle.delete([record]);
                        return;
                      }
                      if (key === 'edit') {
                        setCurrentRecord(record);
                        if (record.receiver_type_id === 'police') {
                          modal.setVisiblePolice(true);
                          return;
                        }
                        if (record.receiver_type_id === 'people') {
                          modal.setVisiblePeople(true);
                          return;
                        }
                        return;
                      }
                      if (key === 'publish') {
                        handle.publish([record]);
                        return;
                      }
                      if (key === 'schedule') {
                        setCurrentRecord(record);
                        modal.setPublishedTimeVisible(true);
                        return;
                      }
                      if (key === 're-schedule') {
                        setCurrentRecord(record);
                        modal.setPublishedTimeVisible(true);
                        return;
                      }
                      if (key === 'cancel-schedule') {
                        setCurrentRecord(record);
                        modal.setCancelPublishTimeConfirm(true);
                      }
                    }}
                  />
                }
                placement="bottomRight"
                trigger={['click']}
              >
                <i className="gx-icon-btn icon icon-ellipse-v" />
              </Dropdown>
            )}
          </Guarded>
        );
      },
    },
  ];

  const onSelectChange = (_, selectedRows) => {
    setItemSelect(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys: itemSelect.map((item) => item._id),
    onChange: onSelectChange,
  };

  const filtered = useMemo(() => {
    if (menufocus === 'all') {
      return data;
    }
    return data.filter((e) => e.status === menufocus);
  }, [menufocus, data]);

  return (
    <>
      <CustomTable
        loading={isContentLoading}
        columns={columns}
        dataSource={filtered}
        size="middle"
        rowSelection={rowSelection}
      />
    </>
  );
};

export default DataMassnotification;
