import { Col, Row, Space, Typography } from 'antd';
import _ from 'lodash';
import TextEditable from '../TextEditable';

const MapParentSignatureItems = ({
  signatureList = [],
  acceptField = '',
  ignoreField = [],
  withoutName = false,
  colPositionNiche = false,
  colSpan = 24,
}) => {
  const colStyles = colSpan === 24 ? { display: 'flex', justifyContent: 'center' } : {};

  const RenderPreview = ({ items }) => {
    return (
      <Space direction="vertical">
        <Space>
          <Typography.Text>ลงชื่อ {_.get(items, 'prefix', '')}</Typography.Text>
          <TextEditable>........................................</TextEditable>
          <Typography.Text>{_.get(items, 'relation', 'ผู้เกี่ยวข้อง')}</Typography.Text>
        </Space>

        <Space>
          <Typography.Text>ลงชื่อ</Typography.Text>
          <TextEditable>........................................</TextEditable>
          <Typography.Text>ผู้ปกครอง (ถ้ามี)</Typography.Text>
        </Space>
      </Space>
    );
  };

  const CheckTypeOfItems = (propertyUnit) => {
    if (!propertyUnit || propertyUnit.length <= 0) {
      return null;
    }

    const newSignatureItems = propertyUnit.filter((_pp) => _pp);
    const inNiche = colPositionNiche && newSignatureItems.length <= 4;

    return newSignatureItems.map((_ss, _index1) =>
      Array.isArray(_ss) ? (
        _ss
          .filter((_pp) => _pp)
          .map((_ss2, _index2) => (
            <>
              {inNiche && <Col span={12}></Col>}
              <Col span={colSpan} key={_index2} style={colStyles}>
                <RenderPreview items={_ss2} />
              </Col>
            </>
          ))
      ) : (
        <>
          {inNiche && <Col span={12}></Col>}
          <Col span={colSpan} key={_index1} style={colStyles}>
            <RenderPreview items={_ss} />
          </Col>
        </>
      )
    );
  };

  return (
    <Row className="gx-flex-row" gutter={[16, 16]}>
      {acceptField
        ? CheckTypeOfItems(signatureList[acceptField])
        : CheckTypeOfItems(
            _.values(
              _.pickBy(signatureList, (ss, _keys) => _.difference(_.keys(signatureList), ignoreField).includes(_keys))
            )
          )}
    </Row>
  );
};

export default MapParentSignatureItems;
