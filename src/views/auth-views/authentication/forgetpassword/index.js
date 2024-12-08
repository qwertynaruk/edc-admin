import { Button, Card, Col, Form, Row } from 'antd';

import DialogNotification from 'components/shared-components/DialogNotification';
import Flex from 'components/shared-components/Flex';
import FormForgotPage from 'views/auth-views/components/ForgotPassword/FormForgotPage';
import FormOtpPage from 'views/auth-views/components/ForgotPassword/FormOtpPage';
import FormResetPassword from 'views/auth-views/components/ForgotPassword/FormResetPassword';
import LogoBackground from 'components/logo-components/logoBackground';
import LogoWithText from 'components/logo-components/logoWithText';
import React from 'react';
import UserService from 'services/UserService';
import _ from 'lodash';
import produce from 'immer';
import { useNavigate } from 'react-router-dom';

const initialState = {
  isLoading: false,
  sendForgetDataFinish: {},
  data: {},
  alertStatus: {
    showMessage: false,
    message: '',
  },
  stateProcess: 'start',
};
function reducer(state, action) {
  switch (action.type) {
    case 'endLoading':
      return { ...state, isLoading: false };
    case 'startLoading':
      return { ...state, isLoading: true };
    case 'changeState':
      return {
        ...state,
        ...{
          stateProcess: action.payload.stateProcess,
          sendForgetDataFinish: {
            ...state.sendForgetDataFinish,
            ...action.payload.sendForgetDataFinish,
          },
          data: {
            ...state.data,
            ...action.payload.data,
          },
        },
      };
    default:
      throw new Error();
  }
}
const Forget = (props) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const textFormInCard = {
    start: {
      text_head: 'ลืมรหัสผ่าน ?',
      detail: (
        <>
          <p className="mb-0">คุณต้องการรับรหัส OTP สำหรับรีเซ็ตหรัสผ่านใหม่ด้วยวิธีใด</p>
        </>
      ),
    },
    pending: {
      text_head: 'ยืนยันรหัส  OTP ?',
      detail: (
        <>
          <p className="mb-0">กรุณากรอกรหัส OTP ที่ถูกส่งไปยัง</p>
          <p className="mb-0">
            {_.get(state, 'data.email', _.get(state, 'data.phone_number', '-'))} รหัสผ่านจะมีอายุ 15 นาที
          </p>
        </>
      ),
    },
    change: {
      text_head: 'ตั้งรหัสผ่านใหม่',
      detail: <></>,
    },
    end: {
      text_head: '',
      detail: <></>,
    },
  };
  const formEvent = {
    form_start(values) {
      dispatch({ type: 'startLoading' });
      UserService.forgetPassword(
        produce({ auth_type: 'police' }, (draft) => {
          if (values.email) {
            draft.email = values.email;
          }
          if (values.phone_number) {
            draft.phone_number = values.phone_number;
          }
        })
      )
        .then((resp) => {
          dispatch({
            type: 'changeState',
            payload: { stateProcess: 'pending', sendForgetDataFinish: values, data: resp.data },
          });
        })
        .catch(() => {
          DialogNotification('error', values.email ? 'ไม่พบอีเมลนี้ในระบบ' : 'ไม่พบเบอร์โทรนี้ในระบบ');
        })
        .finally(() => {
          dispatch({ type: 'endLoading' });
        });
    },
    form_pending(values) {
      dispatch({ type: 'startLoading' });
      UserService.verifyForgetPassword({
        ...state.data,
        code: values.code,
      })
        .then((resp) => {
          dispatch({
            type: 'changeState',
            payload: { stateProcess: 'change', sendForgetDataFinish: values, data: resp.data },
          });
        })
        .catch(() => {
          DialogNotification('error', 'รหัส OTP ไม่ถูกต้อง');
        })
        .finally(() => {
          dispatch({ type: 'endLoading' });
        });
    },
    form_change(values) {
      dispatch({ type: 'startLoading' });
      UserService.reset_password_police_no_header({
        headers: {
          Authorization: state.data.id_token,
        },
        data: {
          username: _.get(state, 'sendForgetDataFinish.email', _.get(state, 'sendForgetDataFinish.phone_number')),
          password: values.password,
        },
      })
        .then((resp) => {
          dispatch({
            type: 'changeState',
            payload: { stateProcess: 'end', sendForgetDataFinish: values, data: resp.data },
          });
          DialogNotification('success', 'เปลี่ยนรหัสผ่านสำเร็จ');
          navigate('auth/login');
        })
        .catch(() => {
          DialogNotification('error', 'รหัส OTP ไม่ถูกต้อง');
        })
        .finally(() => {
          dispatch({ type: 'endLoading' });
        });
    },
  };

  return (
    <div className="h-100">
      <div className="gx-container gx-d-flex gx-flex-column gx-justify-content-center gx-h-100">
        <Row justify="center" className="gx-flex-row">
          <Col xs={24} sm={24} md={24} lg={12}>
            <Card className="gx-position-relative">
              <div className="gx-my-2">
                <div className="gx-text-center">
                  <LogoWithText size={13} />
                  <h4>{textFormInCard[state.stateProcess].text_head}</h4>

                  <Flex justifyContent="center" alignItems="center" flexDirection="column">
                    {textFormInCard[state.stateProcess].detail}
                  </Flex>
                </div>
                <Row justify="center" className="gx-flex-row">
                  <Col span={24}>
                    <Form
                      form={form}
                      layout="vertical"
                      initialValues={{ mode: 'email' }}
                      onFinish={formEvent[`form_${state.stateProcess}`]}
                    >
                      {state.stateProcess === 'start' && (
                        <FormForgotPage form={form} alertStatus={state.alertStatus} isLoading={state.isLoading} />
                      )}
                      {state.stateProcess === 'pending' && <FormOtpPage alertStatus={state.alertStatus} />}
                      {state.stateProcess === 'change' && <FormResetPassword />}
                      <Form.Item className="gx-mb-0">
                        <Button type="primary" htmlType="submit" block loading={state.isLoading}>
                          ยืนยัน
                        </Button>
                      </Form.Item>
                      {state.stateProcess === 'start' && (
                        <Button block onClick={() => navigate('auth/login')} ghost>
                          เข้าสู่ระบบ
                        </Button>
                      )}
                      {state.stateProcess === 'pending' && (
                        <Button
                          block
                          onClick={() =>
                            dispatch({
                              type: 'changeState',
                              payload: {
                                stateProcess: 'start',
                                sendForgetDataFinish: [],
                              },
                            })
                          }
                          ghost
                        >
                          ย้อนกลับ
                        </Button>
                      )}
                    </Form>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      <LogoBackground />
    </div>
  );
};

export default Forget;
