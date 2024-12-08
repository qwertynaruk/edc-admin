import { DownOutlined } from '@ant-design/icons';
import { useToggle } from '@mantine/hooks';
import { Button, Card, Divider, Dropdown, Form, Menu, Typography } from 'antd';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import moment from 'moment';

import DialogNotification from 'components/shared-components/DialogNotification';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import {
  CmsBannerForm,
  CmsBannerPublishNowDialog,
  CmsBannerPublishScheduleDialog,
  PROVINCE_LIST,
  useCreateCmsBanner,
} from 'features/content-management-system';

const CmsCreatePage = () => {
  const [form] = Form.useForm();

  const [isOpenPublishNowDialog, toggleOpenPublishNowDialog] = useToggle();
  const [isOpenPublishScheduleDialog, toggleOpenPublishScheduleDialog] = useToggle();

  const onBack = () => navigate('../');

  const createCmsBanner = useCreateCmsBanner({
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

  const [urlSearchParams] = useSearchParams();

  const navigate = useNavigate();

  useEffect(() => {
    const type = urlSearchParams.get('type') ?? 'content';
    form.setFieldsValue({
      banner_type: type,
    });
  }, []);

  const onCreate = async (key, schedule) => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      const provinceList = PROVINCE_LIST.filter((province) => province?.name_en === values?.province_list);

      const isGlobal = values?.province_list === 'global';

      const data = {
        ...values,
        status: key === 'publisher' ? 'เผยแพร่' : 'ฉบับร่าง',
        publish_date_str: schedule ?? null,
        save_type: key,
        is_global: isGlobal,
        province_list: provinceList,
      };
      createCmsBanner.submit(data);
    } catch (error) {
      console.error(error);
    }
  };

  const onToggleCreate = async (key) => {
    try {
      await form.validateFields();
      if (key === 'publisher') {
        toggleOpenPublishNowDialog();
      } else if (key === 'publish_at') {
        toggleOpenPublishScheduleDialog();
      } else {
        onCreate('draft');
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
          subpath: 'เพิ่มแบนเนอร์',
        }}
      />
      <Card>
        <Typography.Title
          level={4}
          style={{
            marginBottom: 24,
          }}
        >
          เพิ่มแบนเนอร์
        </Typography.Title>
        <CmsBannerForm form={form} />
        <Divider />
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
            loading={createCmsBanner.isLoading && (!isOpenPublishNowDialog || !isOpenPublishScheduleDialog)}
            onClick={() => onToggleCreate('draft')}
            overlay={
              <Menu onClick={({ key }) => onToggleCreate(key)}>
                <Menu.Item key="publisher">เผยแพร่ทันที</Menu.Item>
                <Menu.Item key="publish_at">กำหนดวันเผยแพร่</Menu.Item>
                <Menu.Item key="draft">บันทึกฉบับร่าง</Menu.Item>
              </Menu>
            }
          >
            บันทึกฉบับร่าง
          </Dropdown.Button>
        </div>
      </Card>
      <CmsBannerPublishNowDialog
        open={isOpenPublishNowDialog}
        onClose={() => toggleOpenPublishNowDialog()}
        okButtonProps={{
          onClick: () => onCreate('publisher'),
          loading: createCmsBanner.isLoading && isOpenPublishNowDialog,
        }}
      />
      <CmsBannerPublishScheduleDialog
        open={isOpenPublishScheduleDialog}
        onClose={() => toggleOpenPublishScheduleDialog()}
        okButtonProps={{
          onClick: (schedule) => onCreate('publish_at', schedule),
          loading: createCmsBanner.isLoading && isOpenPublishScheduleDialog,
        }}
      />
    </>
  );
};

export default CmsCreatePage;
