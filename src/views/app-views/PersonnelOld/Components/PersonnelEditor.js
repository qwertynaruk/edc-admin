import { Button, Card, Dropdown, Form, Input, Menu, Modal, Space, Table } from 'antd';
import { createContext, useCallback, useContext, useState } from 'react';

import AlertErrorMessage from 'components/shared-components/AlertErrorMessage';
import Col from 'components/shared-components/FormBuilder/Col';
import { GLOBALS_PROPS } from 'views/app-views/SettingGlobals/Pages/Organization';
import Guarded from 'components/shared-components/Guarded';
import PersonnelBasicForm from './PersonnelBasicForm';
import PersonnelStore from 'mobx/PersonelStore';
import RowFixed from 'components/shared-components/RowFixed';
import Swal from 'sweetalert2';
import _ from 'lodash';
import { css } from '@emotion/css';
import { observer } from 'mobx-react';
import usePopup from 'hooks/usePopup';

export const PersonnelEditorContext = createContext({
  personnel: null,
  canCreateUser: false,
  actionLoading: false,
  userCreationError: null,
});

const PersonnelEditor = (props) => {
  const { title } = props;
  const { personnel, canCreateUser, actionLoading, userCreationError } = useContext(PersonnelEditorContext);
  const { content_loading } = PersonnelStore;
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Content of the modal');
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setModalText('The modal will be closed after two seconds');
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };
  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

  const [fireConfirm] = usePopup({
    onConfirm: () => {
      if (props.onCancel) props.onCancel();
    },
  });

  const onFinish = (values) => {
    if (!props.onSubmit) return;
    const personnel = _.omit(values, ['password', 'password_confirmation']);
    const user = _.pick(values, ['email', 'password']);
    props.onSubmit({
      user,
      personnel,
    });
  };

  const onCancel = useCallback(() => {
    if (form.isFieldsTouched()) {
      fireConfirm();
      return;
    }
    if (props.onCancel) props.onCancel();
  }, [fireConfirm, form, props]);

  const onSubmit = () => {
    form
      .validateFields()
      .then(() => {
        form.submit();
      })
      .catch((error) => {
        return error;
      });
  };

  const onSearch = (value) => {
    console.log('value', value);
    // setKeySearch(value);
    // const findData = dataSourceUserListApi.filter((item) => {
    //   return JSON.stringify(Object.values(item)).toLowerCase().indexOf(value.toLowerCase()) > -1;
    // });
    // setSearchUserList(findData);
  };

  const dataSource = [
    {
      key: '1',
      name: 'Mike',
      age: 32,
      address: '10 Downing Street',
    },
    {
      key: '2',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
    },
  ];

  const columns = [
    {
      title: 'สิทธ์การเข้าถึง',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'ตัวย่อ',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Lv.สิทธ์การเข้าถึง',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'ระดับผู้ใช้งาน',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'ฝ่ายงาน',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'ตำแหน่ง',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'ผู้บังคับบัญชา',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'ป้ายกำกับ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => {
        return (
          <Dropdown
            overlay={
              <Menu
                items={[
                  { key: 'edit', label: 'แก้ไข' },
                  { key: 'delete', label: 'ลบ' },
                ]}
                onClick={(value) => {
                  console.log('key', value);
                  console.log('key, record', record);
                  if (value.key === 'delete') {
                    Swal.fire({
                      title: 'ยืนยันการลบหน่วยงานหรือองค์กร',
                      html: '<span>กรุณากรอกข้อความต่อไปนี้ “<span style="color: red">ORGANIZATION</span>” เพื่อยืนยันการลบ</span>',
                      icon: 'warning',
                      input: 'text',
                      inputPlaceholder: 'กรอกข้อความ',
                      inputValidator: (value) => {
                        if (!value) {
                          return 'กรุณากรอกข้อความ';
                        }
                        if (value !== 'ORGANIZATION') {
                          return 'กรุณากรอกข้อความให้ถูกต้อง';
                        }
                      },
                      showCancelButton: true,
                      ...GLOBALS_PROPS,
                      customClass: {
                        input: 'input-input-placeholder',
                        icon: 'swal2-icon-custom-color',
                      },
                      confirmButtonColor: '#e61414',
                      cancelButtonColor: '#495762',
                      reverseButtons: true,
                    }).then((res) => {
                      if (res.isConfirmed) {
                        console.log('confirm');
                      } else {
                        console.log('cancel clear');
                      }
                    });
                  }
                }}
              />
            }
            placement="bottomRight"
            trigger={['click']}
          >
            <i className="gx-icon-btn icon icon-ellipse-v" />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        className={css`
          .ant-form-item-label > label {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: block;
          }
        `}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Card
          loading={content_loading}
          className={css`
            overflow: hidden;
            .ant-card-body {
              padding-bottom: 0;
            }
            .ant-card-actions {
              background: transparent;
              border-color: #495762;
              > li > span {
                cursor: default;
              }
            }
          `}
        >
          <PersonnelBasicForm form={form} personnel={personnel} canCreateUser={canCreateUser} />
          <AlertErrorMessage message={userCreationError} />
        </Card>
        <Card
          className={css`
            overflow: hidden;
            .ant-card-body {
              padding-bottom: 0;
            }
            .ant-card-actions {
              background: transparent;
              border-color: #495762;
              > li > span {
                cursor: default;
              }
            }
          `}
          title={
            <>
              <Button type="primary" onClick={showModal}>
                เพิ่มสิทธิ์การเข้าถึง
              </Button>
            </>
          }
          extra={<Input.Search placeholder="input search text" onSearch={onSearch} allowClear style={{ width: 250 }} />}
          actions={[
            <Space key={1} direction="vertical" align="end" className="gx-mr-4">
              <Guarded
                query={{
                  group: 'Personnel',
                  type: 'กำลังพล',
                  action: 'update',
                }}
              >
                <Space>
                  <Button onClick={onCancel}>ยกเลิก</Button>
                  <Button type="primary" onClick={onSubmit} loading={actionLoading}>
                    บันทึก
                  </Button>
                </Space>
              </Guarded>
            </Space>,
          ]}
        >
          <Table dataSource={dataSource} columns={columns} />
        </Card>
      </Form>
      <>
        <Modal
          title="สิทธิ์การเข้าถึง"
          visible={open}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
        >
          <Form form={form} layout="vertical" autoComplete="off">
            <RowFixed gutter={8}>
              <Col sm={18}>
                <Form.Item rules={[{ required: true, message: '' }]} label="เลือกสิทธ์การเข้าถึง" name="prefixTH">
                  <Input placeholder="Auto" />
                </Form.Item>
              </Col>
              <Col sm={6}>
                <Form.Item rules={[{ required: true, message: '' }]} label="ตัวย่อ (TH)" name="prefixTH">
                  <Input placeholder="Auto" />
                </Form.Item>
              </Col>
              <Col sm={24}>
                <Form.Item rules={[{ required: true, message: '' }]} label="ระดับผู้ใช้งาน" name="prefixTH">
                  <Input placeholder="Auto" />
                </Form.Item>
              </Col>
              <Col sm={12}>
                <Form.Item rules={[{ required: true, message: '' }]} label="ฝ่ายงาน" name="prefixTH">
                  <Input placeholder="Auto" />
                </Form.Item>
              </Col>
              <Col sm={12}>
                <Form.Item rules={[{ required: true, message: '' }]} label="ตำแหน่ง" name="prefixTH">
                  <Input placeholder="Auto" />
                </Form.Item>
              </Col>
              <Col sm={24}>
                <Form.Item rules={[{ required: true, message: '' }]} label="ผู้บังคับบัญชา" name="prefixTH">
                  <Input placeholder="Auto" />
                </Form.Item>
              </Col>
              <Col sm={24}>
                <Form.Item rules={[{ required: true, message: '' }]} label="ป้ายกำกับ" name="prefixTH">
                  <Input placeholder="Auto" />
                </Form.Item>
              </Col>
            </RowFixed>
          </Form>
        </Modal>
      </>
    </>
  );
};

export default observer(PersonnelEditor);
