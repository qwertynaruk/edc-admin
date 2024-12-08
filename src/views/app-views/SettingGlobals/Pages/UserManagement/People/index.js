import { Card, Col, Form, Row, Space, Typography } from 'antd';
import { columnDateRender, columnImageRender } from 'components/shared-components/CustomTable/useTableColumnRender';
import { exportColumns, exportDataSource } from 'components/shared-components/CustomTable/useTableExport';
import { useEffect, useMemo, useReducer } from 'react';

import AbilitySelector from 'views/app-views/SettingGlobals/Component/AbilitySelector';
import AccountService from 'services/AccountService';
import CustomTable from 'components/shared-components/CustomTable';
import ExportButton from 'components/shared-components/ExportButton';
import Guarded from 'components/shared-components/Guarded';
import InputTextNumber from 'components/shared-components/InputTextNumber';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import RoleSelector from 'views/app-views/SettingGlobals/Component/RoleSelector';
import TabControlPagePanel from 'components/shared-components/TabControlPagePanel';
import { UserOutlined } from '@ant-design/icons';
import { iso8601Sorter } from 'utils/tableSorter';
import { observer } from 'mobx-react';
import produce from 'immer';
import useColumnFilter from 'components/shared-components/CustomTable/useColumnFilter';
import { useNavigate } from 'react-router-dom';
import useService from 'hooks/useService';
import useTableDataSource from 'components/shared-components/CustomTable/useTableDataSource';

const { Title } = Typography;

const columnBooleanRender = (text, record) => {
  if (typeof text === 'undefined') {
    return 'ไม่ทราบ';
  }
  return text ? 'ใช้งาน' : 'ไม่ใช้งาน';
};

const AdvancedFilter = () => {
  return (
    <>
      <Row gutter={[16, 16]} className="gx-flex-row">
        <Col span={8}>
          <Form.Item label="เลขประจำตัวประชาชน">
            <InputTextNumber placeholder="กรอกเลขประจำตัวประชาชน" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="เบอร์โทรศัพท์">
            <InputTextNumber placeholder="กรอกเบอร์โทรศัพท์" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="gx-flex-row">
        <Col span={24}>
          <Form.Item label="สิทธิ์การใช้งาน">
            <RoleSelector placeholder="เลือกสิทธิ์การใช้งาน" mode="multiple" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="gx-flex-row">
        <Col span={24}>
          <Form.Item label="ความสามารถ">
            <AbilitySelector placeholder="เลือกความสามารถ" mode="multiple" />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

const init = () => {
  const users = null;
  return {
    menu: 'ผู้ใช้งานทั้งหมด',
    users,
  };
};

const ACTION = {
  SET_USERS: 'SET_USERS',
};

const reducer = produce((draft, action) => {
  switch (action.type) {
    case ACTION.SET_USERS:
      draft.users = action.payload;
      return;
    default:
      return draft;
  }
});

const People = () => {
  const [state, dispatch] = useReducer(reducer, init(), init);
  const navigate = useNavigate();
  const { data: accounts, loading } = useService(AccountService.peopleList);

  const { columnSearch, columnFilter } = useColumnFilter();

  const tableDataSource = useTableDataSource();
  const { currentDataSource, setDataSource } = tableDataSource;

  const columns = useMemo(() => {
    return [
      {
        title: 'รูปภาพ',
        dataIndex: 'profile',
        render: columnImageRender,
      },
      {
        title: 'ผู้ใช้งาน',
        dataIndex: 'email',
        ...columnSearch('email', {
          placeholder: 'ค้นหาผู้ใช้งาน',
        }),
      },
      {
        title: 'ชื่อ',
        dataIndex: 'first_name_th',
        ...columnSearch('first_name_th', {
          placeholder: 'ค้นหาชื่อ',
        }),
      },
      {
        title: 'นามสกุล',
        dataIndex: 'last_name_th',
        ...columnSearch('last_name_th', {
          placeholder: 'ค้นหานามสกุล',
        }),
      },
      {
        title: 'สถานะ',
        dataIndex: 'is_active',
        ...columnFilter('is_active', {
          filters: [
            {
              label: 'ใช้งาน',
              value: true,
            },
            {
              label: 'ไม่ใช้งาน',
              value: false,
            },
          ],
        }),
        render: columnBooleanRender,
      },
      {
        title: 'วันที่อัปเดตข้อมูล',
        dataIndex: 'updated_at',
        sorter: (a = {}, b = {}) => iso8601Sorter(a.updated_at, b.updated_at),
        render: (e) => columnDateRender(e),
      },
    ];
  }, [columnSearch, columnFilter]);

  const onSearchChange = (filtered) => {
    tableDataSource.setCurrentDataSource(filtered);
  };

  useEffect(() => {
    setDataSource(accounts);
    dispatch({
      type: ACTION.SET_USERS,
      payload: accounts,
    });
  }, [setDataSource, accounts]);

  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'ตั้งค่า', subpath: 'ผู้ใช้งาน' }} />
      <TabControlPagePanel
        items={[
          {
            name: 'เจ้าหน้าที่',
            key: 'officer',
          },
          {
            name: 'ประชาชน',
            key: 'people',
          },
        ]}
        sourceData={accounts}
        setFilteredData={onSearchChange}
      />
      <Card
        loading={loading}
        title={
          <Space className="gx-justify-content-between gx-mb-2">
            <Space>
              <UserOutlined style={{ fontSize: 24 }} />
              <Title level={5} className="gx-mb-0">
                ผู้ใช้งาน
              </Title>
            </Space>
            <Guarded query={{ group: 'System Administration', type: 'ผู้ใช้งาน', action: 'update' }}>
              <Space align="center" style={{ justifyContent: 'end' }}>
                {tableDataSource?.exportDataSource && (
                  <Space>
                    {tableDataSource.exportDataSource.length !== 0 && (
                      <ExportButton
                        column={exportColumns(columns)}
                        dataSource={exportDataSource(tableDataSource.exportDataSource, columns)}
                        fileName="people-export"
                      />
                    )}
                  </Space>
                )}
              </Space>
            </Guarded>
          </Space>
        }
      >
        <CustomTable
          columns={columns}
          dataSource={currentDataSource}
          size="middle"
          onChange={(_, __, ___, action) => {
            tableDataSource.setExportDataSource(action.currentDataSource);
          }}
          onRow={(record, _) => {
            return {
              onClick: () => navigate(`${record._id}`),
            };
          }}
        />
      </Card>
    </>
  );
};
export default observer(People);
