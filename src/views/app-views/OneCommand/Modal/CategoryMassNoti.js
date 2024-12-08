import { useEffect } from 'react';
import { Col, Modal, Row, Typography } from 'antd';
import styled from '@emotion/styled';

import IconCustom from '@ant-design/icons';
import { ReactComponent as PeopleMassNotiIcon } from 'assets/images/PeopleMassNoti.svg';
import { ReactComponent as PoliceMassNotiIcon } from 'assets/images/PoliceMassNoti.svg';

const { Paragraph, Text } = Typography;

const BoxRoute = styled.div`
  background: #1b2531;
  border: 1px dashed;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 1.5em 5px;
  cursor: pointer;
  transition: 0.5s all ease;

  &:hover {
    opacity: 0.6;
  }

  > .ant-typography {
    margin-top: 2em;
  }
`;

const CategoryMassNoti = ({ visible, setVisible, record, setVisiblePeople, setVisiblePolice }) => {
  const onCancel = () => {
    setVisible(false);
  };

  const categories = [
    {
      icon: PeopleMassNotiIcon,
      title: 'ประชาชน',
      id: 'people',
    },
    {
      icon: PoliceMassNotiIcon,
      title: 'เจ้าหน้าที่ตำรวจ',
      id: 'police',
    },
  ];

  useEffect(() => {
    if (!record || !visible) return;
    if (record.receiver_type_id === 'police') {
      setVisiblePolice(true);
      return;
    }
    if (record.receiver_type_id === 'people') {
      setVisiblePeople(true);
    }
  }, [setVisiblePolice, setVisiblePeople, record, visible]);

  return (
    <>
      <Modal
        visible={visible}
        title={'เลือกช่องทางการเผยแพร่'}
        footer={null}
        centered
        onCancel={onCancel}
        destroyOnClose={true}
      >
        <Row className="gx-flex-row gx-align-items-center gx-justify-content-center">
          {categories.map((el, index) => (
            <Col span={8} key={index}>
              <BoxRoute
                onClick={() => {
                  if (el.id === 'people') {
                    setVisible(false);
                    setVisiblePeople(true);
                  } else if (el.id === 'police') {
                    setVisible(false);
                    setVisiblePolice(true);
                  }
                }}
              >
                <IconCustom component={el.icon} style={{ fontSize: '90px' }} />
                <Text className="gx-text-center">{el.title}</Text>
              </BoxRoute>
            </Col>
          ))}
        </Row>
      </Modal>
      {/* <AddPropertyInformationModal
        visible={onvisible}
        setVisible={setOnvisible}
      />
      <AddPropertyGun visible={onvisibleGun} setVisible={setOnvisibleGun} /> */}
    </>
  );
};

export default CategoryMassNoti;
