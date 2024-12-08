import { Form, Input } from 'antd';

import { LockOutlined } from '@ant-design/icons';
import { PASSWORD_PATTERN } from 'constants/RegexPattern';

const rules = {
  code: [
    {
      required: true,
      message: 'กรุณาใส่รหัสของคุณที่อยู่ในอีเมลของคุณ',
    },
  ],
  password: [
    {
      required: true,
      message: 'กรุณากรอกรหัสผ่านของคุณ',
    },
    {
      pattern: PASSWORD_PATTERN,
      message:
        'การตั้งค่ารหัสผ่าน อย่างน้อยต้องประกอบไปด้วยตัวเลข (0-9) อักขรพิเศษ ((@, #, &, !...) อักษรพิมพ์ใหญ่ (A-Z) อักษรพิมพ์เล็ก (a-z) และมีความยาวทั้งหมดอย่างน้อย 8 ตัวอักษรหรือมากกว่านั้น',
    },
  ],
  confirm: [
    {
      required: true,
      message: 'กรุณากรอกยืนยันรหัสผ่าน',
    },
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('รหัสผ่านไม่ตรงกัน'));
      },
    }),
  ],
};
const FormResetPassword = () => {
  return (
    <>
      <Form.Item name="password" rules={rules.password} validateTrigger={false} label="รหัสผ่านใหม่">
        <Input.Password placeholder="กรอกรหัสผ่านใหม่" prefix={<LockOutlined className="text-primary" />} />
      </Form.Item>
      <Form.Item name="confirm" rules={rules.confirm} validateTrigger={false} label="ยืนยันรหัสผ่านอีกครั้ง">
        <Input.Password placeholder="กรอกยืนยันรหัสผ่านอีกครั้ง" prefix={<LockOutlined className="text-primary" />} />
      </Form.Item>
      {/* <ul className="pl-3 font-size-sm">
        <li>
          <p className="mb-0">
            ต้องมีอักษรภาษาอังกฤษ อักษรพิเศษ และตัวเลข รวมกันอย่างน้อย 8 ตัว
          </p>
        </li>
        <li>
          <p className="mb-0">
            ต้องมีอักษรภาษาอังกฤษตัวพิมใหญ่ในรหัสผ่านอย่างน้อย 1 ตัว
          </p>
        </li>
        <li>
          <p className="mb-0">
            ต้องมีอักษรภาษาอังกฤษตัวพิมเล็กในรหัสผ่านอย่างน้อย 1 ตัว
          </p>
        </li>
        <li>
          <p className="mb-0">
            ต้องมีอักษรพิเศษอย่างน้อย 1 ตัว (เช่น * # @ % - +)
          </p>
        </li>
        <li>
          <p className="mb-0">ต้องมีตัวเลขอย่างน้อย 1 ตัว</p>
        </li>
      </ul> */}
    </>
  );
};

export default FormResetPassword;
