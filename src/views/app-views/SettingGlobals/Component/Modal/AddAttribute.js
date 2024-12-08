import { observer } from 'mobx-react';
import { Modal } from 'antd';
import DialogNotification from 'components/shared-components/DialogNotification';
import AttributeEditor from '../AttributeEditor';
import AttributeStore from 'mobx/AttributeStore';
import { useEffect } from 'react';

const AddAttribute = ({ visible, setVisible }) => {
  useEffect(() => {
    if (visible) {
      AttributeStore.GetTypeDropdownMaster();
    }
  }, [visible]);

  const onCancel = () => {
    setVisible(false);
  };
  const onSubmit = (values) => {
    AttributeStore.Create(values)
      .then(() => {
        DialogNotification('success', 'เพิ่มคุณลักษณะสำเร็จ');
        setVisible(false);
      })
      .catch((error) => {
        DialogNotification('error', 'เพิ่มคุณลักษณะไม่สำเร็จ');
        return error;
      });
  };
  return (
    <Modal
      centered
      visible={visible}
      width={'76.2%'}
      title="เพิ่มคุณลักษณะ"
      style={{ marginTop: 20 }}
      onCancel={onCancel}
      destroyOnClose={true}
      footer={null}
    >
      <AttributeEditor onSubmit={onSubmit} onCancel={onCancel} />
    </Modal>
  );
};

export default observer(AddAttribute);
