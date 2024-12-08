import { Button, Card, Divider, Form, Select, Tag, Typography, notification } from 'antd';

import Flex from 'components/shared-components/Flex';
import { GuardHandlesV2 } from 'components/shared-components/Guarded';
import { INCIDENT_MANAGEMENT_STATUS_MATA } from '../../constants';
import { IncidentManagementChangeCancelStatusConfirmDialog } from '../incident-management-change-cancel-status-confirm-dialog';
import { IncidentManagementChangeCompleteStatusConfirmDialog } from '../incident-management-change-complete-status-confirm-dialog';
import { useChangeIncidentManagementStatus } from '../../api/change-incident-management-status';
import { useEffect } from 'react';
import { useToggle } from '@mantine/hooks';

export const IncidentManagementProcess = ({ incidentId, data, isLoading }) => {
  const { canUpdate } = GuardHandlesV2({ group: 'Incident Management', type: 'รายงานการแจ้งเหตุออนไลน์' });
  const { submit, ...changeIncidentManagementStatus } = useChangeIncidentManagementStatus({
    incidentId,
    onSuccess: () => {
      notification.success({
        message: 'สำเร็จ',
        description: 'บันทึกสถานะสำเร็จ',
      });
    },
  });

  const [isOpenChangeCompleteStatusDialog, toggleChangeCompleteStatusDialog] = useToggle();
  const [isOpenChangeCancelStatusDialog, toggleChangeCancelStatusDialog] = useToggle();

  const [form] = Form.useForm();

  const getStatusOptions = (status) => {
    const statusOptions = INCIDENT_MANAGEMENT_STATUS_MATA.map((statusMeta) => ({
      label: statusMeta.label,
      value: statusMeta.label,
      disabled: statusMeta.label === status || statusMeta.label === 'รอดำเนินการ',
    }));

    if (['เสร็จสิ้น', 'ยกเลิก'].includes(status)) {
      return [];
    }

    if (status === 'กำลังดำเนินการ') {
      return statusOptions.filter((option) => ['กำลังดำเนินการ', 'เสร็จสิ้น', 'ยกเลิก'].includes(option.label));
    }

    return statusOptions;
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        status: data.status,
      });
    }
  }, [data, form]);

  const onConfirmChangeStatus = async (status) => {
    try {
      await form.validateFields();
      const status = form.getFieldValue('status');
      if (status === 'เสร็จสิ้น') {
        toggleChangeCompleteStatusDialog();
        return;
      }
      if (status === 'ยกเลิก') {
        toggleChangeCancelStatusDialog();
        return;
      }

      submit({ status });
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <Card loading />;
  }

  if (['เสร็จสิ้น', 'ยกเลิก'].includes(data?.status)) {
    return (
      <Card
        title="การดำเนินการ"
        extra={
          <Tag
            color={data?.status === 'เสร็จสิ้น' ? 'success' : 'error'}
            className="gx-m-0"
            style={{
              borderRadius: 3,
              background: 'none',
              border: '1px solid',
            }}
          >
            {data?.status}
          </Tag>
        }
      >
        <Typography>
          <strong>เหตุผล : </strong>
          <span>{data?.status_reason}</span>
        </Typography>
      </Card>
    );
  }

  return (
    <>
      <Card title="การดำเนินการ">
        <Form
          form={form}
          layout="vertical"
          style={{
            margin: 0,
          }}
        >
          <Form.Item label="สถานะ" name="status">
            <Select options={getStatusOptions(data?.status)} />
          </Form.Item>
          <Divider />
          {canUpdate && (
            <Form.Item shouldUpdate={(prevValues, currentValues) => prevValues.status !== currentValues.status}>
              {({ getFieldValue }) => {
                const status = getFieldValue('status');

                return (
                  <Flex justifyContent="end">
                    <Button
                      type="primary"
                      style={{ marginLeft: 4 }}
                      onClick={onConfirmChangeStatus}
                      loading={changeIncidentManagementStatus.isLoading}
                      disabled={!status || status === data?.status}
                    >
                      บันทึก
                    </Button>
                  </Flex>
                );
              }}
            </Form.Item>
          )}
        </Form>
      </Card>
      <IncidentManagementChangeCancelStatusConfirmDialog
        open={isOpenChangeCancelStatusDialog}
        onClose={toggleChangeCancelStatusDialog}
        incidentId={incidentId}
      />
      <IncidentManagementChangeCompleteStatusConfirmDialog
        open={isOpenChangeCompleteStatusDialog}
        onClose={toggleChangeCompleteStatusDialog}
        incidentId={incidentId}
      />
    </>
  );
};
