import { useGetDetailRoles, useUpdateRoles } from 'features/role-management/hooks';
import { useNavigate, useParams } from 'react-router-dom';

import DialogNotification from 'components/shared-components/DialogNotification';
import { Form } from 'antd';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import RolesForm from 'features/role-management/components/roles-form';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import usePopup from 'hooks/usePopup';
import useUser from 'hooks/services/useUser';

const RoleEdit = (props) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { organizations } = useUser();
  const { id } = useParams();

  const { data, isLoading } = useGetDetailRoles({ id });

  const [fireConfirm] = usePopup({
    onConfirm: () => {
      navigate(-1);
    },
  });

  const onCancel = () => {
    if (form.isFieldsTouched()) {
      fireConfirm();
    }
    navigate(-1);
  };

  const { mutate, isPending } = useUpdateRoles({
    id,
    onSuccess: () => {
      DialogNotification('success', 'แก้ไขสิทธิ์การใช้งานสำเร็จ');
      // navigate('/app/setting/role');
    },
    onError: () => {
      DialogNotification('error', 'แก้ไขสิทธิ์การใช้งานไม่สำเร็จ');
    },
  });

  const onSubmit = (values) => {
    const payload = {
      organization_id: organizations._id,
      ...values,
    };

    mutate(payload);
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data, form]);

  return (
    <>
      <PageBreadcrumb
        history={history}
        pageLabel={{
          subpath: [
            {
              url: '/app/setting/role',
              pathName: 'สิทธิ์การใช้งาน',
            },
            {
              pathName: 'แก้ไขสิทธิ์การใช้งาน',
            },
          ],
        }}
      />
      <RolesForm
        form={form}
        items={data}
        loading={isPending || isLoading}
        formType="update"
        onCancel={onCancel}
        onSubmit={onSubmit}
        {...props}
      />
    </>
  );
};

export default observer(RoleEdit);
