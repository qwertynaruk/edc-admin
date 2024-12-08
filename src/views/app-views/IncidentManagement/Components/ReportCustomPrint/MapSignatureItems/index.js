import { Col, Row, Typography } from 'antd';
import _ from 'lodash';
import React from 'react';
import TextEditable from '../TextEditable';

const MapSignatureItems = ({
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
      <div style={{ width: 'fit-content' }}>
        <Typography.Text>ลงชื่อ {_.get(items, 'prefix', '')}</Typography.Text>
        <TextEditable>........................................</TextEditable>
        <Typography.Text>{_.get(items, 'relation', 'ผู้เกี่ยวข้อง')}</Typography.Text>

        <br />

        <div style={{ textAlign: 'center' }}>
          {!withoutName && <Typography.Text>( {_.get(items, 'fullname', '')} )</Typography.Text>}
        </div>
      </div>
    );
  };

  const CheckTypeOfItems = (propertyUnit) => {
    if (!propertyUnit || propertyUnit.length <= 0) {
      return null;
    }

    const newSignatureItems = propertyUnit.filter((_pp) => _pp);
    const inNiche = colPositionNiche && newSignatureItems.length <= 4;

    return newSignatureItems.map((_ss, index1) =>
      Array.isArray(_ss) ? (
        _ss
          .filter((_pp) => _pp)
          .map((ss2, index2) => (
            <React.Fragment key={index2}>
              {inNiche && <Col span={12} />}
              <Col span={colSpan} style={colStyles}>
                <RenderPreview items={ss2} />
              </Col>
            </React.Fragment>
          ))
      ) : (
        <React.Fragment key={index1}>
          {inNiche && <Col span={12} />}
          <Col span={colSpan} style={colStyles}>
            <RenderPreview items={_ss} />
          </Col>
        </React.Fragment>
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

export default MapSignatureItems;
