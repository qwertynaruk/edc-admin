import { Button, Form, Select, Space, Table } from 'antd';
import DialogNotification from 'components/shared-components/DialogNotification';
import EvidenceStorageSelectWidget from 'components/shared-components/EvidenceStorageSelectWidget';
import { PROPERTY_DISPLAY_TYPE } from 'constants/ObjectContant';
import _ from 'lodash';
import ReportStore from 'mobx/ReportStore';
import { useEffect, useState } from 'react';
import FormPreference from 'utils/FormPreference';

const { Option } = Select;

const PropertiesEvidenceForm = ({ loading = false, onFinish, onBackEvent, forceRawDataSource, forcePersonSource }) => {
  const { reportItems = {} } = ReportStore;
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [personSource, setPersonSource] = useState([]);

  useEffect(() => {
    const newAllProperties = forceRawDataSource.map((el, _index) => ({
      key: _index,
      property_type: PROPERTY_DISPLAY_TYPE[_.get(el, 'asset_type', 'vehicle')],
      property_description: getByDescription(el),
      property_quantity: [_.get(el, 'quantity', 1), _.get(el, 'unit', 'คัน')].join(' '),
      created_at: '-',
      // created_at: columnDateRender(_.get(el, 'created_at', '-')),
      property_owner: '',
      property_storage: '',
    }));

    setDataSource(newAllProperties);
    setPersonSource(forcePersonSource);
  }, [forcePersonSource, forceRawDataSource, reportItems]);

  const uniqByKeepLast = (a, key) => {
    return [...new Map(a.map((x) => [key(x), x])).values()];
  };

  const getByDescription = (ss) =>
    ss.detail ||
    [_.get(ss, 'regis_character', '-'), _.get(ss, 'regis_number', '-'), _.get(ss, 'province', '-')].join(' ');

  const columns = [
    {
      title: 'สถานที่จัดเก็บ',
      dataIndex: 'property_storage',
      render: (text, record, _index) => defineField.storageSelect(_index),
    },
    {
      title: 'ประเภททรัพย์สิน',
      dataIndex: 'property_type',
    },
    {
      title: 'รายละเอียดทรัพย์สิน',
      dataIndex: 'property_description',
    },
    {
      title: 'จำนวน',
      dataIndex: 'property_quantity',
    },
    // {
    //   title: 'วันที่ได้รับทรัพย์สิน',
    //   dataIndex: 'created_at',
    // },
    {
      title: 'เจ้าของทรัพย์สิน',
      dataIndex: 'property_owner',
      render: (text, record, _index) => defineField.personSelect(_index),
    },
  ];

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const defineField = {
    personSelect: (_index) => {
      const disabledField = !selectedRowKeys.includes(_index);
      return (
        <Form.Item
          name={[_index, 'property_owner']}
          className="gx-mb-0"
          rules={[{ required: !disabledField, message: 'กรุณาเลือกเจ้าของทรัพย์สิน' }]}
        >
          <Select placeholder="เลือกเจ้าของทรัพย์สิน" disabled={disabledField}>
            {uniqByKeepLast(personSource, (ss) => ss._id).map((ss, _key) => (
              <Option key={_key} value={JSON.stringify(ss)}>
                {ss.is_juristic ? ss.juristic_name : <FormPreference.ComplexFullname payload={ss} />}
              </Option>
            ))}
          </Select>
        </Form.Item>
      );
    },
    storageSelect: (_index) => {
      const disabledField = !selectedRowKeys.includes(_index);
      return (
        <Form.Item
          name={[_index, 'property_storage']}
          className="gx-mb-0"
          rules={[{ required: !disabledField, message: 'กรุณาเลือกสถานที่จัดเก็บ' }]}
        >
          <EvidenceStorageSelectWidget disabled={disabledField} placeholder="เลือกสถานที่จัดเก็บ" />
        </Form.Item>
      );
    },
  };

  const onSubmitForm = (values) => {
    if (selectedRowKeys.length <= 0) {
      DialogNotification('warning', 'ไม่สามารถดำเนินรายการได้', 'กรุณาเลือกรายการอย่างน้อย 1 รายการ');
      return;
    }

    const joinData = forceRawDataSource.map((ss, _index) => ({
      ...ss,
      ...values[_index],
      property_owner: JSON.parse(_.get(values[_index], 'property_owner', null)),
    }));

    const payload = {
      evidence_account: joinData.filter((_, _index) => selectedRowKeys.includes(_index)),
    };

    onFinish(payload);
  };

  return (
    <Form form={form} layout="vertical" onFinish={onSubmitForm}>
      <Table rowSelection={rowSelection} columns={columns} dataSource={dataSource} size="small" loading={loading} />

      <Space className="gx-full-width gx-flex-end gx-mt-4">
        <Button key="cancel" onClick={() => onBackEvent()}>
          ย้อนกลับ
        </Button>
        <Button loading={loading} key="save" type="primary" onClick={() => form.submit()}>
          ถัดไป
        </Button>
      </Space>
    </Form>
  );
};

export default PropertiesEvidenceForm;
