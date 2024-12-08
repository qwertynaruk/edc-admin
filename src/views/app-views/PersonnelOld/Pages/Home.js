/* eslint-disable prettier/prettier */
import 'styles/sweetalert/index.scss';

import { Avatar, Button, Card, Col, Dropdown, Menu, Row, Space, Spin, Typography } from 'antd';
import { exportColumns, exportDataSource } from 'components/shared-components/CustomTable/useTableExport';
import { useEffect, useMemo, useState } from 'react';

import CustomTable from 'components/shared-components/CustomTable';
import ExportButton from 'components/shared-components/ExportButton';
import { GLOBALS_PROPS } from 'views/app-views/SettingGlobals/Pages/Organization';
import Guarded from 'components/shared-components/Guarded';
import { IdcardOutlined } from '@ant-design/icons';
import LabsContent from 'components/layout-components/LabsContent';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import PersonnelService from 'services/PersonelService';
// import PersonnelSideMenu from '../Components/PersonnelSideMenu';
import SearchMultiverse from 'components/shared-components/SearchMultiverse';
import Swal from 'sweetalert2';
import axios from 'axios';
import { observer } from 'mobx-react';
import produce from 'immer';
import { serviceWrapper } from 'utils/serviceHelper';
import useColumnFilter from 'components/shared-components/CustomTable/useColumnFilter';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useService from 'hooks/useService';
import useTableDataSource from 'components/shared-components/CustomTable/useTableDataSource';

const { Title } = Typography;

const columnBooleanRender = (text) => {
  return text ? 'ใช้งาน' : 'ไม่ใช้งาน';
};

