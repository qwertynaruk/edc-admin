import { Button, Checkbox, Col, Form, Input, Row, Select, Space, Typography } from 'antd';

import AttributeStore from 'mobx/AttributeStore';
import DatePicker from 'components/shared-components/DatePicker';
import Guarded from 'components/shared-components/Guarded';
import moment from 'moment';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import usePopup from 'hooks/usePopup';

const { Text } = Typography;

const { Option } = Select;

const { RangePicker } = DatePicker;

const customIsTouched = (a, b) => {
  return Object.keys(a).some((key) => a[key] !== b[key]);
};
const AddAttribute = (props) => {
  const { style, record, type } = props;

  const [form] = Form.useForm();
  const [fireConfirmPopup] = usePopup();

  const { Types, actionLoading } = AttributeStore;

  const onCancel = () => {
    // const isTouched = customIsTouched(
    //   _.omit(form.getFieldsValue(), ["start_stop_at"]),
    //   record
    // );
    const isTouched = form.isFieldsTouched();
    if (isTouched) {
      fireConfirmPopup().then((res) => {
        if (res.isConfirmed) {
          if (props.onCancel) props.onCancel();
        }
      });
      return;
    }
    if (props.onCancel) props.onCancel();
  };

  const onSubmit = (values) => {
    if (props.onSubmit) props.onSubmit(values);
  };

  useEffect(() => {
    if (!record) return;
    form.setFieldsValue({
      ...record,
      start_stop_at: record.start_stop_at && record.start_stop_at.map((x) => moment.utc(x)),
    });
  }, [record, form]);

  return (
    <Form form={form} layout="vertical" autoComplete="off" onFinish={onSubmit} style={style}>
      <Row gutter={[16, 16]} className="gx-flex-row">
        <Col span={24}>
          {record ? (
            <>
              {/* <LabelShowText labelText="ประเภทคุณลักษณะ" value={type} /> */}
              <Form.Item name="attribute_type_id" label="ประเภทคุณลักษณะ" hidden noStyle>
                <Input type="hidden" />
              </Form.Item>
            </>
          ) : (
            <Form.Item name="attribute_type_id" label="ประเภทคุณลักษณะ">
              <Select
                showSearch
                placeholder="เลือกประเภทคุณลักษณะ"
                filterOption={(input, option) => option.children.includes(input)}
              >
                {Types.map((el) => (
                  <Option key={el._id} value={el._id}>
                    {el.name_th}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="gx-flex-row">
        {/* <Col span={7}>
          <Form.Item name="create" valuePropName="checked">
            <Checkbox>เป็นการระบุคุณลักษณะเอง</Checkbox>
          </Form.Item>
        </Col> */}

        <Col span={24}>
          <Form.Item name="is_active" valuePropName="checked">
            <Checkbox>ใช้งาน</Checkbox>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="gx-flex-row">
        <Col span={24}>
          <Form.Item name="name_th" label="ชื่อคุณลักษณะ">
            <Input placeholder="กรอกชื่อคุณลักษณะ" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="gx-flex-row">
        <Col span={8}>
          <Form.Item
            name="code"
            label="รหัส"
            rules={[
              {
                required: true,
                message: 'กรุณากรอกรหัส',
              },
            ]}
          >
            <Input placeholder="กรอกรหัส" />
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item name="start_stop_at" label="วัน/เวลา ที่เริ่มใช้งาน - ที่สิ้นสุดการใช้งาน">
            <RangePicker
              showTime={{
                format: 'HH:mm',
              }}
              format="YYYY-MM-DD HH:mm"
              placeholder={['เลือกวันที่เริ่มใช้งาน', 'สิ้นสุดการใช้งาน']}
            />
          </Form.Item>
        </Col>
        {/* <Col span={8}>
          <Form.Item
            name="active_date"
            label="วัน/เวลา ที่เริ่มใช้งาน"
          >
            <DatePicker
              style={{
                width: "100%",
              }}
              placeholder="เลือกวันที่เริ่มใช้งาน"
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="inactive_date"
            label="วัน/เวลา ที่สิ้นสุดการใช้งาน"
          >
            <DatePicker
              style={{
                width: "100%",
              }}
              placeholder="เลือกวันที่สิ้นสุดการใช้งาน"
            />
          </Form.Item>
        </Col> */}
      </Row>
      {/* <Row gutter={[16, 16]} className="gx-flex-row">
                <Col span={24}>
                    <Form.Item name="attribute_code_genre_1" label="แหล่งที่มาของรหัส : ประเภทของรหัส">
                        <Select 
                            showSearch
                            placeholder="เลือกแหล่งที่มาของรหัส : ประเภทของรหัส"
                        >
                            {AttributeGenre.map(el => (
                                <Option key={el.key} value={el.name}>{el.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={[16, 16]} className="gx-flex-row">
                <Col span={24}>
                    <Form.Item name="attribute_code_genre_2" label="แหล่งที่มาของรหัส : ประเภทของรหัส">
                        <Select
                            showSearch
                            placeholder="เลือกแหล่งที่มาของรหัส : ประเภทของรหัส"
                        >
                            {AttributeGenre.map(el => (
                                <Option key={el.key} value={el.name}>{el.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row> */}
      <Guarded
        query={{
          group: 'System Administration',
          type: 'คุณลักษณะ',
          action: 'update',
        }}
      >
        <div style={{ padding: '10px' }}>
          <Space className="gx-full-width gx-flex-end">
            <Button onClick={onCancel}>ยกเลิก</Button>
            <Button type="primary" htmlType="submit" loading={actionLoading}>
              บันทึก
            </Button>
          </Space>
        </div>
      </Guarded>
    </Form>
  );
};

export default observer(AddAttribute);
