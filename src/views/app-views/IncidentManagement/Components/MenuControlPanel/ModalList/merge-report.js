import { SearchOutlined } from '@ant-design/icons';
import { Button, Card, Dropdown, Form, Input, Menu, Modal, Space, Spin, Typography } from 'antd';
import DialogNotification from 'components/shared-components/DialogNotification';
import Flex from 'components/shared-components/Flex';
import MasterSelectWidget from 'components/shared-components/MasterSelectWidget';
import _ from 'lodash';
import ReportStore from 'mobx/ReportStore';
import { useEffect, useState } from 'react';
import { renderDateTime } from 'utils/stringRender';
import InsertCaseReportTable from 'views/app-views/CaseManagement/Components/InsertCaseReportTable';

const MergeReport = ({
  visible,
  setVisible,
  origin = 'report',
  originSource = null,
  teamSource = null,
  afterSuccess = () => {},
}) => {
  const { reportItems } = ReportStore;
  const [form] = Form.useForm();
  const [itemLoading, setItemLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [itemSelected, setItemSelected] = useState({});

  const [keywordSearch, setKeywordSearch] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTouchEvent, setSearchTouchEvent] = useState(false);
  const [searchList, setSearchList] = useState([]);
  const [searchSelectItems, setSearchSelectItems] = useState(null);

  useEffect(() => {
    if (visible) {
      setItemLoading(true);
      ReportStore.getAllReportList().finally(() => setItemLoading(false));
    }
  }, [visible]);

  const onDropEvents = () => {
    setKeywordSearch('');
    setSearchList([]);
  };

  const onExitModal = () => {
    setItemSelected({});
    setVisible(false);
    setSearchSelectItems(null);
    form.resetFields();

    onDropEvents();
  };

  const onChangeInputField = (values) => {
    setSearchTouchEvent(false);
    setKeywordSearch(values.target.value);
  };

  const onSearchRefInputField = () => {
    if (!keywordSearch || keywordSearch.length <= 0) {
      DialogNotification('warning', 'กรุณาระบุคำที่ต้องการค้นหา');
      return;
    }

    setSearchLoading(true);
    ReportStore.searchReport({
      value: keywordSearch,
    })
      .then((res) => {
        if (!res || res?.length <= 0) {
          DialogNotification('warning', 'ไม่พบผลลัพธ์จากการค้นหา');
        }

        setSearchTouchEvent(true);
        setSearchList(res);
      })
      .finally(() => setSearchLoading(false));
  };

  const onSelectItems = (menuSource) => {
    try {
      const investKey = menuSource?.key;
      const findInvest = _.find(searchList, (ss) => ss?.report_record_id === investKey);
      setSearchSelectItems(findInvest);
    } catch (error) {
      DialogNotification('error', 'ไม่สามารถเลือกรายการได้', 'กรุณาลองใหม่อีกครั้ง');
      setSearchSelectItems(null);
    } finally {
      onDropEvents();
    }
  };

  const onSubmitForm = (values) => {
    setFormLoading(true);
    const { related_by = '' } = values;
    const { _id = '' } = searchSelectItems;

    const originPayload = {
      report: {
        from_report: reportItems,
        to_report: [_id],
        related_by,
      },
      case: {
        from_case: originSource?.case,
        to_report: [_id],
        related_by,
      },
    };

    ReportStore.addReportByReport(originPayload[origin], origin)
      .then(() => {
        afterSuccess();
        onExitModal();
      })
      .finally(() => setFormLoading(false));
  };

  const ListingContentDOM = () => {
    return (
      <Flex flexDirection="column">
        {searchSelectItems && _.keys(searchSelectItems).length > 0 && (
          <Card className="gx-mb-0">
            <Spin spinning={formLoading}>
              <Space direction="vertical" className="gx-mb-3">
                <Typography.Text strong>รายงานที่เกี่ยวข้อง</Typography.Text>
                <Typography.Text>{searchSelectItems?.report_type_id?.name || '-'}</Typography.Text>
                <Space>
                  <Typography.Text style={{ color: '#ffffff66' }}>
                    หมายเลขรายงาน: {_.get(searchSelectItems, 'report_record_id', '-')}
                  </Typography.Text>
                  <Typography.Text style={{ color: '#ffffff66' }}>
                    เจ้าของรายงาน:{' '}
                    {searchSelectItems?.report_owner_id
                      ? [
                          searchSelectItems?.report_owner_id?.dominate_abbreviation,
                          searchSelectItems?.report_owner_id?.first_name,
                          searchSelectItems?.report_owner_id?.last_name,
                        ].join(' ')
                      : 'ไม่ได้ระบุชื่อ'}
                  </Typography.Text>
                </Space>
              </Space>
              <Form.Item
                name="related_by"
                label="เกี่ยวข้องโดย"
                rules={[{ required: true, message: 'กรุณาระบุความเกี่ยวข้องโดย' }]}
              >
                <MasterSelectWidget placeholder="ระบุความเกี่ยวข้องโดย" category={80} />
              </Form.Item>
            </Spin>
          </Card>
        )}

        {teamSource && (
          <Card className="gx-mt-3">
            <Spin spinning={formLoading}>
              <InsertCaseReportTable team={teamSource} form={form} />
            </Spin>
          </Card>
        )}
      </Flex>
    );
  };

  const handleForceData = searchList.length > 0 && keywordSearch && keywordSearch.length > 0;

  return (
    <Modal
      title="เพิ่มรายงานที่เกี่ยวข้อง"
      width={860}
      centered
      forceRender
      visible={visible}
      maskClosable={false}
      onCancel={onExitModal}
      footer={[
        <Button loading={formLoading} onClick={onExitModal} key="cancel">
          ยกเลิก
        </Button>,
        <Button loading={formLoading} key="save" type="primary" onClick={() => form.submit()}>
          บันทึก
        </Button>,
      ]}
    >
      <Space direction="vertical">
        <Typography.Text>ค้นหารายงาน</Typography.Text>
        <Dropdown
          overlay={
            <Menu
              items={searchList.map((ss) => ({
                key: ss?.report_record_id,
                label: (
                  <Space direction="vertical">
                    <Typography.Text strong>
                      {ss?.report_type_id?.group_type} |{' '}
                      {ss?.report_sequence_id
                        ? `${ss?.report_sequence_id} / ${renderDateTime(ss?.created_at)}`
                        : renderDateTime(ss?.created_at)}
                    </Typography.Text>

                    <Typography.Text style={{ color: '#ffffff66' }}>
                      หมายเลขรายงาน {ss?.report_record_id || '-'} {ss?.report_type_id?.name || '-'}{' '}
                      {ss?.report_owner_id &&
                        `เจ้าของรายงาน ${[
                          ss?.report_owner_id?.dominate_abbreviation,
                          ss?.report_owner_id?.first_name,
                          ss?.report_owner_id?.last_name,
                        ].join(' ')}`}
                    </Typography.Text>
                  </Space>
                ),
              }))}
              onClick={onSelectItems}
            />
          }
          visible={handleForceData}
        >
          <Input
            onChange={onChangeInputField}
            value={keywordSearch}
            onKeyDown={(e) => e.code === 'Enter' && onSearchRefInputField()}
            addonAfter={
              <Button ghost loading={searchLoading} icon={<SearchOutlined />} onClick={onSearchRefInputField}>
                ค้นหา
              </Button>
            }
            placeholder="ประเภทรายงาน, เจ้าของรายงาน, หมายเลขรายงาน, ลำดับรายงานเกี่ยวกับคดี"
          />
        </Dropdown>
      </Space>

      <Form form={form} layout="vertical" className="gx-mt-4" onFinish={onSubmitForm}>
        <ListingContentDOM />
      </Form>
    </Modal>
  );
};

export default MergeReport;
