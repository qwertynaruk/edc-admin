import 'dayjs/locale/th';

import { Button, Card, Col, Descriptions, Modal, Row, Typography } from 'antd';

import { CheckOutlined } from '@ant-design/icons';
import { EventsDetailAttachmentsList } from './components/events-detail-attachments-list';
import { GoogleMapAddressPicker } from 'components/shared-components/google-map-address-picker';
import _ from 'lodash';
import dayjs from 'dayjs';
import { useState } from 'react';

dayjs.locale('th');

export const IncidentManagementEventsDetail = ({ incidentDetail }) => {
  const reportDetail = incidentDetail?.report_detail;
  const reporter = incidentDetail?.reporter;
  const reportAttachments = incidentDetail?.report_attachments;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCoppy, setIsCoppy] = useState(null);

  const pinLocation = incidentDetail?.report_location?.location?.coordinates ?? [];

  const birthDate = reporter?.date_of_birth_th?.split('/')?.reverse()?.join('-');

  const age = dayjs().diff(birthDate, 'year');

  return (
    <Card title="รายละเอียดเหตุการณ์">
      <Descriptions
        column={{
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        title={
          <Typography.Title
            level={4}
            style={{
              margin: 0,
              color: '#fff',
            }}
          >
            ข้อมูลผู้แจ้ง
          </Typography.Title>
        }
        style={{ marginBottom: 24 }}
        labelStyle={{ color: '#fff' }}
        contentStyle={{ color: '#fff' }}
      >
        <Descriptions.Item label="ชื่อ นามสกุล" span={2}>
          {reporter?.name_th ?? '-'}
        </Descriptions.Item>
        <Descriptions.Item label="เลขบัตรประจำตัวประชาชน">{reporter?.id_card ?? '-'}</Descriptions.Item>
        <Descriptions.Item label="เพศ">{reporter?.gender ?? '-'}</Descriptions.Item>
        <Descriptions.Item label="วัน/เดือน/ปี เกิด">
          {birthDate ? dayjs(birthDate).format('DD MMM YYYY') : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="อายุ">{age} ปี</Descriptions.Item>
        <Descriptions.Item label="เบอร์โทร">{reporter?.phone_number ?? '-'}</Descriptions.Item>
        <Descriptions.Item label="อีเมล">{reporter?.email ?? '-'}</Descriptions.Item>
      </Descriptions>
      <Descriptions
        column={{
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        title={
          <Typography.Title
            level={4}
            style={{
              margin: 0,
              color: '#fff',
            }}
          >
            ข้อมูลการแจ้ง
          </Typography.Title>
        }
        style={{ marginBottom: 24 }}
        labelStyle={{ color: '#fff' }}
        contentStyle={{ color: '#fff' }}
      >
        <Descriptions.Item label="วันเวลาที่เกิดเหตุ - สิ้นสุดเหตุ" span={2}>
          {dayjs(reportDetail?.StartDateTime).format('DD MMM YY HH:mm')} -
          {reportDetail?.EndDateTime ? dayjs(reportDetail?.EndDateTime).format('DD MMM YY HH:mm') : 'เหตุยังไม่สิ้นสุด'}
        </Descriptions.Item>
        <Descriptions.Item label="หมายเลขคำร้อง">{incidentDetail?.report_record_id ?? '-'}</Descriptions.Item>
        <Descriptions.Item label="ช่องทางการแจ้งเหตุ">แอปพลิเคชัน</Descriptions.Item>
        <Descriptions.Item label="กลุ่มการแจ้งเหตุ">{reportDetail?.group_type_name}</Descriptions.Item>
        <Descriptions.Item label="ประเภทการแจ้งเหตุ">{reportDetail?.type_name}</Descriptions.Item>
        <Descriptions.Item label="รายละเอียด">{reportDetail?.Description}</Descriptions.Item>
      </Descriptions>
      {!_.isEmpty(pinLocation) && (
        <div
          className="gx-mb-4 gx-border-2"
          style={{
            borderColor: '#000',
          }}
        >
          <GoogleMapAddressPicker
            height={500}
            value={{
              lat: pinLocation?.[1],
              lng: pinLocation?.[0],
            }}
          />
        </div>
      )}
      <Descriptions
        column={{
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography.Title
              level={4}
              style={{
                margin: 0,
                color: '#fff',
              }}
            >
              สถานที่เกิดเหตุ
            </Typography.Title>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
              แชร์ตำแหน่ง
            </Button>
          </div>
        }
        style={{ marginBottom: 24 }}
        labelStyle={{ color: '#fff' }}
        contentStyle={{ color: '#fff' }}
      >
        <Descriptions.Item label="รายละเอียดสถานที่" span={2}>
          {incidentDetail?.report_location?.concatenated_field ?? '-'}
        </Descriptions.Item>
      </Descriptions>
      <Typography.Title
        level={4}
        style={{
          color: '#fff',
        }}
      >
        ไฟล์แนบ
      </Typography.Title>
      <EventsDetailAttachmentsList attachments={reportAttachments} />

      <Modal title="แชร์ตำแหน่ง" visible={isModalOpen} centered footer={null} onCancel={() => setIsModalOpen(false)}>
        {incidentDetail?.report_location?.concatenated_field ?? '-'}
        <Row style={{ marginTop: 10 }}>
          <Col span={24}>ลิงก์สำหรับการแชร์</Col>
        </Row>
        <Row justify="space-between" style={{ marginTop: 10 }}>
          <Col span={18}>
            <div span={24} style={{ borderBottom: '1px solid black' }}>
              {`https://www.google.com/maps/search/?api=1&query=${pinLocation?.[1]}%2C${pinLocation?.[0]}`}
            </div>
          </Col>
          <Col span={6}>
            <Button
              type="link"
              onClick={() => {
                const linkGoogleMap = `https://www.google.com/maps/search/?api=1&query=${pinLocation?.[1]}%2C${pinLocation?.[0]}`;
                setIsCoppy(linkGoogleMap);
                navigator.clipboard.writeText(linkGoogleMap);
                setTimeout(() => {
                  setIsCoppy(null);
                }, 3000);
              }}
            >
              คัดลอกลิงก์
              {isCoppy && (
                <>
                  <CheckOutlined />
                </>
              )}
            </Button>
          </Col>
        </Row>
      </Modal>
    </Card>
  );
};
