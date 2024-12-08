import { Card, Col, Row } from 'antd';

import LoginForm from '../../components/LoginForm';
import LogoBackground from 'components/logo-components/logoBackground';
import LogoWithText from 'components/logo-components/logoWithText';

const LoginOne = (props) => {
  return (
    <>
      <div className="h-100">
        <div className="gx-container gx-d-flex gx-flex-column gx-justify-content-center gx-h-100">
          <Row justify="center" className="gx-flex-row">
            <Col xs={24} md={16} lg={10}>
              <Card className="gx-position-relative">
                <div className="gx-my-2">
                  <div className="gx-text-center">
                    <LogoWithText size={13} />
                  </div>
                  <Row justify="center" className="gx-flex-row">
                    <Col span={24}>
                      <LoginForm {...props} />
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
        <LogoBackground />
      </div>
    </>
  );
};

export default LoginOne;
