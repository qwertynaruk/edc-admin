export default function useOneforce({ form }) {
  const validateFieldsInput = (event, max = 10, field = 'phone_number') => {
    const isNumber = /^\d$/.test(event?.key);
    const isBackspace = event?.key === 'Backspace';
    if (!isNumber && !isBackspace) {
      event?.preventDefault();
    } else {
      if (form?.getFieldValue(field)?.length >= max && !isBackspace) {
        event?.preventDefault();
      }
    }
  };

  const onlyNumber = (event) => {
    const isNumber = /^\d$/.test(event?.key);
    const isBackspace = event?.key === 'Backspace';
    if (!isNumber && !isBackspace) {
      event?.preventDefault();
    }
  };

  const validatePhoneNumber = (_, value) => {
    const fistPrefix = value?.slice(0, 2);
    const correctDigit = ['02', '06', '08', '09'];
    if (correctDigit.includes(fistPrefix) && value?.length === 10) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('รูปแบบของเบอร์โทรศัพท์ไม่ถูกต้อง'));
  };

  return {
    validateFieldsInput,
    onlyNumber,
    validatePhoneNumber,
  };
}
