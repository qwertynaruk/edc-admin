import DialogNotification from 'components/shared-components/DialogNotification';
import { Form } from 'antd';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import RolesForm from 'features/role-management/components/roles-form';
import { useCreateRoles } from 'features/role-management/hooks';
import { useNavigate } from 'react-router-dom';
import usePopup from 'hooks/usePopup';
import useUser from 'hooks/services/useUser';

const RoleCreate = (props) => {
  const navigate = useNavigate();
  const { organizations } = useUser();
  const [form] = Form.useForm();
  const [fireConfirm] = usePopup({
    onConfirm: () => {
      navigate(-1);
    },
  });

  const onCancel = () => {
    if (form.isFieldsTouched()) {
      fireConfirm();
      return;
    }
    navigate(-1);
  };

  const { mutate, isPending } = useCreateRoles({
    onSuccess: () => {
      DialogNotification('success', 'เพิ่มสิทธิ์การใช้งานสำเร็จ');
      navigate('/app/setting/role');
    },
    onError: () => {
      DialogNotification('error', 'เพิ่มสิทธิ์การใช้งานไม่สำเร็จ');
    },
  });

  const onSubmit = (values) => {
    mutate({
      organization_id: organizations._id,
      ...values,
    });
  };

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
              pathName: 'เพิ่มสิทธิ์การใช้งาน',
            },
          ],
        }}
      />
      <RolesForm form={form} loading={isPending} formType="create" onCancel={onCancel} onSubmit={onSubmit} {...props} />
    </>
  );
};

export default RoleCreate;
