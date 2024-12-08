// https://stackoverflow.com/a/58767981
export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.∏[\]{}()?\-"!@#%&/,><':;|_~`])\S{8,99}$/g;

export const AT_LEAST_8_OR_99_CHARACTERS_PATTERN = {
  pattern: /^\S{8,99}$/,
  message: 'กรุณากรอกรหัสผ่านอย่างน้อย 8 ตัวอักษร',
};

export const AT_LEAST_ONE_UPPERCASE_PATTERN = {
  pattern: /^(?=.*[A-Z]).+$/,
  message: 'ต้องมีอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว',
};

export const AT_LEAST_ONE_LOWERCASE_PATTERN = {
  pattern: /^(?=.*[a-z]).+$/,
  message: 'ต้องมีอักษรพิมพ์เล็กอย่างน้อย 1 ตัว',
};

export const AT_LEAST_ONE_NUMBER_PATTERN = {
  pattern: /^(?=.*[0-9]).+$/,
  message: 'ต้องมีตัวเลขอย่างน้อย 1 ตัว',
};

export const AT_LEAST_ONE_SPECIAL_CHARACTER_PATTERN = {
  pattern: /^(?=.*[\^$*.∏[\]{}()?\-"!@#%&/,><':;|_~`]).+$/,
  message: 'ต้องมีอักขระพิเศษอย่างน้อย 1 ตัว: ^ $ * . [ ] { } ( ) ? " ! @ # % & / \\ , > < \' : ; | _ ~ ` = + -',
};
