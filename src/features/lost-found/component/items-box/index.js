import { Button, Card, Col, Dropdown, Menu, Row, Space, Typography } from 'antd';
import { CloseCircleOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { SpImage, SpStatusTag } from 'features/shared';
import { useLocation, useNavigate } from 'react-router-dom';

import { CategoryIcon } from '../category-items';
import { ItemsRefundCancelledModal } from '../items-cancelled-modal';
import dayjs from 'dayjs';
import styled from '@emotion/styled';
import { useState } from 'react';

export function ItemsBox({ mode = 'item', items = null }) {
  const navigate = useNavigate();
  const locations = useLocation();

  const [open, setOpen] = useState(false);

  const itemsId = 1;

  const onViewDetails = () => {
    navigate(`${locations.pathname}/${itemsId}`);
  };

  const onMenuClick = (ss) => {
    switch (ss) {
      case 'edit':
        break;

      default:
        setOpen(true);
        break;
    }
  };

  return (
    <Card
      bodyStyle={{ padding: 0 }}
      style={{ overflow: 'hidden', position: 'relative', marginBottom: mode === 'item' ? 32 : 0 }}
    >
      <div style={{ position: 'absolute', top: 7, right: 7, zIndex: 10 }}>
        <SpStatusTag statusName={items?.status?.label_en} />
      </div>
      <div style={{ backgroundColor: '#181D28', height: 150, borderBottom: '1px solid #000', overflow: 'hidden' }}>
        <SpImage
          src={items?.item_photos?.[0]}
          fallbackRender={
            <Space align="center" style={{ width: '100%', height: 150, justifyContent: 'center' }}>
              <CategoryIcon typeName={items?.item_type?.label_en} iconProps={{ style: { transform: ' scale(3.8)' } }} />
            </Space>
          }
        />
      </div>
      <Space direction="vertical" style={{ padding: 10 }}>
        <Typography.Text strong>{items?.item_name || '-'}</Typography.Text>
        <CaptionText title="#REF ID">{items?.additional_fields?.ref_id || '-'}</CaptionText>
        <CaptionText title="Item Type">{items?.item_type?.label_en || '-'}</CaptionText>

        {items?.item_type?.label_en === 'Phone' && (
          <>
            <CaptionText title="Brand/model">
              {[items?.item_brand?.label_en, items?.item_model?.label_en].filter((ss) => ss).join('/')}
            </CaptionText>
            <CaptionText title="Color">{items?.item_color?.label_en || '-'}</CaptionText>
          </>
        )}

        {items?.created_at && (
          <CaptionText title="Created Date">{dayjs(items?.created_at).format('DD MMM YYYY HH:mm')}</CaptionText>
        )}

        {mode === 'item' && (
          <Row gutter={[3, 3]} style={{ marginTop: 10 }}>
            <Col xs={24} lg={12}>
              <SmallButton type="primary" onClick={onViewDetails}>
                View details
              </SmallButton>
            </Col>
            <Col xs={19} lg={9}>
              <SmallButton type="primary">Return</SmallButton>
            </Col>
            <Col xs={5} lg={3}>
              <Dropdown
                overlay={
                  <Menu onClick={onMenuClick}>
                    <Menu.Item key="edit">
                      <Typography.Text>
                        <EditOutlined /> แก้ไข
                      </Typography.Text>
                    </Menu.Item>
                    <Menu.Item key="cancel">
                      <Typography.Text>
                        <CloseCircleOutlined /> ยกเลิก
                      </Typography.Text>
                    </Menu.Item>
                  </Menu>
                }
              >
                <SmallButton type="primary">
                  <MoreOutlined />
                </SmallButton>
              </Dropdown>
            </Col>
          </Row>
        )}
      </Space>
      <ItemsRefundCancelledModal itemsId={items?.id} visible={open} onClose={() => setOpen(false)} />
    </Card>
  );
}

const CaptionText = ({ title, children }) => (
  <p style={{ marginBottom: 0 }}>
    <Typography.Text style={{ fontSize: 11, fontWeight: 'bold' }}>{title} :</Typography.Text>
    <Typography.Text style={{ fontSize: 11, marginLeft: 3 }}>{children}</Typography.Text>
  </p>
);

const SmallButton = styled(Button)({
  fontSize: 11,
  width: '100%',
  padding: 0,
});
