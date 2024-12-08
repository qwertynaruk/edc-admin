import Swal from 'sweetalert2';

export default function usePopup({ type = 'confirm', onConfirm = () => {}, ...options } = {}) {
  const defineType = () => {
    switch (type) {
      case 'confirm':
        return {
          title: 'ยืนยันการยกเลิก',
          text: 'ข้อมูลที่คุณทำรายการไว้จะไม่ถูกบันทึก ยืนยันที่จะยกเลิกใช่หรือไม่',
          cancelButtonText: 'ยกเลิก',
          confirmButtonText: 'ยืนยัน',
          confirmButtonColor: '#FF3744',
          showCancelButton: true,
          icon: 'warning',
        };
      default:
        return {};
    }
  };
  const fire = async () => {
    return Swal.fire({ ...defineType(), ...options }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      }
      return result;
    });
  };
  return [fire];
}
