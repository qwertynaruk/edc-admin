import { Col, Modal, Row, Typography } from 'antd';
import IconCustom from '@ant-design/icons';
import BoxRoute from 'components/shared-components/BoxRoute';
import { ReactComponent as MultipleCopIcon } from 'assets/images/multiple-cop.svg';
import { ReactComponent as SingleCopIcon } from 'assets/images/single-cop.svg';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

const SelectScheduleType = (props) => {
  const { visible, setVisible } = props;
  const navigate = useNavigate();

  const categories = [
    {
      id: 'agency',
      icon: MultipleCopIcon,
      title: 'ชุดปฏิบัติการ',
      onClick: () => {
        navigate('agency/create');
      },
    },
    {
      id: 'person',
      icon: SingleCopIcon,
      title: 'รายบุคคล',
      onClick: () => {
        navigate('person/create');
      },
    },
  ];

  const onCancel = () => {
    setVisible(false);
  };

  return (
    <Modal title="เลือกประเภทตารางการปฏิบัติหน้าที่" visible={visible} footer={false} centered onCancel={onCancel}>
      <Row className="gx-flex-row gx-align-items-center gx-justify-content-center ">
        {categories.map((el) => (
          <Col span={8} key={el.id}>
            <BoxRoute onClick={el.onClick}>
              <IconCustom component={el.icon} style={{ fontSize: '72px' }} />
              <Text className="gx-text-center">{el.title}</Text>
            </BoxRoute>
          </Col>
        ))}
      </Row>
    </Modal>
  );
};

export default SelectScheduleType;
