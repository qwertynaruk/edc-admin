import { Button, Card, Col, Dropdown, Menu, Row, Space, Typography } from 'antd';
import { CloseCircleOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { SpBreadCrumb, SpParagraph, SpStatusTag } from 'features/shared';

import { ItemsRefundCancelledModal } from '../items-cancelled-modal';
import { ItemsRefundClaimModal } from '../items-refund-claim-modal';
import { LostFoundDetailClaimTable } from '../lost-found-detail-claim-table';
import { LostFoundImageItems } from '../lost-found-image-items';
import { useState } from 'react';

export function LostFoundItemDetailPage({ pageId = '' }) {
  const [openRefundClaimModal, setOpenRefundClaimModal] = useState(false);
  const [openRefundCancelledModal, setOpenRefundCancelledModal] = useState(false);

  const onMenuClick = (e) => {
    switch (e.key) {
      case 'cancel':
        setOpenRefundCancelledModal(true);
        break;

      default:
        break;
    }
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={18}>
          <SpBreadCrumb pageName="#Ref IDCLA20250100001" />
        </Col>
        <Col xs={24} md={6}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button type="primary" onClick={() => setOpenRefundClaimModal(true)}>
              คืนไอเท็ม
            </Button>
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
              <Button type="primary">
                <MoreOutlined />
              </Button>
            </Dropdown>
          </Space>
        </Col>

        <Col xs={24} md={8}>
          <LostFoundImageItems />
        </Col>
        <Col xs={24} md={16}>
          <Card
            style={{ marginBottom: 0 }}
            title={
              <Space style={{ justifyContent: 'space-between' }}>
                <Space direction="vertical">
                  <Typography.Title level={5}>รายละเอียดไอเท็ม</Typography.Title>
                  <Space>
                    <SpParagraph title="วันเวลาที่สร้างไอเท็ม">17 Oct 2024 - 10:53</SpParagraph>
                    <SpParagraph title="ผู้สร้างไอเท็ม">ร.ต.ท.จันทรรัตน์ เจริญกาณต์</SpParagraph>
                  </Space>
                </Space>

                <SpStatusTag statusName="claimed" />
              </Space>
            }
          >
            <Row gutter={[20, 20]}>
              <Col xs={12} md={8}>
                <SpParagraph layout="vertical" title="#Ref ID">
                  CLA20250100001
                </SpParagraph>
              </Col>

              <Col xs={12} md={8}>
                <SpParagraph layout="vertical" title="ประเภทไอเท็ม">
                  Phone
                </SpParagraph>
              </Col>

              <Col xs={12} md={8}>
                <SpParagraph layout="vertical" title="ชื่อไอเท็ม">
                  Note20 Ultra
                </SpParagraph>
              </Col>

              <Col xs={12} md={8}>
                <SpParagraph layout="vertical" title="แบรนด์">
                  Samsung
                </SpParagraph>
              </Col>

              <Col xs={12} md={8}>
                <SpParagraph layout="vertical" title="โมเดล">
                  Note20 Ultra
                </SpParagraph>
              </Col>

              <Col xs={12} md={8}>
                <SpParagraph layout="vertical" title="สี">
                  สีชมพู่
                </SpParagraph>
              </Col>

              <Col xs={24}>
                <SpParagraph layout="vertical" title="รายละเอียด">
                  Samsung Note20 Ultra เจอบริเวณหน้าห้องน้ำ
                </SpParagraph>
              </Col>

              <Col xs={24}>
                <SpParagraph layout="vertical" title="ชื่อเจ้าของ">
                  ธนวรรธน์ คมคาย
                </SpParagraph>
              </Col>

              <Col xs={12} md={8}>
                <SpParagraph layout="vertical" title="ชื่อผู้พบ">
                  จิโรจน์ ผ่องรักษา
                </SpParagraph>
              </Col>

              <Col xs={12} md={8}>
                <SpParagraph layout="vertical" title="เบอร์ติดต่อ (ผู้พบ)">
                  0800000000
                </SpParagraph>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24}>
          <Card
            title={
              <Space style={{ justifyContent: 'space-between' }}>
                <Typography.Title level={5} style={{ marginBottom: 0 }}>
                  รายการขอ Claim
                </Typography.Title>
                <Button type="primary">เพิ่มการเคลม</Button>
              </Space>
            }
            bodyStyle={{ padding: 0 }}
          >
            <LostFoundDetailClaimTable />
          </Card>
        </Col>
      </Row>

      <ItemsRefundClaimModal visible={openRefundClaimModal} onClose={() => setOpenRefundClaimModal(false)} />
      <ItemsRefundCancelledModal
        itemsId={null}
        visible={openRefundCancelledModal}
        onClose={() => setOpenRefundCancelledModal(false)}
      />
    </>
  );
}
