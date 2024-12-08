import { CallingIcon, MissedIcon, PendingIcon, ReceivedIcon } from '../views/app-views/call-record/call-record-icons';
// } from '../views/app-views/dashboard/components/call-record/call-record-icons';

const SOS_STATUS_CALL = [
  {
    key: 'CALL_STATE_RINGING_CALL',
    name: 'รอรับสาย',
    label: 'รอดำเนินการ',
    labelColor: '#FFD700',
    icon: <PendingIcon />,
  },
  {
    key: 'CALL_STATE_ANSWER_CALL',
    name: 'อยู่ระหว่างการสนทนา',
    label: 'กำลังดำเนินการ',
    labelColor: '#008BD5',
    icon: <CallingIcon />,
  },
  {
    key: 'CALL_STATE_HANGUP_CALL',
    name: 'จบการสนทนา',
    label: 'เสร็จสิ้น',
    labelColor: '#3AA981',
    icon: <MissedIcon />,
  },
  {
    key: 'CALL_STATE_REJECT_CALL',
    name: 'ไม่ได้รับสาย',
    label: 'ยกเลิก',
    labelColor: '#FF0000',
    icon: <ReceivedIcon />,
  },
  {
    key: 'CALL_STATE_REFUSE_CALL',
    name: 'ปฏิเสธสาย',
    label: 'ตัดสาย',
    labelColor: '#FF0000',
    icon: <ReceivedIcon />,
  },
];

export const GROUP_TYPE_LIST = [
  {
    id: 1,
    name: 'คดีกลุ่ม 1 คดีเกี่ยวกับชีวิต ร่างกายและเพศ',
    child: [
      { id: 1, name: 'ทะเลาะวิวาท' },
      { id: 2, name: 'ทำร้ายบาดเจ็บ' },
      { id: 3, name: 'บุคคลวิกลจริตอาละวาด' },
      { id: 4, name: 'ทำร้ายบาดเจ็บสาหัส' },
      { id: 5, name: 'อนาจาร' },
      { id: 6, name: 'หน่วงเหนี่ยวกักขัง' },
      { id: 7, name: 'นักเรียนตีกัน' },
      { id: 8, name: 'ข่มขืน' },
      { id: 9, name: 'ฉุดหญิง' },
      { id: 10, name: 'ล่อลวงหญิง' },
      { id: 11, name: 'ทำร้ายร่างกายและจิตใจ' },
    ],
  },
  {
    id: 2,
    name: 'คดีกลุ่ม 2 คดีเกี่ยวกับทรัพย์',
    child: [
      { id: 12, name: 'ลักทรัพย์' },
      { id: 13, name: 'บุกรุก' },
      { id: 14, name: 'ทำให้เสียทรัพย์' },
      { id: 15, name: 'ฉ้อโกงทรัพย์' },
      { id: 16, name: 'รถจักรยานยนต์หาย' },
      { id: 17, name: 'วิ่งราวทรัพย์' },
      { id: 18, name: 'ชิงทรัพย์' },
      { id: 19, name: 'กรรโชกทรัพย์' },
      { id: 20, name: 'รถยนต์หาย' },
      { id: 21, name: 'ยักยอกทรัพย์' },
      { id: 22, name: 'ปล้นทรัพย์' },
    ],
  },
  {
    id: 3,
    name: 'เบาะแส',
    child: [
      { id: 23, name: 'บุคคลต้องสงสัย' },
      { id: 24, name: 'รถต้องสงสัย' },
      { id: 25, name: 'วัตถุต้องสงสัย' },
      { id: 26, name: 'กลิ่นต้องสงสัย' },
      { id: 27, name: 'เสียงร้องขอความช่วยเหลือ' },
      { id: 28, name: 'ยาเสพติด' },
      { id: 29, name: 'พบบุคคลตามหมายจับ' },
    ],
  },
];

export default SOS_STATUS_CALL;
