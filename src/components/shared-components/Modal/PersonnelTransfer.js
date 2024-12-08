import { RightOutlined } from '@ant-design/icons';
import { Transfer as AntTransfer, Button, Modal, Space } from 'antd';
import usePersonnel from 'hooks/services/usePersonnel';
import produce from 'immer';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { renderPersonnelName } from 'utils/stringRender';

const TRANSFER_LIST_ITEM_SIZE = {
  width: 250,
  height: 300,
};

const Transfer = styled(AntTransfer)`
  .ant-transfer-list-header {
    display: none;
  }
  .ant-transfer-list-body {
    background: transparent !important;
  }
  .ant-transfer-list-content-item-checked {
    background: transparent !important;
  }
  .ant-transfer-list-content-item:not(.ant-transfer-list-content-item-disabled):hover {
    background: transparent !important;
  }
`;
const TransferTitle = styled.div`
  display: flex;
`;

const PersonnelTransfer = (props) => {
  const { data: personnel } = usePersonnel();
  const { visible, leftKeys } = props;
  const [state, setState] = useState({
    leftKeys: leftKeys || [],
    targetKeys: [],
    selectedKeys: [],
  });

  const onSubmit = () => {
    if (props.onSubmit) props.onSubmit(personnel.filter((item) => state.leftKeys.includes(item._id)));
    props.setVisible(false);
  };
  const onCancel = () => {
    if (props.onCancel) props.onCancel();
    props.setVisible(false);
  };

  const onChange = (nextTargetKeys, direction, moveKeys) => {
    setState(
      produce((draft) => {
        if (direction === 'left') {
          draft.leftKeys = Array.from(new Set([...draft.leftKeys, ...moveKeys]));
        }
        if (direction === 'right') {
          draft.leftKeys = draft.leftKeys.filter((item) => !moveKeys.includes(item));
        }
        draft.targetKeys = nextTargetKeys;
      })
    );
  };

  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setState(
      produce((draft) => {
        draft.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys];
      })
    );
  };

  useEffect(() => {
    if (!personnel) return;
    setState(
      produce((draft) => {
        draft.targetKeys = personnel.map((p) => p._id);
        if (!leftKeys) return;
        draft.targetKeys = draft.targetKeys.filter((id) => !leftKeys.includes(id));
        draft.leftKeys = leftKeys;
      })
    );
  }, [leftKeys, personnel]);

  return (
    <Modal
      centered
      visible={visible}
      title="จัดการผู้รับผิดชอบในพื้นที่"
      width={{ width: '500px' }}
      onCancel={onCancel}
      destroyOnClose={true}
      footer={
        <Space className="gx-full-width gx-flex-end">
          <Button onClick={onCancel}>ยกเลิก</Button>
          <Button type="primary" onClick={onSubmit}>
            บันทึก
          </Button>
        </Space>
      }
    >
      <TransferTitle>
        <div style={_.omit(TRANSFER_LIST_ITEM_SIZE, 'height')}>เจ้าหน้าที่ผู้รับผิดชอบ</div>
        <div className="ant-transfer-operation" style={{ visibility: 'hidden' }}>
          <button type="button" className="ant-btn ant-btn-primary ant-btn-sm">
            <RightOutlined />
            <span>เพิ่มผู้รับผิดชอบ</span>
          </button>
        </div>
        <div style={_.omit(TRANSFER_LIST_ITEM_SIZE, 'height')}>เจ้าหน้าที่ทั้งหมด</div>
      </TransferTitle>
      <Transfer
        dataSource={personnel}
        showSearch
        titles={['เจ้าหน้าที่ผู้รับผิดชอบ', 'เจ้าหน้าที่ทั้งหมด']}
        locale={{
          searchPlaceholder: 'ค้นหาชื่อเจ้าหน้าที่',
        }}
        onChange={onChange}
        onSelectChange={onSelectChange}
        targetKeys={state.targetKeys}
        selectedKeys={state.selectedKeys}
        showSelectAll={false}
        listStyle={TRANSFER_LIST_ITEM_SIZE}
        operations={['ลบผู้รับผิดชอบ', 'เพิ่มผู้รับผิดชอบ']}
        rowKey={(record) => record._id}
        render={(record) => renderPersonnelName(record)}
      />
    </Modal>
  );
};

export default PersonnelTransfer;
