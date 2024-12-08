import {
  AimOutlined,
  ApartmentOutlined,
  AuditOutlined,
  ClusterOutlined,
  ContainerOutlined,
  DownloadOutlined,
  FileProtectOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  IdcardOutlined,
  ReconciliationOutlined,
  SettingOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import { ClaimMenuIcon, LostFoundMenuIcon, LostItemMenuIcon, RefundMenuIcon } from 'assets/svg';

import { EVIDENT_PREFIX_PATH } from 'configs/AppConfig';

const RouteList = {
  'case-management': [
    {
      name: 'เคส',
      icon: <IdcardOutlined />,
      path: '/app/case-management/list',
      query: {
        group: 'case',
        type: 'เคส',
      },
    },
    {
      name: 'ติดตามภาระงาน',
      icon: <FileTextOutlined />,
      path: '/app/case-management/follow-up',
      query: {
        group: 'case',
        type: 'ติดตามภาระ',
      },
    },
    {
      name: 'หมายจับ',
      icon: <SolutionOutlined />,
      path: '/app/case-management/warrant-arrest',
      query: {
        group: 'case',
        type: 'หมายจับ',
      },
    },
    {
      name: 'ตั้งค่า',
      icon: <SettingOutlined />,
      path: '/app/case-management',
      query: {
        group: 'case',
        type: 'ประเภทเคส',
      },
      children: [
        {
          name: 'ประเภทเคส',
          icon: <ContainerOutlined />,
          path: '/setting-case',
          query: {
            group: 'case',
            type: 'ประเภทเคส',
          },
        },
        {
          name: 'ขั้นตอนการทำงาน',
          icon: <ClusterOutlined />,
          path: '/setting-workflow',
          query: {
            group: 'case',
            type: 'ประเภทเคส',
          },
        },
      ],
    },
  ],
  'incident-management': [
    // {
    //   name: 'เรียกคิว',
    //   icon: <TeamOutlined />,
    //   path: `/app/incident-management/queue-access`,
    //   query: {
    //     group: 'queue_management',
    //     type: 'คิว',
    //   },
    // },
    {
      name: 'รายงาน',
      icon: <ReconciliationOutlined style={{ marginRight: 0 }} />,
      path: `/app/incident-management/report`,
      query: {
        group: 'Incident Management',
      },
      children: [
        // {
        //   name: 'รายงานประจำวัน',
        //   icon: <FileDoneOutlined />,
        //   path: '/daily',
        //   query: {
        //     group: 'Incident Management',
        //     type: 'รายงานประจำวัน',
        //   },
        // },
        // {
        //   name: 'รายงานภายในองค์กร',
        //   icon: <AuditOutlined />,
        //   path: '/internal',
        //   query: {
        //     group: 'Incident Management',
        //     type: 'รายงานภายในองค์กร',
        //   },
        // },
        {
          name: 'รายงานแจ้งเหตุออนไลน์',
          icon: <FileProtectOutlined />,
          path: '/online',
          query: {
            group: 'Incident Management',
            type: 'รายงานการแจ้งเหตุออนไลน์',
          },
        },
        // {
        //   name: 'รายงานจากเว็บฟอร์ม',
        //   icon: <ExceptionOutlined />,
        //   path: '/webform',
        //   query: {
        //     group: 'Incident Management',
        //     type: 'รายงานจากเว็บฟอร์ม',
        //   },
        // },
        // {
        //   name: 'รายงานการปฏิบัติหน้าที่',
        //   icon: <SolutionOutlined />,
        //   path: '/onduty',
        //   query: {
        //     group: 'Incident Management',
        //     type: 'รายงานการปฏิบัติหน้าที่',
        //   },
        // },
        // {
        //   name: 'รายงานรับแจ้งเหตุ 191',
        //   icon: <FileProtectOutlined />,
        //   path: '/191',
        //   query: {
        //     group: 'Incident Management',
        //     type: 'รายงานรับแจ้งเหตุ 191',
        //   },
        // },
      ],
    },
    // {
    //   name: 'ประเภทรายงาน',
    //   icon: <GroupOutlined />,
    //   path: '/app/incident-management/setting/genre',
    //   query: {
    //     group: 'Incident Management',
    //     type: 'ประเภทรายงาน',
    //   },
    // },
    // {
    //   name: 'ตั้งค่าเว็บฟอร์ม',
    //   icon: <SettingOutlined />,
    //   path: '/app/incident-management/setting/webform',
    //   query: {
    //     group: 'Incident Management',
    //     type: 'เว็บฟอร์ม',
    //   },
    // },
    // {
    //   name: 'รหัส ความผิด/เหตุการณ์',
    //   icon: <LockOutlined />,
    //   path: '/app/incident-management/setting/identities-code',
    //   query: {
    //     group: 'Incident Management',
    //     type: 'รหัสความผิด',
    //   },
    // },
    // {
    //   name: "นำเข้าข้อมูล",
    //   icon: <DownloadOutlined />,
    //   path: `/app/incident-management/import-report`,
    //   query: {
    //     group: "incident_management",
    //   },
    // },
  ],
  'master-indices': [
    {
      name: 'สืบค้นข้อมูล',
      icon: <FileSearchOutlined />,
      path: '/app/master-indices',
      query: {
        group: 'master_indices',
      },
    },
    {
      name: 'นำเข้าข้อมูล',
      icon: <DownloadOutlined />,
      path: '/app/master-indices/import',
      query: {
        group: 'master_indices',
      },
    },
  ],
  assets: [
    {
      name: 'การจัดการทรัพยากร',
      icon: <AuditOutlined />,
      path: '/app/assets/list',
      query: {
        group: 'asset',
        type: 'ทรัพยากร',
      },
    },
    {
      name: 'นำเข้าข้อมูล',
      icon: <DownloadOutlined />,
      path: '/app/assets/import-report-asset',
      query: {
        group: 'asset',
        name: 'แก้ไขข้อมูลทรัพยากร',
        type: 'ทรัพยากร',
      },
    },
  ],
  personnel: [
    {
      name: 'กำลังพล',
      icon: <IdcardOutlined />,
      path: '/app/personnel',
      query: {
        group: 'Personnel',
        type: 'กำลังพล',
      },
    },
    // {
    //   name: 'ตารางปฏิบัติหน้าที่',
    //   icon: <CalendarOutlined />,
    //   path: '/app/personnel/schedule',
    //   query: {
    //     group: 'Personnel',
    //     type: 'ตารางปฏิบัติหน้าที่',
    //   },
    // },
    // {
    //   name: 'ชุดปฏิบัติการ',
    //   icon: <TeamOutlined />,
    //   path: '/app/personnel/team',
    //   query: {
    //     group: 'Personnel',
    //     type: 'ชุดปฏิบัติการ',
    //   },
    // },
    // {
    //   name: 'แผนผังภายในองค์กร',
    //   icon: <ApartmentOutlined />,
    //   path: '/app/personnel/organize-chart',
    //   query: {
    //     group: 'Personnel',
    //     type: 'กำลังพล',
    //   },
    // },
    // {
    //   name: 'นำเข้าข้อมูล',
    //   icon: <DownloadOutlined />,
    //   path: '/app/personnel/import-report-force',
    //   query: {
    //     group: 'Personnel',
    //     type: 'กำลังพล',
    //     name: 'แก้ไขข้อมูลกำลังพล',
    //   },
    // },
    {
      name: 'ตั้งค่า',
      icon: <SettingOutlined />,
      path: '/app/personnel/setting',
      query: {
        group: 'Personnel',
        type: ['ตำแหน่ง', 'ฝ่ายงาน'],
      },
      children: [
        {
          name: 'ตำแหน่ง',
          icon: <ApartmentOutlined />,
          path: '/position',
          query: {
            group: 'Personnel',
            type: 'ตำแหน่ง',
          },
        },
        {
          name: 'ฝ่ายงาน',
          icon: <ClusterOutlined />,
          path: '/department',
          query: {
            group: 'Personnel',
            type: 'ฝ่ายงาน',
          },
        },
        // {
        //   name: 'องค์กร',
        //   icon: <BankOutlined />,
        //   path: '/organization',
        //   query: {
        //     group: 'Personnel',
        //     type: 'กำลังพล',
        //   },
        // },
      ],
    },
  ],
  'property-evidence-management': [
    {
      name: 'รายการยึดทรัพย์',
      icon: <AuditOutlined />,
      path: `${EVIDENT_PREFIX_PATH}/home`,
      query: {
        group: 'property_and_evidence_management',
        ignoreName: 'นำเข้าข้อมูลบัญชีของกลาง',
        type: 'ของกลาง',
      },
    },
    {
      name: 'นำเข้าข้อมูล',
      icon: <DownloadOutlined />,
      path: `${EVIDENT_PREFIX_PATH}/import`,
      query: {
        group: 'property_and_evidence_management',
        name: 'นำเข้าข้อมูลบัญชีของกลาง',
        type: 'ของกลาง',
      },
    },
    {
      name: 'ตั้งค่า',
      icon: <SettingOutlined />,
      path: `${EVIDENT_PREFIX_PATH}/setting`,
      query: {
        group: 'property_and_evidence_management',
        type: 'สถานที่จัดเก็บ',
      },
    },
  ],
  poi: [
    {
      name: 'แดชบอร์ด',
      icon: <IdcardOutlined />,
      path: '/app/poi',
    },
    {
      name: 'พื้นที่รับผิดชอบ',
      icon: <IdcardOutlined />,
      path: '/app/poi/place-mornitor',
    },
    {
      name: 'ผู้รับผิดชอบแต่ละพื้นที่',
      icon: <IdcardOutlined />,
      path: '/app/poi/',
    },
    {
      name: 'ข้อมูลสารสนเทศภูมิศาสตร์',
      icon: <IdcardOutlined />,
      path: '/app/poi/',
    },
  ],
  'patrol-management': [
    {
      name: 'จุดตรวจ',
      icon: <AimOutlined />,
      path: '/app/patrol-management/check-point',
      query: {
        group: 'patrol_management',
        type: 'จุดตรวจ',
      },
    },
    {
      name: 'ผลการตรวจตู้แดง',
      icon: <FileProtectOutlined />,
      path: '/app/patrol-management/red-cabinet',
      query: {
        group: 'patrol_management',
        type: 'ผลการตรวจตู้แดง',
      },
    },
    {
      name: 'ประเภทจุดตรวจ',
      icon: <SettingOutlined />,
      path: '/app/patrol-management/setting-type',
      query: {
        group: 'patrol_management',
        type: 'ประเภทจุดตรวจ',
      },
    },
  ],
  'mass-notification': [
    {
      name: 'Mass Notification',
      icon: <AuditOutlined />,
      path: '/app/one-command/mass-notification',
      query: {
        group: 'mass-notification',
      },
    },
    {
      name: 'ตั้งค่า',
      icon: <SettingOutlined />,
      path: '/app/one-command/mass-notification',
      query: {
        group: 'mass-notification',
      },
      children: [
        {
          name: 'ประเภทการเตือน',
          icon: <ContainerOutlined />,
          path: '/setting',
          query: {
            group: 'mass-notification',
          },
        },
      ],
    },
  ],
  'lost-found-management': [
    {
      name: 'Lost & Found Management',
      icon: <LostFoundMenuIcon />,
      path: '/app/lost-found-management',
    },
    {
      name: 'รายการแจ้งของหาย',
      icon: <LostItemMenuIcon />,
      path: '/app/lost-found-management/lost-report',
    },
    {
      name: 'รายการขอเคลม',
      icon: <ClaimMenuIcon />,
      path: '/app/lost-found-management/claim',
    },
    {
      name: 'รายการคืน',
      icon: <RefundMenuIcon />,
      path: '/app/lost-found-management/refund',
    },
  ],
};

export default RouteList;