const Personnel = () => {
  const [state, setState] = useState({
    menu: 'ผู้ใช้งานทั้งหมด',
  });

  const {
    data: personnel,
    raw,
    loading: personnelLoading,
  } = useService(serviceWrapper(PersonnelService.get), () => {
    return {
      params: {
        hotfix: 'personnel-list',
      },
    };
  });

  const { data: dataSourceUserListApi, isLoading } = useQuery({
    queryKey: ['record-sos-data-detail'],
    // enabled: !!token,
    queryFn: async () => {
      const response = await axios.get(`https://dummyjson.com/users`);
      return response?.data?.users || null;
    },
  });
  // const { data: personnelByType, loading: personnelByTypeLoading } = useService(
  //   serviceWrapper(PersonnelService.getByType),
  //   () => {
  //     if (state.menu === 'ผู้ใช้งานทั้งหมด') {
  //       return null;
  //     }
  //     return {
  //       params: {
  //         role_level_ids: state.menu,
  //       },
  //     };
  //   }
  // );
  const navigate = useNavigate();

  const { columnSearch, columnFilter } = useColumnFilter();

  const tableDataSource = useTableDataSource();
  const { currentDataSource, setDataSource } = tableDataSource;

  const columns = useMemo(() => {
    return [
      {
        title: 'รูปภาพ',
        dataIndex: 'image',
        render: (text) => {
          return (
            <Space align="center" direction="vertical">
              <Avatar src={text}>
                <IdcardOutlined />
              </Avatar>
            </Space>
          );
        },
      },
      {
        title: 'คำนำหน้า',
        dataIndex: 'bloodGroup',
      },
      {
        title: 'ชื่อ - นามสกุล',
        dataIndex: 'first_name',
        render: (text, record) => {
          return `${record?.firstName} ${record?.lastName}`;
        },
      },
      {
        title: 'อีเมล',
        dataIndex: 'email',
      },
      {
        title: 'เบอร์โทร',
        dataIndex: 'phone',
      },
      {
        title: 'ระดับผู้ใช้งาน',
        dataIndex: 'height',
      },

      {
        title: 'สถานะ',
        dataIndex: 'age',
        render: (text, record) => {
          return record?.age > 40 ? (
            <Button style={{ borderColor: 'green', backgroundColor: 'unset' }} block>
              ใช้งาน
            </Button>
          ) : (
            <Button style={{ borderColor: 'red', backgroundColor: 'unset' }} block>
              ไม่ใช้งาน
            </Button>
          );
        },
      },
      {
        title: 'สิทธิ์การเข้าถึง',
        dataIndex: 'domain',
      },
      // {
      //   title: 'วันที่อัปเดตข้อมูล',
      //   dataIndex: 'updated_at',
      //   sorter: (a = {}, b = {}) => iso8601Sorter(a.updated_at, b.updated_at),
      //   render: (e) => columnDateRender(e),
      // },
      {
        title: '',
        key: 'action',
        render: (_, record) => {
          return (
            <Dropdown
              overlay={
                <Menu
                  items={[
                    { key: 'edit', label: 'แก้ไข' },
                    { key: 'delete', label: 'ลบ' },
                  ]}
                  onClick={(value) => {
                    console.log('key', value);
                    console.log('key, record', record);
                    if (value.key === 'delete') {
                      Swal.fire({
                        title: 'ยืนยันการลบหน่วยงานหรือองค์กร',
                        html: '<span>กรุณากรอกข้อความต่อไปนี้ “<span style="color: red">ORGANIZATION</span>” เพื่อยืนยันการลบ</span>',
                        icon: 'warning',
                        input: 'text',
                        inputPlaceholder: 'กรอกข้อความ',
                        inputValidator: (value) => {
                          if (!value) {
                            return 'กรุณากรอกข้อความ';
                          }
                          if (value !== 'ORGANIZATION') {
                            return 'กรุณากรอกข้อความให้ถูกต้อง';
                          }
                        },
                        showCancelButton: true,
                        ...GLOBALS_PROPS,
                        customClass: {
                          input: 'input-input-placeholder',
                          icon: 'swal2-icon-custom-color',
                        },
                        confirmButtonColor: '#e61414',
                        cancelButtonColor: '#495762',
                        reverseButtons: true,
                      }).then((res) => {
                        if (res.isConfirmed) {
                          console.log('confirm');
                        } else {
                          console.log('cancel clear');
                        }
                      });
                    }
                  }}
                />
              }
              placement="bottomRight"
              trigger={['click']}
            >
              <i className="gx-icon-btn icon icon-ellipse-v" />
            </Dropdown>
          );
        },
      },
    ];
  }, [columnSearch, columnFilter]);

  const onSearchChange = (filtered) => {
    tableDataSource.setCurrentDataSource(filtered);
  };

  const onMenuChange = (menu) => {
    setState(
      produce((draft) => {
        draft.menu = menu.key;
      })
    );
  };

  useEffect(() => {
    if (!personnel) return;
    setDataSource(personnel);
  }, [personnel, setDataSource]);

  // useEffect(() => {
  //   if (state.menu === 'ผู้ใช้งานทั้งหมด') {
  //     setDataSource(personnel);
  //     return;
  //   }
  //   if (!personnelByType) {
  //     return;
  //   }
  //   const personnelInDepartment = _.get(
  //     personnelByType.find((item) => item._id === state.menu),
  //     'personnel',
  //     []
  //   );
  //   setDataSource(personnelInDepartment);
  // }, [personnel, personnelByType, setDataSource, state.menu]);

  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'กำลังพล' }} />
      <Card>
        <SearchMultiverse
          mode="auto"
          nodeData={tableDataSource.dataSource}
          onSetNodeData={onSearchChange}
        // filter={{
        //   active: true,
        //   form,
        //   onSubmit: (values) => {
        //     console.log(values, 'test');
        //   },
        //   dropHeader: 'รายละเอียดกำลังพล',
        // }}
        >
          {/* <AdvancedFilter form={form} /> */}
        </SearchMultiverse>
      </Card>
      <LabsContent
        // loading={personnelLoading || personnelByTypeLoading}
        titleContent={
          <Space>
            <IdcardOutlined style={{ fontSize: 24 }} />
            <Title level={5} className="gx-mb-0">
              กำลังพล
            </Title>
          </Space>
        }
        headerStyle={{ alignItems: 'end' }}
        header={
          <Guarded
            query={{
              group: 'Personnel',
              type: 'กำลังพล',
              action: 'update',
            }}
          >
            <Space align="center" style={{ justifyContent: 'end' }}>
              {tableDataSource?.exportDataSource && (
                <Space>
                  {tableDataSource.exportDataSource.length !== 0 && (
                    <ExportButton
                      column={exportColumns(columns)}
                      dataSource={exportDataSource(tableDataSource.exportDataSource, columns)}
                      fileName="personnel-export"
                    />
                  )}
                </Space>
              )}
            </Space>
          </Guarded>
        }
        sideContent={
          <Spin spinning={personnelLoading}>
            <Guarded
              query={{
                group: 'Personnel',
                type: 'กำลังพล',
                action: 'update',
              }}
            >
              <Row className="gx-mt-2 gx-px-2 gx-flex-row" gutter={[8, 8]}>
                <Col span={24}>
                  <Button className="gx-full-width" type="primary" onClick={() => navigate(`../create`)}>
                    เพิ่ม
                  </Button>
                </Col>
              </Row>
            </Guarded>
            {/* <PersonnelSideMenu state={state} onMenuChange={onMenuChange} countAll={_.get(raw, 'count', 0)} /> */}
          </Spin>
        }
      >
        <CustomTable
          columns={columns}
          dataSource={dataSourceUserListApi}
          rowKey="id"
          size="middle"
          onChange={(_, __, ___, action) => {
            tableDataSource.setExportDataSource(action.currentDataSource);
          }}
        // onRow={(record, _) => {
        //   return {
        //     onClick: () => navigate(`../${record._id}/edit`),
        //   };
        // }}
        />
      </LabsContent>
    </>
  );
};

export default observer(Personnel);
