import { Button, Card, Col, Divider, Form, Input, Row, Select, Typography } from 'antd';
import { useMutation, useQuery } from '@tanstack/react-query';

import DialogNotification from 'components/shared-components/DialogNotification';
import Flex from 'components/shared-components/Flex';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import UserStore from 'mobx/UserStore';
import _ from 'lodash';
import fetchMaster from 'axios/FetchMaster';
import { sanitizeService } from 'utils/serviceHelper';
import styled from '@emotion/styled';
import { useGetChannelList } from 'features/mass-notification/hooks';
import { useMemo } from 'react';
import useOneforce from 'hooks/use-oneforce';

const massNotification = sanitizeService(fetchMaster.notification);

const SelectCustomStyle = styled(Select)({
  '.ant-select-selection-item-remove': {
    marginTop: '0 !important',
  },
});

const CitizenTestPage = () => {
  const [form] = Form.useForm();
  const { onlyNumber, validatePhoneNumber } = useOneforce({ form });
  const chooseUser = Form.useWatch('user', form);

  const { user } = UserStore;

  const { data: channelData } = useGetChannelList();

  function GetCategoryList(props) {
    return useQuery({
      queryKey: ['notification-category-list', props?.queryParams],
      enabled: !!user,
      queryFn: async () =>
        await massNotification({
          method: 'GET',
          url: '/notification/category/list',
          params: props?.queryParams,
        }),
      select: (response) => {
        return response?.response;
      },
    });
  }

  const mutation = useMutation({
    mutationFn: async (playload) => {
      return await massNotification({
        method: 'POST',
        url: '/notification/push_noti',
        data: playload,
        params: { id: chooseUser },
      });
    },
  });

  const { data: categoryResponse } = GetCategoryList({
    queryParams: {
      organization_id: user?.organization?._id,
    },
  });

  const titleOption = useMemo(() => {
    if (!_.isEmpty(categoryResponse?.data)) {
      return (categoryResponse?.data || []).map((rowData) => ({ value: rowData?.id, label: rowData?.name_th }));
    }
    return null;
  }, [categoryResponse]);

  const finishForm = async () => {
    await form.validateFields();
    const formDataInput = form.getFieldsValue();
    try {
      await mutation.mutateAsync(formDataInput);
      DialogNotification('success', 'บันทึกข้อมูลสำเร็จ');
    } catch (error) {
      const msgError = error?.response?.message || '';
      DialogNotification(
        'error',
        'มีบางอย่างผิดพลาด',
        msgError?.includes('accounts')
          ? `เบอร์โทร (${form.getFieldValue('phone_number')}) นี้ไม่มีอยู่ในระบบ`
          : 'กรุณาตรวจสอบความถูกต้องของข้อมูล'
      );
    }
  };

  return (
    <>
      <PageBreadcrumb
        pageLabel={{
          master: 'Mass Notification',
          subpath: 'เพิ่มข้อความแจ้งเตือน',
        }}
      />
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={24}>
          <Card>
            <Typography.Title level={4}>ข้อความสื่อสาร</Typography.Title>
            <Form form={form} layout="vertical" onFinish={finishForm}>
              <Row
                gutter={[12, 12]}
                style={{
                  flexDirection: 'row',
                }}
              >
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    name="noti_category_id"
                    label="ประเภทการเตือน"
                    rules={[
                      {
                        required: true,
                        message: 'กรุณาเลือกประเภทการเตือน',
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      placeholder="เลือกประเภทการเตือน"
                      options={titleOption}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    name="phone_number"
                    label="เบอร์โทร"
                    rules={[
                      {
                        required: true,
                        message: 'กรุณากรอกเบอร์โทร',
                      },
                      () => ({
                        validator: validatePhoneNumber,
                      }),
                    ]}
                    required
                    validateFirst
                  >
                    <Input onKeyDown={(event) => onlyNumber(event)} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24}>
                  <Form.Item
                    name="detail_message"
                    label="รายละเอียดข้อความ"
                    rules={[
                      {
                        required: true,
                        message: 'กรุณาระบุรายละเอียดข้อความ',
                      },
                    ]}
                  >
                    <Input.TextArea placeholder="รายละเอียดข้อความ"></Input.TextArea>
                  </Form.Item>
                  <Form.Item
                    name="address"
                    label="สถานที่"
                    rules={[
                      {
                        required: true,
                        message: 'กรุณาระบุสถานที่',
                      },
                    ]}
                  >
                    <Input.TextArea />
                  </Form.Item>
                  <Form.Item
                    name="channels"
                    label="ช่องทางการสื่อสาร"
                    rules={[
                      {
                        required: true,
                        message: 'กรุณาระบุช่องทางการสื่อสาร',
                      },
                    ]}
                  >
                    <SelectCustomStyle mode="multiple" allowClear options={channelData} />
                  </Form.Item>
                </Col>
              </Row>
              <Divider />
              <Flex justifyContent="end">
                <Button loading={mutation.isPending}>ยกเลิก</Button>
                <Button loading={mutation.isPending} type="primary" onClick={() => form.submit()}>
                  เผยแผร่
                </Button>
              </Flex>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CitizenTestPage;
