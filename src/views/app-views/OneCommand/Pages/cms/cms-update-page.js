import { Button, Card, Divider, Dropdown, Form, Menu, Typography } from 'antd';
import {
  CmsBannerForm,
  CmsBannerPublishNowDialog,
  CmsBannerPublishScheduleDialog,
  PROVINCE_LIST,
  useGetCmsBanner,
  useUpdateCmsBanner,
} from 'features/content-management-system';
import { useNavigate, useParams } from 'react-router-dom';

import DialogNotification from 'components/shared-components/DialogNotification';
import { DownOutlined } from '@ant-design/icons';
import { GuardHandlesV2 } from 'components/shared-components/Guarded';
import Loading from 'components/shared-components/Loading';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import moment from 'moment/moment';
import { useEffect } from 'react';
import { useToggle } from '@mantine/hooks';

const CmsUpdatePage = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { canUpdate } = GuardHandlesV2({ group: 'One Command', type: 'Content Management System' });

  const [isOpenPublishNowDialog, toggleOpenPublishNowDialog] = useToggle();
  const [isOpenPublishScheduleDialog, toggleOpenPublishScheduleDialog] = useToggle();

  const onBack = () => navigate('/app/one-command/cms');

  const { data, isLoading } = useGetCmsBanner(id);

  const bannerData = data?.data;

  const updateCmsBanner = useUpdateCmsBanner({
    bannerId: id,
    onSuccess: () => {
      if (isOpenPublishNowDialog) {
        toggleOpenPublishNowDialog();
      }
      if (isOpenPublishScheduleDialog) {
        toggleOpenPublishScheduleDialog();
      }
      DialogNotification('success', 'สำเร็จ', `เวลา ${moment().format('LT ll')}`);
      onBack();
    },
  });

  useEffect(() => {
    form.setFieldsValue({
      ...bannerData,
      province_list: bannerData?.province_list?.[0]?.name_en,
    });
  }, [bannerData, form]);

  if (isLoading) {
    return <Loading cover="content" />;
  }

  const onUpdate = async (key, schedule) => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      const provinceList = PROVINCE_LIST.filter((province) => province?.name_en === values?.province_list);

      const isGlobal = values?.province_list === 'global';

      const data = {
        ...bannerData,
        ...values,
        status: key === 'publisher' ? 'เผยแพร่' : 'ฉบับร่าง',
        publish_date_str: schedule ?? null,
        save_type: key,
        is_global: isGlobal,
        province_list: provinceList,
      };
      updateCmsBanner.submit(data);
    } catch (error) {
      console.error(error);
    }
  };

  const onToggleUpdate = async (key) => {
    try {
      await form.validateFields();
      if (key === 'publisher') {
        toggleOpenPublishNowDialog();
      } else if (key === 'publish_at') {
        toggleOpenPublishScheduleDialog();
      } else {
        onUpdate('draft');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <PageBreadcrumb
        pageLabel={{
          master: 'Content Management System',
          subpath: 'แก้ไขแบนเนอร์',
        }}
      />
      <Card>
        <Typography.Title
          level={4}
          style={{
            marginBottom: 24,
          }}
        >
          แก้ไขแบนเนอร์
        </Typography.Title>
        <CmsBannerForm form={form} />
        {canUpdate && <Divider />}
        {canUpdate && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'end',
              gap: 5,
            }}
          >
            <Button onClick={onBack}>ยกเลิก</Button>
            <Dropdown.Button
              type="primary"
              icon={<DownOutlined />}
              placement="topRight"
              loading={updateCmsBanner.isLoading && (!isOpenPublishNowDialog || !isOpenPublishScheduleDialog)}
              onClick={() => onToggleUpdate('draft')}
              overlay={
                <Menu onClick={({ key }) => onToggleUpdate(key)}>
                  <Menu.Item key="publisher">เผยแพร่ทันที</Menu.Item>
                  <Menu.Item key="publish_at">กำหนดวันเผยแพร่</Menu.Item>
                  <Menu.Item key="draft">บันทึกฉบับร่าง</Menu.Item>
                </Menu>
              }
            >
              บันทึกฉบับร่าง
            </Dropdown.Button>
          </div>
        )}
      </Card>
      <CmsBannerPublishNowDialog
        open={isOpenPublishNowDialog}
        onClose={() => toggleOpenPublishNowDialog()}
        okButtonProps={{
          onClick: () => onUpdate('publisher'),
          loading: updateCmsBanner.isLoading && isOpenPublishNowDialog,
        }}
      />
      <CmsBannerPublishScheduleDialog
        open={isOpenPublishScheduleDialog}
        onClose={() => toggleOpenPublishScheduleDialog()}
        okButtonProps={{
          onClick: (schedule) => onUpdate('publish_at', schedule),
          loading: updateCmsBanner.isLoading && isOpenPublishScheduleDialog,
        }}
      />
    </>
  );
};

export default CmsUpdatePage;
