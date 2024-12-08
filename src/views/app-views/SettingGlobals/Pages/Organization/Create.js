import { FIX_FIND_REDIRECT_PATH, FIX_FIND_REDIRECT_PATH_SUCCESS } from 'constants/OrganizationConstant';
import { useLocation, useNavigate } from 'react-router-dom';

import CardTab from 'components/shared-components/CardTab';
import DialogNotification from 'components/shared-components/DialogNotification';
import { Form } from 'antd';
import FormOrganization from './Components/FormOrganization';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import UserStore from 'mobx/UserStore';
import _ from 'lodash';
import { dataSettingList } from '../MenuPanel';
import fetchMaster from 'axios/FetchMaster';
import { sanitizeService } from 'utils/serviceHelper';
import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';

const personnel = sanitizeService(fetchMaster.personnel);

const OrganizationCreate = (props) => {
  const location = useLocation();
  if (_.isEmpty(location?.state)) {
    window.location.href = FIX_FIND_REDIRECT_PATH_SUCCESS;
  }
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { organization, selectBranch } = UserStore;

  const {
    key: formOrganizationID,
    level: orgLevel,
    organizationLv1 = null,
    organizationLv2 = null,
  } = location.state || {};

  useEffect(() => {
    if (organizationLv1) {
      form.setFieldsValue({
        organization_lv1: organizationLv1,
        organization_lv2: organizationLv2,
      });
    }
  }, [organizationLv1]);

  function CreateOranization(props) {
    return useMutation({
      mutationFn: async (body) =>
        await personnel({
          method: 'POST',
          url: '/organization_info',
          data: body,
        }),
      onSuccess() {
        DialogNotification('success', 'เพิ่มข้อมูลสำเร็จ');
      },
      onError(value) {
        if (
          value?.response?.error_code === 'VALIDATION_ERROR' &&
          value?.response.error_message === 'Organization Info is exit'
        ) {
          DialogNotification('error', 'ชื่อนี้มีแล้ว');
        } else {
          DialogNotification('error', 'อัปเดตรายการไม่สำเร็จ');
        }
      },
    });
  }

  const { mutate, isPending, error } = CreateOranization();

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onFinish = (values) => {
    const payload = {
      ...values,
      parent_id: formOrganizationID,
      polygons: [],
      db_name: organization?.db_name,
    };
    mutate(payload, {
      onSuccess: () => {
        const findPath = dataSettingList.find((rowData) => rowData.route === FIX_FIND_REDIRECT_PATH);
        if (findPath) {
          navigate(FIX_FIND_REDIRECT_PATH_SUCCESS);
        }
      },
    });
  };

  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'ตัวจัดการองค์กร', subpath: 'สร้างองค์กร' }} />
      <CardTab
        isCustom
        tabList={[
          {
            key: 'tab1',
            tab: 'ข้อมูลหน่วยงาน/องค์กร',
            children: (
              <>
                <FormOrganization
                  form={form}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  isOrganizationLv1={organizationLv1}
                  isOrganizationLv2={organizationLv2}
                  isLoadingButton={isPending}
                  error={error}
                  // isOrganizationLv2={
                  //   orgLevel + 1 >= FIX_LEVEL.REGION?.level && orgLevel !== FIX_LEVEL.ORGANIZATION?.level
                  // }
                />
              </>
            ),
          },
          // {
          //   key: 'tab2',
          //   tab: 'ผู้ใช้งาน',
          //   children: (
          //     <>
          //       <TableUserOrganization />
          //     </>
          //   ),
          // },
        ]}
      />
    </>
  );
};

export default OrganizationCreate;
