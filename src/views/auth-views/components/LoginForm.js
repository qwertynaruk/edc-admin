import { Button, Checkbox, Form, Input, Select, Space, Spin } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import UserStore from 'mobx/UserStore';
import _ from 'lodash';
import { getDevModeAndOrgPath } from 'utils/UserHelper';
import { observer } from 'mobx-react';
import styled from '@emotion/styled';
import { useSearchParams } from 'react-router-dom';

const InputPassword = styled(Input.Password)`
  background-color: #f5f5f5;

  > input {
    background: transparent;
  }
`;

const InputCombine = styled(Input)`
  background-color: #f5f5f5;

  > input {
    background: transparent;
  }
`;

export const LoginForm = (props) => {
  const [isIP, setIsIP] = useState({ ip: '-' });
  const [searchParams] = useSearchParams();

  const { loading } = props;

  const initialCredential = {
    email: '',
    password: '',
  };

  const { devLocalMode, organization } = getDevModeAndOrgPath();

  const onLogin = (values) => {
    const payload = {
      ...values,
      ...isIP,
      organization: organization || values.organization,
      db_name: organization || values.organization,
      auth_type: 'police',
    };

    UserStore.SignInAccess(payload, searchParams.get('redirect'));
  };

  useEffect(() => {
    if (!_.isEmpty(UserStore.user)) {
      if (_.isEmpty(UserStore.selectBranch?.chooseBranch)) {
        if (UserStore.isGlobal) {
          window.location.href = '/auth/organization';
        } else {
          // window.location.href = '/auth/login';
        }
      } else {
        window.location.href = '/';
      }
    }
    fetchIp();
  }, []);

  const fetchIp = async () => {
    await fetch('https://api.ipify.org?format=json')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const { ip = '' } = data;
        setIsIP(data);
        localStorage.setItem('app_ip', ip);
      });
  };

  return (
    <Spin spinning={UserStore.content_loading}>
      <Form
        layout="vertical"
        name="login-form"
        initialValues={initialCredential}
        onFinish={onLogin}
        className="gx-signin-form gx-form-row0"
      >
        <Form.Item
          name="username"
          label="อีเมลหรือหมายเลขบัตรประชาชน"
          rules={[
            {
              required: true,
              message: 'กรุณากรอกอีเมลหรือหมายเลขบัตรประชาชน',
            },
          ]}
        >
          <InputCombine
            prefix={<MailOutlined style={{ marginRight: 10 }} />}
            placeholder="กรอกอีเมลหรือหมายเลขบัตรประชาชน"
          />
        </Form.Item>
        <Form.Item name="password" label="รหัสผ่าน" rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน' }]}>
          <InputPassword prefix={<LockOutlined style={{ marginRight: 10 }} />} placeholder="กรอกรหัสผ่าน" />
        </Form.Item>
        {devLocalMode && (
          <Form.Item
            name="organization"
            label="หน่วยงานหรือองค์กร"
            rules={[{ required: true, message: 'กรุณากรอกหน่วยงานหรือองค์กร' }]}
          >
            <Select
              showSearch
              allowClear
              placeholder="กรุณากรอกหน่วยงานหรือองค์กร"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              options={[
                {
                  label: 'ส่วนกลาง',
                  value: 'global',
                },
                {
                  label: 'อ่างทอง',
                  value: 'angthong',
                },
                {
                  label: 'demo',
                  value: 'demo',
                },
              ]}
            />
          </Form.Item>
        )}
        <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
          <Checkbox>เข้าสู่ระบบอัตโนมัติ</Checkbox>
        </Form.Item>
        <Form.Item>
          {!props.children && (
            <Space direction="vertical">
              <Button htmlType="submit" type="primary" block>
                เข้าสู่ระบบ
              </Button>
              {/* <Button className="link-no-style" type="link" block href="/auth/forget-password">
                ลืมรหัสผ่าน
              </Button> */}
            </Space>
          )}
          {_.isFunction(props.children) && props.children({ loading })}
        </Form.Item>
      </Form>
    </Spin>
  );
};

LoginForm.propTypes = {
  otherSignIn: PropTypes.bool,
  showForgetPassword: PropTypes.bool,
  extra: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

LoginForm.defaultProps = {
  otherSignIn: true,
  showForgetPassword: false,
};

export default observer(LoginForm);
