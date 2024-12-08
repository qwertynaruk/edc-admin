import { Button, Card, Col, Form, Input, Row, Select, Space, Spin } from 'antd';

import LogoBackground from 'components/logo-components/logoBackground';
import LogoWithText from 'components/logo-components/logoWithText';
import UserStore from 'mobx/UserStore';
import _ from 'lodash';
import { observer } from 'mobx-react';
import styled from '@emotion/styled';
import { useEffect } from 'react';
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

export const Organization = (props) => {
  const { token, loading, redirect, showMessage, allowRedirect, Get_User_Info } = props;

  const { user, allBranch } = UserStore;
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect');

  useEffect(() => {
    if (_.isEmpty(UserStore.user)) {
      window.location.href = '/auth/login';
    }
    if (!_.isEmpty(UserStore.selectBranch?.chooseBranch)) {
      window.location.href = redirectPath ?? '/';
    }
  }, []);

  const onFinish = (values) => {
    const findBranch = allBranch.find((branch) => branch.value === values.organization);
    UserStore.ChooseBranch({ chooseBranch: findBranch });
    if (!_.isEmpty(UserStore.selectBranch?.chooseBranch)) {
      window.location.href = redirectPath ?? '/';
    }
  };

  return (
    <>
      <Spin spinning={UserStore.content_loading}>
        <div className="h-100">
          <div className="gx-container gx-d-flex gx-flex-column gx-justify-content-center gx-h-100">
            <Row justify="center" className="gx-flex-row">
              <Col xs={24} sm={24} md={24} lg={12}>
                <Card className="gx-position-relative">
                  <div className="gx-my-2">
                    <div className="gx-text-center">
                      <LogoWithText size={7} />
                    </div>
                    <Row justify="center" className="gx-flex-row">
                      <Col span={24}>
                        <Spin spinning={UserStore.content_loading}>
                          <Form
                            layout="vertical"
                            name="login-form"
                            // initialValues={initialCredential}
                            onFinish={onFinish}
                            className="gx-signin-form gx-form-row0"
                          >
                            <Form.Item
                              name="organization"
                              label="เลือกจังหวัด"
                              rules={[{ required: true, message: 'กรุณาเลือกจังหวัด' }]}
                            >
                              <Select
                                showSearch
                                allowClear
                                placeholder="กรุณาเลือกจังหวัด"
                                optionFilterProp="children"
                                // onChange={onChange}
                                // onSearch={onSearch}
                                filterOption={(input, option) =>
                                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={allBranch}
                              />
                            </Form.Item>
                            <Form.Item>
                              <Space direction="vertical">
                                <Button htmlType="submit" type="primary" block>
                                  เข้าสู่ระบบ
                                </Button>
                              </Space>
                              {_.isFunction(props.children) && props.children({ loading })}
                            </Form.Item>
                          </Form>
                        </Spin>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
          <LogoBackground />
        </div>
      </Spin>
    </>
  );
};

export default observer(Organization);
