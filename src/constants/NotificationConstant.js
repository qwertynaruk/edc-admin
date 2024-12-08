import { MAP_ACTION_NAME_TO_ICON } from 'mobx/NotificationStore';

export const NOTIFICATION_TYPE = [
  { index: 0, type: 'mass_notification', text: 'ได้รับข้อความใหม่ :', icon: MAP_ACTION_NAME_TO_ICON.noti_mail() },
  { index: 1, type: 'report_comment', text: 'report_comment', icon: MAP_ACTION_NAME_TO_ICON.noti_mail() },
  { index: 2, type: 'report_incident', text: 'การแจ้งเหตุรายการใหม่ :', icon: MAP_ACTION_NAME_TO_ICON.noti_warning() },
  {
    index: 3,
    type: 'report_incident_transfer',
    text: 'การแจ้งเหตุรายการใหม่ (โอนงาน) :',
    icon: MAP_ACTION_NAME_TO_ICON.noti_warning(),
  },
  { index: 4, type: 'update_report_status', text: 'Update Status', icon: MAP_ACTION_NAME_TO_ICON.noti_info_circle() },
  { index: 5, type: 'report_sos', text: 'ขอความช่วยเหลือ SOS', icon: MAP_ACTION_NAME_TO_ICON.noti_callsos() },
  { index: 6, type: 'report_sos_invite', text: 'ขอความช่วยเหลือ SOS', icon: MAP_ACTION_NAME_TO_ICON.noti_callsos() },
  { index: 7, type: 'report_sos_assignee', text: 'ขอความช่วยเหลือ SOS', icon: MAP_ACTION_NAME_TO_ICON.noti_callsos() },
  {
    index: 8,
    type: 'alarm_monitoring_scm',
    text: 'แจ้งเตือนสถานการณ์ฉุกเฉิน :',
    icon: MAP_ACTION_NAME_TO_ICON.noti_alarm(),
  },
  {
    index: 9,
    type: 'alarm_monitoring_emergency',
    text: 'แจ้งเตือนสถานการณ์ฉุกเฉิน :',
    icon: MAP_ACTION_NAME_TO_ICON.noti_alarm(),
  },
];

export const COLOR_NOTIFICATION_HIGHLIGHT = 'rgba(255, 55, 68, 1)';
