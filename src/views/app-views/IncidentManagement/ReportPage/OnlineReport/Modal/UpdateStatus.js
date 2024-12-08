import { Button, Col, Form, Input, Modal, Row, Select, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import CloudConstant from 'constants/CloudConstant';
import ReportStore from 'mobx/ReportStore';

const { Option } = Select;

// const statusType = 'ยกเลิก';

const UpdateStatus = ({ visible, setVisible, onConfirm, currentData }) => {
  const [statusType, setStatusType] = useState('');
  const [loadding, setLoadding] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (currentData) {
      form.resetFields();
      ReportStore.getTypesList('', true);
      ReportStore.getReportItems(currentData._id);
      setStatusType('');
    }
  }, [currentData]);

  // useEffect(() => {
  //   if (visible === false) {
  //     setStatusType('');
  //   }
  // }, [visible]);

  const handleOk = async () => {
    setLoadding(true);
    if (currentData) {
      const { reportItems } = ReportStore;
      form
        .validateFields()
        .then((resp) => {
          const formData = {
            ...resp,
            report_type_id: reportItems?.report_type_id,
          };
          try {
            ReportStore.updateReportStatus(formData, currentData?._id).finally(() => {
              setLoadding(false);
              onConfirm();
              setVisible(false);
              setStatusType('');
            });
          } catch (error) {
            setStatusType('');
          }
        })
        .catch(() => {
          setLoadding(false);
          setStatusType('');
        });
    }
  };
  const handleCancel = () => {
    setVisible(false);
  };

  const menuActionItemList = useMemo(() => {
    return CloudConstant.WEBFORM_REQUEST_STATUS.filter(
      (rd) => rd.value !== CloudConstant.WEBFORM_REQUEST_STATUS[0].value
    ).map((rd) => ({ ...rd, key: rd.value }));
  }, []);

  return (
    <>
      <Modal visible={visible} centered onCancel={handleCancel} footer={null}>
        <Typography.Title level={5}>อัพเดทสถานะของ {currentData?.report_record_id} หรือไม่</Typography.Title>
        <Form form={form} layout="vertical">
          <Row>
            <Col span={24}>
              <Form.Item name="status" label="สถานะ" rules={[{ required: true }]}>
                <Select
                  placeholder="เลือกสถานะ"
                  onChange={(ez) => {
                    setStatusType(ez);
                  }}
                >
                  {menuActionItemList.map((el) => (
                    <Option key={el.value} value={el.value}>
                      {el.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {statusType === 'ยกเลิก' && (
              <Col span={24}>
                <Form.Item
                  name="cuase_of_rejected"
                  label="กรุณาระบุเหตุผลในการยกเลิก"
                  rules={[{ required: true, message: '' }]}
                >
                  <Input placeholder="กรอกเหตุผลในการยกเลิก" />
                </Form.Item>
              </Col>
            )}

            {statusType === 'เสร็จสิ้น' && (
              <Col span={24}>
                {/* <Form.Item
                  name="daily_report_file"
                  label="อัปโหลดไฟล์ประจำวัน"
                  rules={[{ required: true, message: 'กรุณาอัปโหลดไฟล์ หากต้องการบันทึกสถานะเสร็จสิ้น' }]}
                >
                  <MultipleFileUpload form={form} bucketName="report" fieldName="daily_report_file" />
                </Form.Item> */}
                <Form.Item name="completed_status_detail" label="กรุณาระบุผลการดำเนินงาน">
                  <Input placeholder="กรอกผลการดำเนินงาน" />
                </Form.Item>
              </Col>
            )}
          </Row>
        </Form>
        <Col className="gx-mt-3" span="24" align="end">
          <Button className="gx-mr-2" onClick={handleCancel}>
            ยกเลิก
          </Button>
          <Button onClick={handleOk} type="primary" loading={loadding}>
            ยืนยัน
          </Button>
        </Col>
      </Modal>
    </>
  );
};

export default UpdateStatus;
