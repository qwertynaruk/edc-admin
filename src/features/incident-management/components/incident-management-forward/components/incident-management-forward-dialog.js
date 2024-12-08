import { Form, Input, Modal, TreeSelect } from 'antd';

import CloudConstant from 'constants/CloudConstant';
import DialogNotification from 'components/shared-components/DialogNotification';
import { INCIDENT_REPORT_PREFIX_PATH } from 'configs/AppConfig';
import PersonnelService from 'services/PersonelService';
import ReportService from 'services/ReportServices';
import UserStore from 'mobx/UserStore';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export const IncidentManagementForwardDialog = ({ incidentId, open, onClose, data }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const user = UserStore;

  const { data: organization } = PersonnelService.useGetOrgnanization();
  const { data: organizationTreeList, isLoading } = PersonnelService.useGetOrgnanizationTree({
    queryParams: { organization: user?.selectBranch?.chooseBranch?.value },
  });

  const {
    mutate,
    isPending,
    data: resDataUpdate,
  } = ReportService.useUpdateForwardReport({
    queryParams: {
      report_id: incidentId,
    },
  });

  const {
    mutate: mutateStatus,
    isPending: isLoadingStatus,
    // data: resDataUpdate,
  } = ReportService.useUpdateReportStatus({
    queryParams: {
      report_id: incidentId,
    },
  });

  const organizationList = useMemo(() => {
    return (organization?.data || [])
      .filter((rowData) => rowData?.role !== 'province')
      .filter((rowData) => rowData?.id !== user?.organization?._id || rowData?._id !== user?.organization?._id)
      .map((rowData, index) => ({
        key: index,
        label: rowData?.full_name_th?.toString() ?? '',
        value: rowData?.id?.toString() || rowData?._id?.toString(),
        full_name_th: rowData?.full_name_th,
        full_name_en: rowData?.full_name_en,
        short_name_th: rowData?.short_name_th,
        short_name_en: rowData?.short_name_en,
      }));
  }, [organization?.data, user?.organization]);

  const mapData = useMemo(() => {
    const mapDataChildren = (dataSourceChildren = []) => {
      return dataSourceChildren.map((dataChild) => {
        return {
          key: dataChild?.id?.toString() || dataChild?._id?.toString(),
          value: dataChild?.id?.toString() || dataChild?._id?.toString(),
          label: dataChild?.full_name_th?.toString() ?? '',
          full_name_th: dataChild?.full_name_th,
          full_name_en: dataChild?.full_name_en,
          short_name_th: dataChild?.short_name_th,
          short_name_en: dataChild?.short_name_en,
          children:
            dataChild?.is_children || (dataChild.children || []).length > 0
              ? mapDataChildren(dataChild.children)
              : null,
        };
      });
    };

    return (organizationTreeList = {}) => {
      return [
        {
          key: organizationTreeList?.id?.toString() || organizationTreeList?._id?.toString(),
          value: organizationTreeList?.id?.toString() || organizationTreeList?._id?.toString(),
          label: organizationTreeList?.full_name_th?.toString() ?? '',
          full_name_th: organizationTreeList?.full_name_th,
          full_name_en: organizationTreeList?.full_name_en,
          short_name_th: organizationTreeList?.short_name_th,
          short_name_en: organizationTreeList?.short_name_en,
          children:
            organizationTreeList?.is_children || (organizationTreeList?.children || []).length > 0
              ? mapDataChildren(organizationTreeList.children)
              : undefined,
        },
      ];
    };
  }, []);

  const organizationListV2 = useMemo(() => {
    return mapData(organizationTreeList || []);
  }, [organizationTreeList]);

  const onSubmit = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      const payload = {
        report_id: incidentId,
        organization_id: values?.department,
        reason: values?.reason,
      };
      mutate(payload, {
        onSuccess: async () => {
          const payload = {
            update_type: 'report_status',
            // status_reason: data?.report_detail?.group_type_name,
            group_type_name: data?.report_detail?.group_type_name,
            type_name: data?.report_detail?.type_name,
            state: CloudConstant.WEBFORM_REQUEST_STATUS[1].value,
          };
          await mutateStatus(payload);
          DialogNotification('success', 'สำเร็จ', 'ส่งต่องานเรียบร้อยแล้ว');
          navigate(INCIDENT_REPORT_PREFIX_PATH);
        },
        onError: (error) => {
          DialogNotification('error', 'ส่งต่องานไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
          console.log('error', error);
        },
      });
      onClose?.();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal title="ส่งงานต่อ" visible={open} onCancel={onClose} centered onOk={onSubmit} afterClose={form.resetFields}>
      <Form layout="vertical" form={form}>
        <Form.Item label="เลือกหน่วยงาน" name="department" rules={[{ required: true, message: 'กรุณาเลือกหน่วยงาน' }]}>
          {/* <Select
            placeholder="เลือกหน่วยงาน"
            allowClear
            showSearch
            filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            options={organizationList}
          /> */}
          <TreeSelect
            style={{ width: '100%' }}
            placeholder="เลือกหน่วยงาน"
            allowClear
            treeDefaultExpandAll
            treeData={organizationListV2?.[0]?.children}
          />
        </Form.Item>
        <Form.Item label="เหตุผล" name="reason" rules={[{ required: true, message: 'กรุณากรอกเหตุผล' }]}>
          <Input.TextArea placeholder="กรุณากรอกเหตุผล" rows={5} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
