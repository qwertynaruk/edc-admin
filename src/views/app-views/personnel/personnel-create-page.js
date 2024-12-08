import { Button, Card, Form, notification } from 'antd';
import { PersonnelAccessToProvincesSetting, PersonnelForm, useCreatePersonnel } from 'features/personnel';

import Flex from 'components/shared-components/Flex';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import UserStore from 'mobx/UserStore';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const PersonnelCreatePage = () => {
  const navigate = useNavigate();
  const { selectBranch } = UserStore;

  const onBack = () => navigate('../');

  const createPersonnel = useCreatePersonnel({
    onSuccess: () => {
      notification.success({
        message: 'สำเร็จ',
        description: 'ข้อมูลกำลังพลถูกบันทึกเรียบร้อยแล้ว',
      });
      navigate('../');
    },
  });

  const [form] = Form.useForm();
  const [selectedPersonnelProvinces, setSelectedPersonnelProvinces] = useState([]);

  const handleCreatePersonnel = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      const payload = {
        ...values,
        prefix_name: values?.prefix_name_en ?? '',
        first_name: values?.first_name_en ?? '',
        last_name: values?.last_name_en ?? '',
        personnel_provinces: selectedPersonnelProvinces,
      };
      if (_.isEmpty(values?.image_url)) {
        delete payload.image_url;
      }
      createPersonnel.submit(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const currentBranch = selectBranch?.chooseBranch?.value;

  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'กำลังพล', subpath: 'สร้างกำลังพล' }} />
      <Card>
        <PersonnelForm form={form} />
        {currentBranch !== 'global' && (
          <Flex
            justifyContent="end"
            className="gx-mt-4"
            style={{
              gap: 8,
            }}
          >
            <Button onClick={onBack}>ยกเลิก</Button>
            <Button type="primary" loading={createPersonnel.isLoading} onClick={handleCreatePersonnel}>
              บันทึก
            </Button>
          </Flex>
        )}
      </Card>
      {currentBranch === 'global' && (
        <PersonnelAccessToProvincesSetting
          selected={selectedPersonnelProvinces}
          onSelectedChange={setSelectedPersonnelProvinces}
          footer={
            <Flex
              justifyContent="end"
              className="gx-mt-4"
              style={{
                gap: 8,
              }}
            >
              <Button onClick={onBack}>ยกเลิก</Button>
              <Button type="primary" loading={createPersonnel.isLoading} onClick={handleCreatePersonnel}>
                บันทึก
              </Button>
            </Flex>
          }
        />
      )}
    </>
  );
};

export default PersonnelCreatePage;
