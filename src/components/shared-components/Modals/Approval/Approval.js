import { Button, Col, Form, Input, Modal, Row, Space, Typography } from 'antd';
import ApproverSelectWidget from 'components/shared-components/ApproverSelectWidget';
import CustomTable from 'components/shared-components/CustomTable';
import UserSelectWidget from 'components/shared-components/UserSelectWidget';
import produce from 'immer';
import _ from 'lodash';
import { observer } from 'mobx-react';
import UserStore from 'mobx/UserStore';
import { useState } from 'react';
import { renderDateTime } from 'utils/stringRender';

function Approval({
  visible,
  setVisible,
  onFinish,
  submitStatus,
  history = [],
  approvePermis = false,
  rejectRequest,
  approveRequest,
  request,
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: 'วันที่ทำรายการ',
      dataIndex: 'created_at',
      width: '20%',
      render: (ss) => renderDateTime(ss),
    },
    {
      title: 'สถานะคำขอ',
      dataIndex: 'submit_status',
      width: '15%',
      render: (ss) => ss || '-',
    },
    {
      title: 'ชื่อผู้ใช้',
      dataIndex: 'created_by',
      width: '25%',
      render: (id) => (id ? <UserSelectWidget viewMode userId={id} /> : '-'),
    },
    {
      title: 'รายละเอียด',
      dataIndex: 'detail',
      width: '40%',
    },
  ];

  const onFinishForm = (values) => {
    setLoading(true);
    if (onFinish) {
      onFinish(
        produce(values, (draft) => {
          draft.created_by = UserStore.user._id;
          if (!draft.inspector_id) return;
          draft.inspector_id = [draft.inspector_id];
        })
      )
        .then(() => {
          setVisible(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={() => {
        setVisible(false);
        form.resetFields();
      }}
      title={submitStatus === 'อนุมัติ' ? 'ประวัติการขออนุมัติ' : 'ขออนุมัติ'}
      footer={null}
      centered={true}
      forceRender
      width={850}
    >
      <Form form={form} layout="vertical" onFinish={onFinishForm} hidden={submitStatus === 'อนุมัติ'}>
        <Form.Item name="inspector_type" hidden initialValue="personnel">
          <Input type="hidden" />
        </Form.Item>
        <Input type="hidden" />
        {approvePermis ? null : (
          <Row gutter={16} className="gx-flex-row">
            <Col span={24}>
              <Form.Item
                name="inspector_id"
                label="ผู้อนุมัติ"
                rules={[{ required: true, message: 'กรุณาเลือกผู้อนุมัติ' }]}
              >
                <ApproverSelectWidget
                  placeholder="เลือกผู้อนุมัติ"
                  className="gx-w-100"
                  position={_.get(UserStore, 'position._id')}
                  department={_.get(UserStore, 'department._id')}
                  personnel={_.get(UserStore, 'user._id')}
                />
              </Form.Item>
            </Col>
          </Row>
        )}

        <Form.Item name="detail" label="รายละเอียด">
          <Input.TextArea />
        </Form.Item>

        {approvePermis ? (
          <Space className="gx-full-width gx-flex-end">
            <Button onClick={() => rejectRequest({ form, onFinishForm })} loading={loading}>
              ไม่อนุมัติ
            </Button>
            <Button type="primary" onClick={() => approveRequest({ form, onFinishForm })} loading={loading}>
              อนุมัติ
            </Button>
          </Space>
        ) : (
          <Space className="gx-full-width gx-flex-end">
            <Button type="primary" onClick={() => request({ form, onFinishForm })} loading={loading}>
              ขออนุมัติ
            </Button>
          </Space>
        )}
      </Form>

      <div className="gx-mt-4">
        <Typography.Text strong>ประวัติการขออนุมัติ</Typography.Text>
        <CustomTable
          className="gx-table-no-bordered gx-mt-4"
          columns={columns}
          size="small"
          bordered={false}
          dataSource={history}
        />
      </div>
    </Modal>
  );
}
export default observer(Approval);
