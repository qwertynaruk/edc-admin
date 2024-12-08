const WEBFORM_ONLINE_TYPE = [
  {
    _id: '62f60fa7c2f0cf281d2cbb59',
    name: 'แจ้งความออนไลน์',
  },
  {
    _id: '631addec1395642c01b68c30',
    name: 'เว็บฟอร์มออนไลน์',
  },
];

const WEBFORM_REQUEST_STATUS = [
  {
    label: 'รอดำเนินการ',
    value: 'รอดำเนินการ',
  },
  {
    label: 'กำลังดำเนินการ',
    value: 'กำลังดำเนินการ',
  },
  {
    label: 'เสร็จสิ้น',
    value: 'เสร็จสิ้น',
  },
  {
    label: 'ยกเลิก',
    value: 'ยกเลิก',
  },
  {
    label: 'ลบ',
    value: 'ลบ',
  },
];

const MAP_WEBFROM_SETION_NAME = {
  report_detail: 'รายละเอียด',
  report_type_id: 'หมายเลขประเภทเคส',
  reporter: 'รายละเอียดผู้แจ้งความ',
  report_location: 'รายละเอียดสถานที่',
  location_description: 'คำอธิบายสถานที่',
  none: '-',
};

const GROUP_TYPE_LIST = [
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

export default {
  WEBFORM_ONLINE_TYPE,
  GROUP_TYPE_LIST,
  WEBFORM_REQUEST_STATUS,
  MAP_WEBFROM_SETION_NAME,
};
