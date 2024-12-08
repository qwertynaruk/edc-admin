import { useEffect, useMemo } from 'react';
import CaseStore from 'mobx/CaseStore';
import { observer } from 'mobx-react';
import PersonnelStore from 'mobx/PersonelStore';
import { ThaiDateTime } from 'utils/ThaiDateTime';
import moment from 'moment';
import TablePointerOnRowClick from 'components/shared-components/TablePointerOnRowClick';
import { useNavigate } from 'react-router-dom';

const DataPersonnel = ({ selectedRow = '', setEnableEditButton = () => {}, setSelectedRow = () => {} }) => {
  const navigate = useNavigate();
  const { personnels, isLoading } = PersonnelStore;

  const { case_type_list = [] } = CaseStore;

  const CASE_TYPE_LIST = [
    { id: 'unassign', name: 'ยังไม่ได้มอบหมาย' },
    { id: 'open', name: 'กำลังดำเนินการ' },
    { id: 'closed', name: 'ปิด' },
    { id: 'rejected', name: 'ยกเลิก' },
  ];

  const caseListData = [
    {
      number: '1',
      rating: 'ดาบตำรวจ',
      name: 'วรรณวิภา',
      surname: 'แสนสุวรรณวงศ์',
      rank: 'ผู้บังคับหมู่(บก.สส.)',
      currentPosition: 'ผู้บังคับหมู่',
      status: 'ใช้งาน',
      dateUpdate: '6 พ.ค 2565 16:00',
    },
    {
      number: '2',
      rating: 'ดาบตำรวจ',
      name: 'วรรณวิภา',
      surname: 'แสนสุวรรณวงศ์',
      rank: 'ผู้บังคับหมู่(บก.สส.)',
      currentPosition: 'ผู้บังคับหมู่',
      status: 'ใช้งาน',
      dateUpdate: '6 พ.ค 2565 16:00',
    },
    {
      number: '3',
      rating: 'ดาบตำรวจ',
      name: 'วรรณวิภา',
      surname: 'แสนสุวรรณวงศ์',
      rank: 'ผู้บังคับหมู่(บก.สส.)',
      currentPosition: 'ผู้บังคับหมู่',
      status: 'ใช้งาน',
      dateUpdate: '6 พ.ค 2565 16:00',
    },
    {
      number: '4',
      rating: 'ดาบตำรวจ',
      name: 'วรรณวิภา',
      surname: 'แสนสุวรรณวงศ์',
      rank: 'ผู้บังคับหมู่(บก.สส.)',
      currentPosition: 'ผู้บังคับหมู่',
      status: 'ใช้งาน',
      dateUpdate: '6 พ.ค 2565 16:00',
    },
    {
      number: '5',
      rating: 'ดาบตำรวจ',
      name: 'วรรณวิภา',
      surname: 'แสนสุวรรณวงศ์',
      rank: 'ผู้บังคับหมู่(บก.สส.)',
      currentPosition: 'ผู้บังคับหมู่',
      status: 'ใช้งาน',
      dateUpdate: '6 พ.ค 2565 16:00',
    },
    {
      number: '6',
      rating: 'ดาบตำรวจ',
      name: 'วรรณวิภา',
      surname: 'แสนสุวรรณวงศ์',
      rank: 'ผู้บังคับหมู่(บก.สส.)',
      currentPosition: 'ผู้บังคับหมู่',
      status: 'ใช้งาน',
      dateUpdate: '6 พ.ค 2565 16:00',
    },
    {
      number: '7',
      rating: 'ดาบตำรวจ',
      name: 'วรรณวิภา',
      surname: 'แสนสุวรรณวงศ์',
      rank: 'ผู้บังคับหมู่(บก.สส.)',
      currentPosition: 'ผู้บังคับหมู่',
      status: 'ใช้งาน',
      dateUpdate: '6 พ.ค 2565 16:00',
    },
    {
      number: '8',
      rating: 'ดาบตำรวจ',
      name: 'วรรณวิภา',
      surname: 'แสนสุวรรณวงศ์',
      rank: 'ผู้บังคับหมู่(บก.สส.)',
      currentPosition: 'ผู้บังคับหมู่',
      status: 'ใช้งาน',
      dateUpdate: '6 พ.ค 2565 16:00',
    },
    {
      number: '9',
      rating: 'ดาบตำรวจ',
      name: 'วรรณวิภา',
      surname: 'แสนสุวรรณวงศ์',
      rank: 'ผู้บังคับหมู่(บก.สส.)',
      currentPosition: 'ผู้บังคับหมู่',
      status: 'ใช้งาน',
      dateUpdate: '6 พ.ค 2565 16:00',
    },
    {
      number: '10',
      rating: 'ดาบตำรวจ',
      name: 'วรรณวิภา',
      surname: 'แสนสุวรรณวงศ์',
      rank: 'ผู้บังคับหมู่(บก.สส.)',
      currentPosition: 'ผู้บังคับหมู่',
      status: 'ใช้งาน',
      dateUpdate: '6 พ.ค 2565 16:00',
    },
    {
      number: '11',
      rating: 'ดาบตำรวจ',
      name: 'วรรณวิภา',
      surname: 'แสนสุวรรณวงศ์',
      rank: 'ผู้บังคับหมู่(บก.สส.)',
      currentPosition: 'ผู้บังคับหมู่',
      status: 'ใช้งาน',
      dateUpdate: '6 พ.ค 2565 16:00',
    },
  ];

  const columns = [
    {
      title: 'ลำดับ',
      dataIndex: 'index',
      sorter: (a = {}, b = {}) => a.index > b.index,
    },
    {
      title: 'ยศ',
      dataIndex: 'dominate',
      sorter: (a = {}, b = {}) => a?.dominate > b?.dominate,
    },

    {
      title: 'ชื่อ',
      dataIndex: 'first_name',
      sorter: (a = {}, b = {}) => a?.first_name > b?.first_name,
    },

    {
      title: 'นามสกุล',
      dataIndex: 'last_name',
      sorter: (a = {}, b = {}) => a?.last_name > b?.last_name,
    },
    {
      title: 'ตำแหน่ง/สังกัด',
      dataIndex: 'unit_position',
      sorter: (a = {}, b = {}) => a?.unit_position > b?.unit_position,
    },
    {
      title: 'ดำรงตำแหน่งปัจจุบัน',
      dataIndex: 'present_positon',
      sorter: (a = {}, b = {}) => a?.present_positon > b?.present_positon,
    },

    {
      title: 'สถานะ',
      dataIndex: 'is_active',
      sorter: (a = {}, b = {}) => a?.is_active > b?.is_active,
      render: (_, record) => (record.is_active ? (record.is_active ? 'ใช้งาน' : 'ไม่ได้ใช้งาน') : 'ไม่ทราบ'),
    },

    {
      title: 'วันที่อัปเดตข้อมูล',
      dataIndex: 'updated_at',
      sorter: (a = {}, b = {}) => a?.updated_at > b?.updated_at,
      render: (_, record) =>
        record.updated_at ? ThaiDateTime(moment.utc(record.updated_at), 'short-month-full') : 'ไม่ได้ใช้งาน',
    },
  ];

  // const handleSortFilter = (e) => {
  //   if (e.current * e.pageSize >= case_list.length && next_page_token) {
  //     onTableChange({ page: next_page_token });
  //   }
  // };

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRow(selectedRowKeys);
    setEnableEditButton(selectedRowKeys.length > 0);
  };

  const rowSelection = {
    selectedRowKeys: selectedRow,
    onChange: onSelectChange,
  };

  const personnelsForTable = useMemo(() => {
    return (personnels ?? []).map((personnel, index) => {
      return {
        ...personnel,
        index: index + 1,
        key: personnel._id,
      };
    });
  }, [personnels]);

  useEffect(() => {
    PersonnelStore.Get();
  }, []);

  return (
    <>
      <TablePointerOnRowClick
        loading={isLoading}
        columns={columns}
        dataSource={personnelsForTable}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              navigate(`${record._id}/edit`);
            },
          };
        }}
        pagination={false}
        size="middle"
      />
    </>
  );
};

export default observer(DataPersonnel);
