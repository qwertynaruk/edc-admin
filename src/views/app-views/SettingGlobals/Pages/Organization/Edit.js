import { FIX_FIND_REDIRECT_PATH, FIX_FIND_REDIRECT_PATH_SUCCESS } from 'constants/OrganizationConstant';
import { Form, Skeleton, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import AreaPolygonPage from '../AreaOfResposibility/AreaPolygon';
import CardTab from 'components/shared-components/CardTab';
import DialogNotification from 'components/shared-components/DialogNotification';
import FormOrganization from './Components/FormOrganization';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import PersonnelService from 'services/PersonelService';
import UserStore from 'mobx/UserStore';
import _ from 'lodash';
import { dataSettingList } from '../MenuPanel';
import fetchMaster from 'axios/FetchMaster';
import { sanitizeService } from 'utils/serviceHelper';
import { useMutation } from '@tanstack/react-query';

const personnel = sanitizeService(fetchMaster.personnel);

const OrganizationEdit = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  if (_.isEmpty(location?.state)) {
    window.location.href = FIX_FIND_REDIRECT_PATH_SUCCESS;
  }

  const [loaddingTab, setLoaddingTab] = useState(false);

  const [form] = Form.useForm();
  const { organization, selectBranch } = UserStore;
  const { key: organizationID, level: orgLevel, organizationLv1 = null, organizationLv2 = null } = location.state || {};

  useEffect(() => {
    if (organizationLv1) {
      form.setFieldsValue({
        organization_lv1: organizationLv1,
        organization_lv2: organizationLv2,
      });
    }
  }, [organizationLv1]);

  const { data, isLoading } = PersonnelService.useGetOrgnanizationById({
    queryParams: { _id: organizationID },
  });

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
        id: data?._id || data?.id,
      });
    }
  }, [data]);

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (body) => {
      console.log('body?.id', body?.payload?.id);
      await personnel({
        method: 'PUT',
        url: `/organization_info?_id=${body?.payload?.id}`,
        data: body?.payload,
      });
    },
    onSuccess() {
      DialogNotification('success', 'อัปเดตข้อมูลสำเร็จ');
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

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onFinish = (values) => {
    const payload = {
      ...values,
      parent_id: data?.parent_id || '',
      id: data?._id || data?.id,
    };

    mutate(
      { payload },
      {
        onSuccess: () => {
          const findPath = dataSettingList.find((rowData) => rowData.route === FIX_FIND_REDIRECT_PATH);
          if (findPath) {
            navigate(FIX_FIND_REDIRECT_PATH_SUCCESS);
          }
        },
      }
    );
  };

  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'ตัวจัดการองค์กร', subpath: 'แก้ไของค์กร' }} />
      {isLoading ? (
        <Skeleton active />
      ) : (
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
                  />
                </>
              ),
            },
            {
              key: 'tab2',
              tab: 'แผนที่แสดงพื้นที่รับผิดชอบ',
              children: (
                <>
                  <AreaPolygonPage organizationID={organizationID} />
                </>
              ),
            },
          ]}
        />
      )}
      {loaddingTab && (
        <div style={{ position: 'absolute', top: '50%', left: '50%' }}>
          <Spin size="large" />
        </div>
      )}
    </>
  );
};

export default OrganizationEdit;
