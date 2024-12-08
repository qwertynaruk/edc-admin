import { Card, Col, Divider, Grid, Row } from 'antd';

import styled from '@emotion/styled';

export default function CardLeftRightComponent({
  leftHeder,
  leftHederStyle = null,
  rightHeader,
  rightHeaderStyle = null,
  leftContent,
  leftContentStyle = null,
  rightContent,
  rightContentStyle = null,
  footerContent,
  footerStyle = null,
  cardCustomStyle = null,
  cardHight = 500,
}) {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const CardStyle = styled(Card)({
    borderRadius: 0,
    '.ant-card-head-title': {
      padding: 0,
      margin: 0,
    },
    '.ant-card-head': {
      padding: 0,
      margin: 0,
    },
    '.ant-card-body': {
      padding: 0,
      margin: 0,
    },
    '.ant-card-actions': {
      padding: 0,
      margin: 0,
    },
  });

  const StyleCol = styled(Col)({
    padding: 0,
    borderRight: screens.xs ? '' : `1px solid #000`,
    minHeight: screens.xs ? '' : '70px',
  });

  const leftHederStyleCustom = {
    style: leftHederStyle || {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 14,
    },
  };
  const rightHeaderStyleCustom = {
    style: rightHeaderStyle || {
      padding: 14,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  };
  const leftContentStyleCustom = {
    style: leftContentStyle || {
      padding: 14,
    },
  };
  const rightContentStyleCustom = {
    style: rightContentStyle || {
      padding: 14,
    },
  };
  const footerStyleCustom = {
    style: footerStyle || {
      padding: 14,
      display: 'flex',
      justifyContent: 'flex-end',
    },
  };

  const cardStyleCustom = {
    style: cardCustomStyle || {
      minHeight: cardHight,
    },
  };

  const HeaderControl =
    leftHeder || rightHeader ? (
      <Row style={{ margin: 0 }}>
        <StyleCol xs={24} sm={5} {...leftHederStyleCustom}>
          {leftHeder}
        </StyleCol>
        <Col xs={24} sm={19} {...rightHeaderStyleCustom}>
          {rightHeader}
        </Col>
      </Row>
    ) : undefined;

  return (
    <>
      <CardStyle {...cardStyleCustom} title={HeaderControl}>
        <Row
          style={{ margin: 0, width: '100%', minHeight: `calc(${cardHight}px - ${footerContent ? '130px' : '0px'})` }}
        >
          <StyleCol xs={24} sm={5}>
            <div {...leftContentStyleCustom}>{leftContent}</div>
          </StyleCol>
          <Col xs={24} sm={19} style={{ padding: 0 }}>
            {screens.xs && <Divider />}
            <div {...rightContentStyleCustom}>{rightContent}</div>
          </Col>
        </Row>
        {footerContent && (
          <Row style={{ margin: 0 }}>
            <Col xs={24} sm={24} style={{ padding: 0 }}>
              <>
                <Divider style={{ margin: 0 }} />
                <div {...footerStyleCustom}>{footerContent}</div>
              </>
            </Col>
          </Row>
        )}
      </CardStyle>
    </>
  );
}
