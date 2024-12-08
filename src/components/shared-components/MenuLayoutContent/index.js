import { Col, Row, Typography } from 'antd';

import HeaderContent from './HeaderContent';
import SideMenu from './SideMenu';
const { Title } = Typography;
const MenuLayoutContent = (props) => {
  const {
    detailHeaderContent = null,
    propsHeaderContentCard = () => {},
    listSideMenu = [],
    propsSideMenu = () => {},
    content,
    loadingHeadCard = false,
  } = props;

  return (
    <>
      {detailHeaderContent && (
        <HeaderContent
          detailHeaderContent={detailHeaderContent}
          propsHeaderContentCard={propsHeaderContentCard}
          loading={loadingHeadCard}
        />
      )}

      <Row
        gutter={[16, 16]}
        className="gx-flex-row"
        style={{
          height: 500,
          marginBottom: '3em',
          overflow: 'hidden',
        }}
      >
        {listSideMenu.length > 0 && (
          <Col span={5}>
            <SideMenu listSideMenu={listSideMenu} propsSideMenu={propsSideMenu} />
          </Col>
        )}
        <Col span={listSideMenu.length > 0 ? 19 : 24}>
          <div style={{ height: 500, overflowY: 'scroll' }}>{content}</div>
        </Col>
      </Row>
    </>
  );
};

export default MenuLayoutContent;
