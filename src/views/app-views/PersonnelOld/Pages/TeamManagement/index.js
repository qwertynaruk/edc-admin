import { Button, Card, Col, Form, Input, Menu, Row, Space, Spin, Typography } from 'antd';
import { DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

import DepartmentSelectWidget from 'components/shared-components/DepartmentSelectWidget';
import DialogPopup from 'components/shared-components/DialogPopup';
import Guarded from 'components/shared-components/Guarded';
import LabsContent from 'components/layout-components/LabsContent';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import PersonnelSelectWidget from 'components/shared-components/PersonnelSelectWidget';
import TeamResponsibility from '../../../SettingGlobals/Component/Modal/TeamResponsibility';
import TeamStore from 'mobx/TeamStore';
import { observer } from 'mobx-react';

const { Title } = Typography;

const TeamManagement = (props) => {
  const { history } = props;
  const { teamList = [] } = TeamStore;

  const [form] = Form.useForm();
  const [show, setShow] = useState(false);
  const [label, setLabel] = useState([]);
  const [isEmpty, setIsEmpty] = useState(true);
  const [eventState, setEventState] = useState({ status: 'create' });
  const [activeMenu, setActiveMenu] = useState([]);
  const [valueInput, setvalueInput] = useState('');

  useEffect(() => {
    TeamStore.GetTeamList();
    TeamStore.GetMainAgency();
  }, []);

  useEffect(() => {
    setLabel(teamList);
  }, [teamList]);

  const searchOnchange = (e) => {
    const query = e;
    const { target = {} } = query;
    const { value = '' } = target;
    setvalueInput(value);

    const data = teamList.filter((item) => {
      return query === '' ? item : item.team_name.toLowerCase().includes(value);
    });

    setLabel(data);
  };

  const onCreate = (e) => {
    setIsEmpty(false);
    setvalueInput('');
    setLabel(teamList);

    if (eventState === 'create' && !isEmpty) {
      onDisplayPopup();
    } else {
      setEventState({ status: 'create' });
      setActiveMenu([]);
      form.resetFields();
    }
  };

  const onDisplayPopup = () => {
    DialogPopup.confirm({
      title: 'ยืนยันการยกเลิก',
      text: 'ข้อมูลที่คุณทำรายการไว้จะไม่ถูกบันทึก ยืนยันที่จะยกเลิกใช่หรือไม่',
      confirmAction: () => setIsEmpty(true),
    });
  };

  const onClickMenu = (even) => {
    setActiveMenu([even.key]);
    const a = teamList.filter((e) => e._id === even.key);

    if (a.length > 0) {
      setIsEmpty(false);
      setEventState({
        status: 'edit',
        _id: even.key,
      });
      form.setFieldsValue(a[0]);
    }
  };

  const formEvent = {
    onFinish: {
      create(payload) {
        const clone_value = { ...payload };
        TeamStore.CreateInvestigation(clone_value, () => setIsEmpty(true));
      },
      edit(payload) {
        const clone_value = { ...payload };
        TeamStore.UpdateInvestigation(clone_value, eventState._id);
      },
    },
  };

  return (
    <>
      <PageBreadcrumb history={history} pageLabel={{ master: 'ตั้งค่า', subpath: 'ชุดปฏิบัติการ' }} />
      <LabsContent
        titleContent={
          <Space>
            <SettingOutlined style={{ fontSize: 24 }} />
            <Title level={5} className="gx-mb-0">
              ชุดปฏิบัติการ
            </Title>
          </Space>
        }
        sideContent={
          <>
            <Guarded
              query={{
                group: 'Personnel',
                type: 'ชุดปฏิบัติการ',
                name: 'แก้ไขข้อมูลชุดปฏิบัติการ',
              }}
            >
              <Row className="gx-mt-2 gx-px-2 gx-flex-row" gutter={[8, 8]}>
                <Col span={24}>
                  <Button className="gx-full-width" type="primary" onClick={onCreate}>
                    เพิ่ม
                  </Button>
                </Col>
              </Row>
            </Guarded>

            <Row>
              <Col span={24}>
                <Space className="gx-px-2 gx-mt-2 gx-space-full-width">
                  <Input placeholder="ค้นหาชุดปฏิบัติการ" onChange={searchOnchange} value={valueInput} />
                </Space>
              </Col>
            </Row>

            <Space direction="vertical">
              <Spin spinning={TeamStore.content_loading}>
                <Menu onClick={onClickMenu} selectedKeys={activeMenu}>
                  {label.map((e) => (
                    <Menu.Item key={e._id}>{e.team_name}</Menu.Item>
                  ))}
                </Menu>
              </Spin>
            </Space>
          </>
        }
      >
        {isEmpty && (
          <div
            style={{
              height: '100%',
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <span style={{ opacity: '0.4', fontWeight: 300, fontSize: 25 }}>โปรดเลือกข้อมูลที่ต้องการ</span>
          </div>
        )}

        {!isEmpty && (
          <Form className="gx-p-4" form={form} layout="vertical" onFinish={formEvent.onFinish[eventState.status]}>
            <Row gutter={[16, 5]}>
              <Col span={24}>
                <Form.Item
                  label="ฝ่ายงาน"
                  name="main_agency"
                  rules={[
                    {
                      required: true,
                      message: 'กรุณาเลือกฝ่ายงาน',
                    },
                  ]}
                >
                  {/* <MasterSelectWidget placeholder="เลือกฝ่ายงาน" category="78" /> */}
                  <DepartmentSelectWidget placeholder="เลือกฝ่ายงาน" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="ชื่อชุดปฏิบัติการ"
                  name="team_name"
                  rules={[
                    {
                      required: true,
                      message: 'กรุณากรอกชื่อชุดปฏิบัติการ',
                    },
                  ]}
                >
                  <Input placeholder="กรอกชื่อทีม" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label="รายละเอียด"
                  name="details"
                  rules={[
                    {
                      required: true,
                      message: 'กรุณากรอกรายละเอียด',
                    },
                  ]}
                >
                  <Input placeholder="กรอกรายละเอียด" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <TeamResponsibility />
              </Col>

              {/* new */}
              <Card>
                <Title level={4} className="gx-mb-0">
                  รายชื่อเจ้าหน้าที่ชุดปฏิบัติการ
                </Title>
                <div className="gx-mt-4">
                  <Form.List name="operation_officers">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name }) => (
                          <Card key={key}>
                            <Button className="gx-position-absolute" ghost onClick={() => remove(name)}>
                              <DeleteOutlined />
                            </Button>
                            <Form.Item
                              className="gx-mb-0"
                              label={`เจ้าหน้าที่ (${key + 1})`}
                              name={name}
                              rules={[
                                ({ getFieldValue }) => ({
                                  validator(_, value) {
                                    if (value) {
                                      const checkIf = getFieldValue('operation_officers').filter((e) => e === value);
                                      if (checkIf.length <= 1) {
                                        return Promise.resolve();
                                      } else {
                                        return Promise.reject(
                                          new Error(
                                            'ไม่สามารถเลือกซ้ำได้ เนื่องจากมีรายชื่อในอยู่ในรายการแล้ว กรุณาเลือกใหม่'
                                          )
                                        );
                                      }
                                    }
                                  },
                                }),
                              ]}
                            >
                              <PersonnelSelectWidget placeholder="เลือกเจ้าหน้าที่" />
                            </Form.Item>
                          </Card>
                        ))}
                        <Space className="gx-mt-4">
                          <Button type="primary" onClick={() => add()}>
                            เพิ่มเจ้าหน้าที่
                          </Button>
                        </Space>
                      </>
                    )}
                  </Form.List>
                </div>
              </Card>
              {/* new */}
              <Guarded
                query={{
                  group: 'Personnel',
                  type: 'ชุดปฏิบัติการ',
                  name: 'แก้ไขข้อมูลชุดปฏิบัติการ',
                }}
              >
                <Col span="24" align="end">
                  <Form.Item shouldUpdate>
                    {() => {
                      return (
                        <>
                          <Button
                            className="gx-mr-2"
                            onClick={() => {
                              if (form.isFieldsTouched()) return onDisplayPopup();
                              return setIsEmpty(true);
                            }}
                          >
                            ยกเลิก
                          </Button>
                          <Button loading={TeamStore.actionLoading} type="primary" htmlType="submit">
                            บันทึก
                          </Button>
                        </>
                      );
                    }}
                  </Form.Item>
                </Col>
              </Guarded>
            </Row>
          </Form>
        )}
      </LabsContent>
    </>
  );
};

export default observer(TeamManagement);
