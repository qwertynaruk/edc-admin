import Swal from 'sweetalert2';

const DEF_TITLE = 'Do your has confirm this action';
const DEF_TEXT = 'Something went wrong!';
const DEF_ICON = 'warning';
const DEF_CONFIRM_BTN = 'ยืนยัน';
const DEF_CANCEL_BTN = 'ยกเลิก';
const DEF_CONFIRM_BTN_COLOR = '#1B2531';

const GLOBALS_PROPS = {
  confirmButtonColor: DEF_CONFIRM_BTN_COLOR,
  confirmButtonText: DEF_CONFIRM_BTN,
  cancelButtonText: DEF_CANCEL_BTN,
};

const DialogPopup = {
  confirm: ({ title = DEF_TITLE, text = DEF_TEXT, icon = DEF_ICON, confirmAction = null }) => {
    Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      ...GLOBALS_PROPS,
    }).then((res) => {
      if (res.isConfirmed) {
        confirmAction();
      }
    });
  },
  message: ({ title = DEF_TITLE, text = DEF_TEXT, icon = DEF_ICON, footer = '' }) => {
    Swal.fire({
      title,
      text,
      icon,
      footer,
      ...GLOBALS_PROPS,
    });
  },
  delete: ({ title = '', name = '', confirmAction = null }) => {
    Swal.fire({
      title: `ยืนยันการลบ${title}`,
      html: `<span>กรุณากรอกข้อความต่อไปนี้ “<span style="color: red">${name}</span>” เพื่อยืนยันการลบ</span>`,
      icon: 'warning',
      input: 'text',
      inputPlaceholder: 'กรอกข้อความ',
      inputValidator: (value) => {
        if (!value) {
          return 'กรุณากรอกข้อความ';
        }
        if (value !== name) {
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
        confirmAction();
      }
    });
  },
};

export default DialogPopup;
