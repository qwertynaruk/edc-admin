import { Space as AntSpace, Button, Typography } from 'antd';

import LoginForm from 'views/auth-views/components/LoginForm';
import LogoWithText from 'components/logo-components/logoWithText';
import styled from '@emotion/styled';

const { Paragraph } = Typography;

const Space = styled(AntSpace)`
  .ant-space-item {
    width: 100%;
    text-align: center;
  }
`;

const LoginEvidenceTracking = (props) => {
  return (
    <div className="gx-login-container">
      <div className="gx-login-content">
        <div className="gx-login-header gx-text-center">
          <AntSpace className="gx-justify-content-center">
            <LogoWithText size={7} />
            {/* <img className="img-fluid" src={`/img/new-logo-sm.png`} alt="UDONCOP" style={{ width: 40 }} /> */}
            {/* <span style={{ fontWeight: 700, fontSize: '18px' }}>Evidence Tracking</span> */}
          </AntSpace>
        </div>

        <LoginForm {...props}>
          {({ loading }) => {
            return (
              <Space direction="vertical" align="center">
                <Button htmlType="submit" loading={loading} type="primary" className="gx-w-100">
                  เข้าสู่ระบบ
                </Button>
                <Button className="link-no-style" type="link" block href="/auth/forget-password">
                  ลืมรหัสผ่าน
                </Button>
                <Paragraph>
                  Powerd by <span style={{ color: 'rgba(253, 54, 68, 1)' }}>ONEFORCE</span>
                </Paragraph>
              </Space>
            );
          }}
        </LoginForm>
      </div>
    </div>
  );
};
export default LoginEvidenceTracking;
