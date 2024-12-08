import {
  AlarmMonitioringBrandIcon,
  IncidentManagementBrandIcon,
  LostFoundManagementBrandIcon,
  OneCommandBrandIcon,
  PersonnelManagementBrandIcon,
  SystemAdminBrandIcon,
} from 'assets/svg';

import { INCIDENT_REPORT_PREFIX_PATH } from 'configs/AppConfig';

export const AppMenuList = [
  {
    key: 'Incident Management',
    name: 'Incident Management',
    description: 'จัดการ รายงาน คำร้อง และการนัดหมาย',
    icon_path: <IncidentManagementBrandIcon />,
    direct_url: INCIDENT_REPORT_PREFIX_PATH,
  },
  {
    key: 'One Command',
    name: 'One Command',
    description: 'ศูนย์บัญชาการกลาง',
    icon_path: <OneCommandBrandIcon />,
    direct_url: '/app/one-command',
  },
  {
    key: 'Personnel',
    name: 'Personnel',
    description: 'จัดการข้อมูลบุคคลากรหรือกำลังพล',
    icon_path: <PersonnelManagementBrandIcon />,
    direct_url: '/app/personnel',
  },
  {
    key: 'Lost & Found Management',
    name: 'Lost & Found Management',
    description: 'จัดการของหายและของที่พบ',
    icon_path: <LostFoundManagementBrandIcon />,
    direct_url: '/app/lost-found-management',
  },
  {
    key: 'Alarm Monitoring',
    name: 'Alarm Monitoring',
    description: 'ระบบติดตามสถานการณ์ฉุกเฉิน',
    icon_path: <AlarmMonitioringBrandIcon />,
    direct_url: '/app/alarm-monitoring',
  },
  {
    key: 'System Administration',
    name: 'System Administration',
    description: 'ตั้งค่าผู้ดูแลระบบ',
    icon_path: <SystemAdminBrandIcon />,
    direct_url: '/app/setting',
  },
];
