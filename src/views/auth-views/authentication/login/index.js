import { BrowserView, MobileView } from 'react-device-detect';
import LoginOne from '../login-1';
import LoginEvidenceTracking from '../login-evidence-tracking';

const Login = () => {
  return (
    <>
      <BrowserView>
        <LoginOne allowRedirect={true} />
      </BrowserView>
      <MobileView>
        <LoginEvidenceTracking />
      </MobileView>
    </>
  );
};

export default Login;
