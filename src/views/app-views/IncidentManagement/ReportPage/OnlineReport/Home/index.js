/* eslint-disable prettier/prettier */
import { Button, Card, Dropdown, Menu, Space, Tooltip, Typography } from 'antd';
import { DeleteOutlined, FileProtectOutlined, FilterFilled } from '@ant-design/icons';
import ReportStore, { CASE_STATUS } from 'mobx/ReportStore';
import { useEffect, useMemo, useState } from 'react';

import A2O from 'utils/A2O';
import CloudConstant from 'constants/CloudConstant';
import CustomTable from 'components/shared-components/CustomTable';
import ExportButton from 'components/shared-components/ExportButton';
import Guarded from 'components/shared-components/Guarded';
import LabsContent from 'components/layout-components/LabsContent';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import SOS_STATUS_CALL from 'constants/StatusSOS';
import SearchMultiverse from 'components/shared-components/SearchMultiverse';
import UpdateStatus from '../Modal/UpdateStatus';
import _ from 'lodash';
import { columnDateRender } from 'components/shared-components/CustomTable/useTableColumnRender';
import moment from 'moment';
// import { iso8601Sorter } from 'utils/tableSorter';
import { observer } from 'mobx-react';
import useColumnFilter from 'components/shared-components/CustomTable/useColumnFilter';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const { Title } = Typography;
const { SubMenu } = Menu;

