import { Button, Card, Form, Skeleton, notification } from 'antd';
import {
  PersonnelAccessToProvincesSetting,
  PersonnelForm,
  useGetPersonnel,
  useUpdatePersonnel,
} from 'features/personnel';
import { calculateAge, checkIsvalidTime } from 'utils/DateHelper';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FallbackError } from 'components/util-components/fallback-error';
import Flex from 'components/shared-components/Flex';
import { GuardHandlesV2 } from 'components/shared-components/Guarded';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import UserStore from 'mobx/UserStore';
import _ from 'lodash';
import dayjs from 'dayjs';
import moment from 'moment';

const updateLocale = require('dayjs/plugin/updateLocale');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(updateLocale);
dayjs.extend(relativeTime);

dayjs.updateLocale('en', {
  relativeTime: {
    yy: '%d',
  },
});

const PersonnelUpdatePage = () => {
  const { id } = useParams();
  const { canUpdate } = GuardHandlesV2({ group: 'Personnel', type: 'กำลังพล' });

  const navigate = useNavigate();
  const { selectBranch } = UserStore;

  const onBack = () => navigate('../');

  const { data, isLoading, isError } = useGetPersonnel(id);

  const updatePersonnel = useUpdatePersonnel({
    personnelId: id,
    onSuccess: () => {
      notification.success({
        message: 'สำเร็จ',
        description: 'ข้อมูลกำลังพลถูกบันทึกเรียบร้อยแล้ว',
      });
      onBack();
    },
  });

  const [form] = Form.useForm();
  const [selectedPersonnelProvinces, setSelectedPersonnelProvinces] = useState([]);

  useEffect(() => {
    if (data) {
      const birthDay = checkIsvalidTime(data?.birth_day, 'YYYY-MM-DD');
      form.setFieldsValue({
        ...data,
        birth_day: birthDay ? moment(birthDay) : undefined,
        age: birthDay ? calculateAge(birthDay) : undefined,
      });
      setSelectedPersonnelProvinces(data?.personnel_provinces ?? []);
    }
  }, [data]);

  if (isError) {
    return <FallbackError />;
  }

  if (isLoading) {
    return <Skeleton active />;
  }

  const handleUpdatePersonnel = async () => {
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
      updatePersonnel.submit(payload);
    } catch (error) {
      console.log('error', error);
    }
  };

  const currentBranch = selectBranch?.chooseBranch?.value;

  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'กำลังพล', subpath: 'แก้ไขกำลังพล' }} />
      <Card>
        <PersonnelForm form={form} showPasswordField={false} personnelId={id} />
        {currentBranch !== 'global' && canUpdate && (
          <Flex
            justifyContent="end"
            className="gx-mt-4"
            style={{
              gap: 8,
            }}
          >
            <Button onClick={onBack}>ยกเลิก</Button>
            <Button type="primary" loading={updatePersonnel.isLoading} onClick={handleUpdatePersonnel}>
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
              <Button type="primary" loading={updatePersonnel.isLoading} onClick={handleUpdatePersonnel}>
                บันทึก
              </Button>
            </Flex>
          }
        />
      )}
    </>
  );
};

export default PersonnelUpdatePage;
