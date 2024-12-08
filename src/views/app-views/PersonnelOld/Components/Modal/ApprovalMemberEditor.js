import { Button, Col, Form, Input, Modal, Row, Space, Typography } from 'antd';
import PersonnelTransfer from 'components/shared-components/Modal/PersonnelTransfer';
import useService from 'hooks/useService';
import { cloneElement, useEffect, useState } from 'react';
import PersonnelService from 'services/PersonelService';
import { serviceWrapper } from 'utils/serviceHelper';
import PersonnelTable from '../PersonnelTable';

const { Title } = Typography;

function PersonnelTableHoC({ personnel, children }) {
  const { data, loading } = useService(serviceWrapper(PersonnelService.get), () => {
    if (!personnel) return null;
    if (personnel.length === 0) return null;
    return { params: { _id: personnel.toString() } };
  });
  if (personnel.length === 0) return children;
  return cloneElement(children, { dataSource: data, loading });
}

export default function ApprovalMemberEditor(props) {
  const { visible, setVisible, record = {}, actionLoading } = props;

  const { data, loading } = useService(serviceWrapper(PersonnelService.getRoleLevelById), () => {
    if (!record._id) {
      return null;
    }
    return {
      params: {
        id: record._id,
      },
    };
  });

  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState([]);

  const [form] = Form.useForm();

  const close = () => {
    form.resetFields();
    setSelectedPersonnel([]);
    setVisible(false);
  };
  const add = () => {
    setTransferModalVisible(true);
  };
  const onFinish = (values) => {
    if (props.onFinish) {
      props.onFinish({ ...values, personnel_ids: selectedPersonnel.map((person) => person._id) }, close);
    }
  };
  const onTransferSubmit = (personnel) => {
    setSelectedPersonnel(personnel);
  };

  useEffect(() => {
    if (!record) {
      return;
    }
    form.setFieldsValue(record);
  }, [form, record]);

  useEffect(() => {
    if (!data) {
      return;
    }
    setSelectedPersonnel(data?.role_personnel.map((person) => ({ _id: person.object_id })));
  }, [data]);

  const personnelIds = selectedPersonnel?.map((person) => person._id);

  return (
    <Modal
      visible={visible}
      width={700}
      footer={false}
      onCancel={close}
      title={`เพิ่มข้อมูลผังการอนุมัติ ${record?.level ? `(ระดับที่ ${record.level})` : ''}`}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item name="_id" hidden noStyle>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item name="level" hidden noStyle>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item name="parent_id" hidden noStyle>
          <Input type="hidden" />
        </Form.Item>
        <Space direction="vertical" size={16}>
          <Row gutter={16} className="gx-flex-row">
            <Col span={8}>
              <Form.Item
                label="ชื่อระดับ"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกชื่อระดับ',
                  },
                ]}
              >
                <Input placeholder="กรอกชื่อระดับ" />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item label="คำอธิบาย" name="detail">
                <Input placeholder="กรอกคำอธิบาย" />
              </Form.Item>
            </Col>
          </Row>
          <Space>
            <Title level={5}>รายชื่อ</Title>
            <Button type="primary" onClick={add}>
              เพิ่ม
            </Button>
          </Space>
          <PersonnelTableHoC personnel={personnelIds}>
            <PersonnelTable loading={loading} />
          </PersonnelTableHoC>
          <Space direction="vertical" align="end" className="gx-mt-4">
            <Space>
              <Button onClick={close}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit" loading={actionLoading}>
                บันทึก
              </Button>
            </Space>
          </Space>
        </Space>
      </Form>
      {transferModalVisible ? (
        <PersonnelTransfer
          leftKeys={personnelIds}
          visible={transferModalVisible}
          setVisible={setTransferModalVisible}
          onSubmit={onTransferSubmit}
        />
      ) : null}
    </Modal>
  );
}
