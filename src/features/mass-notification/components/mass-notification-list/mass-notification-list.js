import 'dayjs/locale/th';

import { Dropdown, Menu, Space, Typography } from 'antd';
import { omit, values } from 'lodash';

import DialogNotification from 'components/shared-components/DialogNotification';
import DialogPopup from 'components/shared-components/DialogPopup';
import { GuardHandlesV2 } from 'components/shared-components/Guarded';
import { MoreOutlined } from '@ant-design/icons';
import { PublishScheduleModal } from '../publish-schedule-modal';
import TableHeros from 'components/shared-components/TableHeros';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useUpdateMassNotification } from 'features/mass-notification/hooks/use-update-mass-notification';

dayjs.locale('th');

const DATE_FORMAT = 'DD MMM YYYY HH:mm';
const DROPDOWN_MENU = [
  {
    label: 'กำหนดเวลาอีกครั้ง',
    key: 'tryschedule',
    access: ['wait_for_send', 'update'],
    disabled: false,
  },
  {
    label: 'แก้ไข',
    key: 'edit',
    access: ['draft', 'update'],
    disabled: false,
  },
  {
    label: 'ลบ',
    key: 'delete',
    access: ['draft', 'delete'],
    disabled: false,
  },
  {
    label: 'ยกเลิก',
    key: 'cancel',
    access: ['wait_for_send', 'update'],
    disabled: false,
  },
  {
    label: 'เผยแพร่',
    key: 'publish',
    access: ['draft', 'wait_for_send', 'update'],
    disabled: false,
  },
  {
    label: 'กำหนดเวลาเผยแพร่',
    key: 'schedule',
    access: ['draft', 'update'],
    disabled: false,
  },
  {
    label: 'ทำรายการอีกครั้ง',
    key: 'reschedule',
    access: ['send_not_success', 'update'],
    disabled: false,
  },
];