const OnlineReport = () => {
  const navigate = useNavigate();
  const { columnSearch, columnFilter } = useColumnFilter();
  // const [form] = Form.useForm();

  const { reportList, typesAll = [] } = ReportStore;

  const [dataSource, setDataSource] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [filterData, setFilterData] = useState(null);
  const [currentData, setCurrentData] = useState(null);
  const [reportTypeList, setReportTypeList] = useState([]);
  const [reportDevice, setreportDevice] = useState([]);
  const [itemSelect, setItemSelect] = useState([]);

  useEffect(() => {
    setTableLoading(true);
    fetchDataList();
  }, []);

  const fetchDataList = () => {
    ReportStore.getReportList('รายงานแจ้งเหตุออนไลน์').finally(() => setTableLoading(false));
  };

  useEffect(() => {
    if (reportList.length > 0) {
      const reportTypeTmp = [];
      const reportDeviceTmp = [];
      const tx = reportList.map((ss, _key) => {
        const reportType = ss?.report_detail?.type_name?.trim();
        const reportDevice = ss?.report_channel?.trim();
        if (reportType) {
          const checkDup = reportTypeTmp.some((rowData) => rowData.value === reportType);
          if (!checkDup) {
            reportTypeTmp.push({
              text: reportType,
              value: reportType,
            });
          }
        }
        if (reportDevice) {
          const checkDup = reportDeviceTmp.some((rowData) => rowData.value === reportDevice);
          if (!checkDup) {
            reportDeviceTmp.push({
              text: reportDevice,
              value: reportDevice,
            });
          }
        }
        return {
          _id: ss._id,
          key: _key + 1,
          report_record_id: _.get(ss, 'report_record_id', '')?.toUpperCase(),
          reporter: _.get(ss, 'reporter.name_th', 'ไม่ระบุตัวตน'),
          report_type: _.get(ss, 'report_detail.type_name', '-'),
          report_group: _.get(ss, 'report_detail.group_type_name', '-'),
          report_device: _.get(ss, 'report_channel', '-'),
          status: _.get(ss, 'status', ''),
          created_at: columnDateRender(ss.created_at, 'short-month-full'),
        };
      });

      setRawData(tx);
      setDataSource(tx);
      setReportTypeList(reportTypeTmp);
      setreportDevice(reportDeviceTmp);
    } else {
      setRawData([]);
      setDataSource([]);
      setReportTypeList([]);
      setreportDevice([]);
    }
  }, [reportList]);

  const actionStatus = (key = null, record = null) => {
    if (key && record) {
      if (key === 'view') {
        navigate(`detail/${record._id}`);
        setCurrentData(null);
      } else {
        setVisible(true);
        setCurrentData(record);
      }
    }
  };

  const menuActionItemList = (record) => {
    return record.status === CloudConstant.WEBFORM_REQUEST_STATUS[2].value
      ? []
      : [
        { key: 'view', label: 'ดูข้อมูล', uq: uuidv4() },
        { key: 'update', label: 'อัพเดทสถานะ', uq: uuidv4() },
      ];
  };

  // const menuActionItem = (record) => {
  //   // return CloudConstant.WEBFORM_REQUEST_STATUS.filter(
  //   //   (rd) => rd.value !== record.status && rd.value !== CloudConstant.WEBFORM_REQUEST_STATUS[0].value
  //   // ).map((rd) => ({ ...rd, key: rd.value }));
  //   return [
  //     { key: 'view', label: 'ดูข้อมูล' },
  //     { key: 'update', label: 'อัพเดทสถานะ' },
  //   ];
  // };

  const columns = [
    {
      title: 'หมายเลขการแจ้งเหตุ',
      dataIndex: 'report_record_id',
      width: '30%',
      ...columnSearch('report_record_id', {
        placeholder: 'ค้นหาหมายเลขการแจ้งเหตุ',
      }),
      render: (_, record) => {
        return (
          <a style={{ color: '#FF0000' }} onClick={() => navigate(`detail/${record._id}`)}>
            {record.report_record_id}
          </a>
        );
      },
    },
    {
      title: 'ชื่อผู้แจ้ง',
      dataIndex: 'reporter',
      width: '20%',
      ...columnSearch('reporter', {
        placeholder: 'ค้นหาชื่อผู้แจ้ง',
      }),
    },
    {
      title: 'กลุ่มการแจ้งเหตุ',
      dataIndex: 'report_group',
      width: '15%',
      filterIcon: (filtered) => <FilterFilled style={{ color: filtered ? '#FF0000' : '' }} />,
      ...columnFilter('report_group', {
        filters: CloudConstant.GROUP_TYPE_LIST.map((ez) => ({ label: ez.name, value: ez.name })),
      }),
    },
    {
      title: 'ประเภทการแจ้งเหตุ',
      dataIndex: 'report_type',
      width: '15%',
      filters: reportTypeList,
      filterIcon: (filtered) => <FilterFilled style={{ color: filtered ? '#FF0000' : '' }} />,
      onFilter: (value, record) => {
        return record.report_type.includes(value);
      },
      // ...columnFilter('report_type', {
      //   // filters: CloudConstant.WEBFORM_ONLINE_TYPE.map((ez) => ({ label: ez.name, value: ez.name })),
      //   filters: reportTypeList,
      // }),
    },
    {
      title: 'วันที่แจ้ง',
      dataIndex: 'created_at',
      width: '20%',
      // sorter: (a, b) => iso8601Sorter(a.created_at > b.created_at),
      sorter: (a, b) =>
        moment(moment(a.created_at, 'DD MMM YYYY HH:mm:ss')).diff(moment(b.created_at, 'DD MMM YYYY HH:mm:ss')),
    },
    {
      title: 'ช่องทางการแจ้งเหตุ',
      dataIndex: 'report_device',
      width: '15%',
      filters: reportDevice,
      filterIcon: (filtered) => <FilterFilled style={{ color: filtered ? '#FF0000' : '' }} />,
      onFilter: (value, record) => {
        return record.report_device.includes(value);
      },
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      width: '8%',
      filterIcon: (filtered) => <FilterFilled style={{ color: filtered ? '#FF0000' : '' }} />,
      render: (el) => {
        const findStatus = SOS_STATUS_CALL.find((rd) => rd.label === el);
        return <span style={{ color: findStatus?.labelColor || undefined }}>{el || 'แบบร่าง'}</span>;
      },
      ...columnFilter('status', {
        filters: CloudConstant.WEBFORM_REQUEST_STATUS,
      }),
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => {
        return (
          record.status !== CloudConstant.WEBFORM_REQUEST_STATUS[2].value &&
          record.status !== CloudConstant.WEBFORM_REQUEST_STATUS[3].value &&
          record.status !== CloudConstant.WEBFORM_REQUEST_STATUS[4].value && (
            <Guarded
              query={{
                group: 'One Command',
                action: 'update',
                type: 'Mass Notification',
              }}
            >
              {(menuActionItemList || []).length > 0 && (
                <Dropdown
                  overlay={<Menu items={menuActionItemList(record)} onClick={({ key }) => actionStatus(key, record)} />}
                  placement="bottomRight"
                  trigger={['click']}
                >
                  <i className="gx-icon-btn icon icon-ellipse-v" />
                </Dropdown>
              )}
            </Guarded>
          )
        );
      },
    },
  ];

  const getFilterList = useMemo(() => {
    const tmpresult = [];
    dataSource.forEach((rowData) => {
      const findIndexData = tmpresult.findIndex((rd) => rd.status === rowData.status);
      if (findIndexData >= 0) {
        tmpresult[findIndexData].qty++;
      } else {
        tmpresult.push({ id: rowData._id, status: rowData.status, qty: 1 });
      }
    });
    return tmpresult;
  }, [dataSource]);

  const dataSourceList = useMemo(() => {
    return filterData ? dataSource.filter((rd) => rd.status === filterData) : dataSource;
  }, [filterData, dataSource]);

  const onConfirm = () => {
    fetchDataList();
  };

  const handleBulkDelete = async (itemSelect) => {
    if (itemSelect.length > 0) {
      setTableLoading(true);
      const promises = [];

      // const mergeData = itemSelect.map((rowMerge) => {
      //   return {
      //     status: 'ลบ',
      //   };
      // });
      // console.log('mergeData', mergeData);
      const mergeData = [];

      itemSelect.forEach((rowSelection) => {
        const callApiGet = ReportStore.getReportItems(rowSelection._id).then((result) => {
          mergeData.push({
            status: 'ลบ',
            report_id: rowSelection._id,
            report_type_id: result.report_type_id,
          });
          // .finally(() => setTableLoading(false));
          // promises.push(callApi);
        });
        promises.push(callApiGet);
      });
      await Promise.all(promises)
        .then((data) => {
          // console.log('data', data);
        })
        .catch((err) => {
          console.log('err', err);
        })
        .finally(async () => {
          try {
            // รอฟลุ๊คปรับ
            const resp = await ReportStore.serviceReportUpdateMany(mergeData);
            console.log('resp', resp);
          } catch (error) {
            console.log('error', error);
          } finally {
            console.log('finally');
            setItemSelect([]);
            setTableLoading(true);
            fetchDataList();
          }
        });
    }

    // return MassNotificationStore.Update(itemSelect, {
    //   status: CASE_STATUS.DELETED,
    // })
    //   .then(handleSuccess)
    //   .then(() => {
    //     setItemSelect([]);
    //   })
    //   .catch(handleError);
  };

  const onSelectChange = (_, selectedRows) => {
    setItemSelect(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys: itemSelect.map((item) => item._id),
    onChange: onSelectChange,
  };

  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'รายงานแจ้งเหตุออนไลน์' }} />

      <Card>
        <SearchMultiverse mode="auto" nodeData={rawData} onSetNodeData={(el) => setDataSource(el)} />
      </Card>

      <LabsContent
        titleContent={
          <Space>
            <FileProtectOutlined />
            <Title level={5} className="gx-mb-0">
              รายงานแจ้งเหตุออนไลน์
            </Title>
          </Space>
        }
        sideContent={
          <>
            <Menu defaultSelectedKeys={['report-all']} defaultOpenKeys={['report-status-filter']} mode="inline">
              <Menu.Item key="report-all" onClick={() => setFilterData(null)}>
                <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
                  <span>การแจ้งเหตุทั้งหมด</span>
                </Space>
              </Menu.Item>
              {/* <PersonnelSideMenu state={state} onMenuChange={onMenuChange} /> */}
              {/* <PersonnelSideMenu state={state} onMenuChange={onMenuChange} countAll={_.get(raw, 'count', 0)} /> */}
              <SubMenu key="report-status-filter" title="สถานะการแจ้งเหตุ">
                {getFilterList.map((value, index) => (
                  <>
                    <Menu.Item key={index} onClick={() => setFilterData(value.status)}>
                      <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
                        <span>{value.status}</span>
                        <span>{value.qty}</span>
                      </Space>
                    </Menu.Item>
                  </>
                ))}
              </SubMenu>
            </Menu>
          </>
        }
      >
        <div className="gx-module-box-header">
          <Space align="center" style={{ justifyContent: 'space-between' }}>
            <Space>
              {itemSelect.length > 0 &&
                itemSelect.every((item) => [CASE_STATUS.PENDING, CASE_STATUS.CANCEL].includes(item.status)) && (
                  <>
                    <span>({itemSelect.length}) รายการที่ถูกเลือก</span>
                    <Tooltip placement="bottom" title="ลบ">
                      <Button
                        type="primary"
                        className="gx-flex-row gx-align-items-center gx-p-2"
                        onClick={() => handleBulkDelete(itemSelect)}
                      >
                        <DeleteOutlined style={{ fontSize: 15 }} />
                      </Button>
                    </Tooltip>
                  </>
                )}
            </Space>
            <Space align="center">
              <ExportButton
                column={A2O.CONVERT_TBLCOLUMN(columns)}
                dataSource={dataSource}
                fileName="report-online-export"
              />
            </Space>
          </Space>
        </div>

        <div className="gx-module-box-content gx-p-3">
          <CustomTable
            columns={columns}
            dataSource={dataSourceList}
            pagination={{
              pageSize: 10,
            }}
            filterData={filterData}
            size="middle"
            loading={tableLoading}
          // rowSelection={rowSelection}
          />
        </div>
      </LabsContent>
      <UpdateStatus visible={visible} setVisible={setVisible} onConfirm={onConfirm} currentData={currentData} />
    </>
  );
};

export default observer(OnlineReport);
