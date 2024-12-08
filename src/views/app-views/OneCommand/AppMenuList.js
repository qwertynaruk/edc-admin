import EnvRoute from 'utils/EnvRoute';
import IconCustom from '@ant-design/icons';
import { ReactComponent as OneCMS } from 'assets/images/cms.svg';
import { ReactComponent as OneCrimeIntelligence } from 'assets/images/one-crime-intelligence.svg';
import { ReactComponent as OneMassNotification } from 'assets/images/one-mass-notification.svg';
import { ReactComponent as OneSOS } from 'assets/images/one-sos.svg';
import { getDevModeAndOrgPath } from 'utils/UserHelper';

const { devLocalMode } = getDevModeAndOrgPath();

export const AppMenuListOneCommand = [
  // {
  //   key: 'gis',
  //   name: 'GIS',
  //   description: 'ระบบสารสนเทศภูมิศาสตร์',
  //   icon_path: <IconCustom component={OneGis} style={{ fontSize: 60 }} />,
  //   url_type: 'internal',
  //   direct_url: 'gis',
  //   query: {
  //     group: 'One Command',
  //     type: 'GIS Dashboard',
  //   },
  // },
  // {
  //   key: 'cctv',
  //   name: 'CCTV',
  //   description: 'ระบบกล้องวงจรปิด',
  //   icon_path: <IconCustom component={OneCCTVIcon} style={{ fontSize: 60 }} />,
  //   url_type: 'external',
  //   direct_url: 'https://cctv.udoncop.com:8082/',
  //   query: {
  //     group: 'One Command',
  //     type: 'CCTV',
  //   },
  // },
  {
    key: 'checkpoint-kiosk',
    name: 'SOS',
    description: 'ระบบตู้แจ้งเหตุฉุกเฉิน',
    icon_path: <IconCustom component={OneSOS} style={{ fontSize: 60 }} />,
    url_type: 'external',
    direct_url: devLocalMode ? EnvRoute.ROOT_SOS_LINK_LOCAL : EnvRoute.ROOT_SOS_LINK,
    // isDisable: UserStore?.isGlobal || UserStore?.organization?.is_center !== 'T',
    query: {
      group: 'One Command',
      // type: 'ตู้จุดตรวจ',
      type: 'SOS',
    },
  },
  // {
  //   key: 'social-enable',
  //   name: 'Social Listening',
  //   description: 'ระบบรวบรวมเบาะแสจากช่องทางสื่อสังคมออนไลน์',
  //   icon_path: <IconCustom component={OneSocialEnable} style={{ fontSize: 60 }} />,
  //   url_type: 'external',
  //   direct_url: '',
  //   query: {
  //     group: 'One Command',
  //     type: 'Social Enable',
  //   },
  // },
  {
    key: 'mass-notification',
    name: 'Mass Notification',
    description: 'ระบบกระจายข้อมูลเตือนภัย',
    icon_path: <IconCustom component={OneMassNotification} style={{ fontSize: 60 }} />,
    url_type: 'internal',
    direct_url: 'mass-notification',
    query: {
      group: 'One Command',
      type: 'Mass Notification',
    },
  },
  {
    key: 'crime-intelligence',
    name: 'Crime Intelligence System',
    description: 'ระบบจัดการอาชญากรรมอัจฉริยะ',
    icon_path: <IconCustom component={OneCrimeIntelligence} style={{ fontSize: 60 }} />,
    url_type: 'internal',
    direct_url: 'crime-intelligence',
    query: {
      group: 'One Command',
      type: 'Crime Intelligence',
    },
  },
  {
    key: 'content-management-system',
    name: 'Content Management System',
    description: 'ระบบการจัดการเนื้อหาข่าวสาร',
    icon_path: <IconCustom component={OneCMS} style={{ fontSize: 60 }} />,
    url_type: 'internal',
    direct_url: 'cms',
    query: {
      group: 'One Command',
      type: 'Content Management System',
    },
  },
];