export const MassNotificationList = ({ data = undefined, isLoading = false }) => {
  const navigate = useNavigate();
  const { canUpdate, canDelete } = GuardHandlesV2({ group: 'One Command', type: 'Mass Notification' });
  const [open, setOpen] = useState(false);
  const [pickItems, setPickItems] = useState(undefined);
  const [msgTitle, setMsgTitle] = useState('แก้ไขสถานะ');
  const { mutate } = useUpdateMassNotification({
    onSuccess: () => {
      DialogNotification('success', `${msgTitle}รายการสำเร็จ`);
    },
    onError: () => {
      DialogNotification('error', `ไม่สามารถ${msgTitle}รายการนี้ได้`);
    },
  });

  const onMenuClick = (items, itemsId) => {
    const keys = items.key;

    switch (keys) {
      case 'tryschedule':
        setOpen(true);
        break;

      case 'edit':
        navigate(`/app/one-command/mass-notification/citizen/${itemsId}`);
        break;

      case 'delete':
        setMsgTitle('ลบ');
        DialogPopup.confirm({
          title: 'ยืนยันการลบรายการ',
          text: 'ท่านต้องการลบรายการนี้ใช่หรือไม่',
          confirmAction: () => {
            mutate({
              payload: {
                status: 'delete',
              },
              params: {
                id: itemsId,
              },
            });
          },
        });
        break;

      case 'cancel':
        setMsgTitle('ยกเลิก');
        DialogPopup.confirm({
          title: 'ยืนยันการยกเลิก',
          text: 'ท่านต้องการยกเลิกใช่หรือไม่',
          confirmAction: () => {
            mutate({
              payload: {
                status: 'cancel',
              },
              params: {
                id: itemsId,
              },
            });
          },
        });
        break;

      case 'publish':
        setMsgTitle('เผยแพร่');
        DialogPopup.confirm({
          title: 'ยืนยันการเผยแพร่',
          text: 'ข้อความนี้จะถูกแจ้งเตือนไปยังประชาชนในบริเวณพื้นที่ที่กำหนดทันที ท่านยืนยันการเผยแพร่หรือไม่?',
          confirmAction: () => {
            mutate({
              payload: {
                status: 'publish',
              },
              params: {
                id: itemsId,
              },
            });
          },
        });
        break;

      case 'schedule':
        setOpen(true);
        break;

      case 'reschedule':
        navigate(`/app/one-command/mass-notification/citizen/${itemsId}`);
        break;

      default:
        break;
    }
  };

  const dropdownMenu = (element) => {
    const statusName = element?.status;
    const menuItems = DROPDOWN_MENU.filter((ss) => ss.access.includes(statusName))
      .map((ss) => ({
        ...ss,
        disabled: ss.key === 'edit' ? !element?.is_edit : false,
      }))
      .filter((ss) => {
        if (canUpdate && canDelete) {
          return ss;
        }

        return ss.access.includes(canUpdate ? 'update' : canDelete ? 'delete' : '');
      });

    return (
      <Menu
        style={{
          width: 200,
        }}
        items={menuItems}
        onClick={(items) => {
          setPickItems(element);
          onMenuClick(items, element.id);
        }}
      />
    );
  };

  const mapStatus = (status = '') => {
    const statusName = status.toLowerCase();
    switch (statusName) {
      case 'publish':
        return 'เผยแพร่';

      case 'delete':
        return 'ลบ';

      case 'wait_for_send':
        return 'รอส่ง';

      case 'send_success':
        return 'ส่งแล้ว';

      case 'send_not_success':
        return 'ส่งไม่สำเร็จ';

      default:
        return 'ฉบับร่าง';
    }
  };

  const columns = [
    {
      title: (
        <Space direction="vertical">
          <span>ประเภท</span>
          <span>รายละเอียด</span>
        </Space>
      ),
      key: 'type',
      ellipsis: true,
      width: 400,
      render: (massNotification) => {
        const categories = massNotification?.notification_category?.name_th || '-';
        const messages = massNotification?.detail_message || '-';
        return (
          <Space direction="vertical" size={5}>
            <Typography>
              <strong>{categories}</strong>
            </Typography>
            <Typography.Text
              style={{
                textWrap: 'wrap',
                lineHeight: 1.5,
                opacity: 0.8,
              }}
            >
              {messages}
            </Typography.Text>
          </Space>
        );
      },
    },
    {
      title: (
        <Space direction="vertical">
          <span>ประเภทขอบเขต</span>
          <span>พื้นที่ขอบเขต</span>
        </Space>
      ),
      key: 'scope',
      ellipsis: true,
      width: 200,
      render: (massNotification) => {
        const areaType = massNotification?.location_area ? 'รัศมี' : 'พื้นที่';
        const areaCitiesName = () => {
          try {
            return massNotification?.location_area
              ? 'จ. อ่างทอง'
              : massNotification?.polygon_area?.amphures?.map((ss) => ss.ADM2_TH).join(', ');
          } catch (error) {
            return '';
          }
        };

        return (
          <Space direction="vertical" size={5}>
            <Typography>{areaType}</Typography>
            <Typography
              style={{
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              {areaCitiesName()}
            </Typography>
          </Space>
        );
      },
    },
    {
      title: 'สถานะ',
      key: 'status',
      ellipsis: true,
      width: 100,
      render: (massNotification) => {
        const recipients = massNotification?.recipient ? `จำนวนผู้รับ ${massNotification?.recipient} คน` : '';

        return (
          <Space direction="vertical" size={5}>
            <Typography>{mapStatus(massNotification.status)}</Typography>
            <Typography>{recipients}</Typography>
          </Space>
        );
      },
    },
    {
      title: (
        <Space direction="vertical">
          <span>วันที่อัปเดต</span>
          <span>วันที่สร้าง</span>
        </Space>
      ),
      key: 'date',
      width: 180,
      render: (massNotification) => {
        const updateAt = dayjs(massNotification.updated_at).format(DATE_FORMAT);
        const createAt = dayjs(massNotification.created_at).format(DATE_FORMAT);

        return (
          <Space direction="vertical" size={5}>
            <span>{updateAt}</span>
            <span>{createAt}</span>
          </Space>
        );
      },
    },
    {
      title: (
        <Space direction="vertical">
          <span>หน่วยงาน</span>
          <span>คนที่สร้าง</span>
        </Space>
      ),
      key: 'creator',
      ellipsis: true,
      width: 180,
      render: (massNotification) => {
        const orgs = massNotification.organization_info?.full_name_th || '-';
        const personnels = massNotification.personnel_info;
        if (personnels) {
          const ps = omit(personnels, [
            'first_name_en',
            'id',
            '_id',
            'last_name_en',
            'prefix_name_en',
            'prefix_name_th',
          ]);
          const pss = values(ps).join(' ');
          return (
            <Space direction="vertical" size={5}>
              <Typography>{orgs}</Typography>
              <Typography>{pss}</Typography>
            </Space>
          );
        } else {
          return <Typography>{orgs}</Typography>;
        }
      },
    },
    {
      key: 'action',
      width: 50,
      align: 'center',
      fixed: 'right',
      render: (massNotification) => {
        if (!massNotification?.status || ['send_success', 'publish', 'delete'].includes(massNotification?.status)) {
          return null;
        }

        if (!canDelete && !canUpdate) {
          return null;
        }

        return (
          <Dropdown overlay={dropdownMenu(massNotification)} trigger={['click']}>
            <MoreOutlined />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <>
      <TableHeros tableLayout="fixed" columns={columns} dataSource={data?.filter((ss) => ss)} loading={isLoading} />
      <PublishScheduleModal open={open} items={pickItems} setOpen={setOpen} />
    </>
  );
};
