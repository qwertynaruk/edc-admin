import { useState } from 'react';
import { Button, Col, Divider, Form, Input, Modal, Row, Select, Space, Typography } from 'antd';
import DialogNotification from 'components/shared-components/DialogNotification';
import MasterSelectWidget from 'components/shared-components/MasterSelectWidget';
import ReportStore from 'mobx/ReportStore';
import { observer } from 'mobx-react';
import CustomTable from 'components/shared-components/CustomTable';

const { Option } = Select;

const OffenseModal = ({ visible = false, setVisible = () => {}, onSelected = () => {} }) => {
  const { searchOffenseCodeList = [] } = ReportStore;
  const [form] = Form.useForm();
  const [screenLoading, setScreenLoading] = useState(false);

  const column = [
    {
      title: 'ประเภทกฎหมาย',
      dataIndex: 'law_type',
      width: '10%',
      render: (e) => e || '-',
    },
    {
      title: 'ข้อกฎหมาย',
      dataIndex: 'law_name',
      width: '10%',
      render: (e) => e || '-',
    },
    {
      title: 'หมวด',
      dataIndex: 'category',
      width: '12%',
      render: (e) => e || '-',
    },
    {
      title: 'ข้อหา',
      dataIndex: 'plaint',
      width: '25%',
      render: (e) => e || '-',
    },
    {
      title: 'มาตราข้อหา',
      dataIndex: 'section_article',
      width: '10%',
      render: (e) => e || '-',
    },
    {
      title: 'มาตราโทษ',
      dataIndex: 'section_penalty',
      width: '10%',
      render: (e) => e || '-',
    },
    {
      title: 'ระวางโทษ',
      dataIndex: 'penalty',
      width: '18%',
      render: (e) => e || '-',
    },
    {
      title: '',
      key: '_id',
      width: '5%',
      render: (e) => (
        <Button type="primary" onClick={() => onSelectOffense(e)}>
          เลือกความผิด
        </Button>
      ),
    },
  ];

  const onSearchItems = (values) => {
    const payload = values;
    setScreenLoading(true);

    ReportStore.searchOffenseCode(payload).finally(() => setScreenLoading(false));
  };

  const onExitModal = () => {
    setVisible(false);
    ReportStore.setSearchOffenseCodeList([]);
  };

  const onSelectOffense = (e) => {
    form.resetFields();
    onSelected(e);
    onExitModal();
  };

  return (
    <Modal
      visible={visible}
      title="เลือกความผิด"
      footer={null}
      onCancel={onExitModal}
      width={1260}
      centered
      maskClosable={false}
      style={{ marginTop: 15 }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinishFailed={() => DialogNotification('warning', 'ไม่สามารถทำรายการได้', 'กรุณากรอกข้อมูลให้ครบ')}
        onFinish={onSearchItems}
      >
        <Row className="gx-flex-row">
          <Col span={8}>
            <Form.Item name="type" label="ประเภทกฎหมาย" rules={[{ required: true, message: 'กรุณาเลือกประเภทกฎหมาย' }]}>
              <Select placeholder="เลือกประเภทกฎหมาย">
                <Option key="พ.ร.บ.">พ.ร.บ.</Option>
                <Option key="อาญาทั่วไป">อาญาทั่วไป</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="legal_provision" label="ข้อกฎหมาย">
              <MasterSelectWidget showSearch placeholder="เลือกข้อกฎหมาย" category="71" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="category" label="หมวด">
              <Input placeholder="กรอกหมวด" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="plaint" label="ข้อหา">
              <Input placeholder="กรอกเลือกข้อหา" />
            </Form.Item>
          </Col>
        </Row>
        <Space className="gx-full-width gx-flex-end">
          <Button onClick={() => form.submit()} type="primary">
            ค้นหา
          </Button>
        </Space>
        <Divider />
        <Typography.Text strong>รายการความผิด</Typography.Text>
        <CustomTable
          columns={column}
          dataSource={searchOffenseCodeList}
          pagination={{
            pageSize: 5,
            total: searchOffenseCodeList.length,
          }}
          size="middle"
          loading={screenLoading}
          className="gx-mt-3"
        />
      </Form>
    </Modal>
  );
};

export default observer(OffenseModal);
