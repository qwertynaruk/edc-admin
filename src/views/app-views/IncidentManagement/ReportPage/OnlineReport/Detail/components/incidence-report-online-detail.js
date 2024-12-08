import { Card, Descriptions, Typography } from 'antd';

export const IncidenceReportOnlineDetail = () => {
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
          วีระพล ธนโชควาณิช
        </Descriptions.Item>
        <Descriptions.Item label="เลขบัตรประจำตัวประชาชน">1029395872121</Descriptions.Item>
        <Descriptions.Item label="เพศ">ชาย</Descriptions.Item>
        <Descriptions.Item label="วัน/เดือน/ปี เกิด">6 พ.ค 2537</Descriptions.Item>
        <Descriptions.Item label="อายุ">29 ปี</Descriptions.Item>
        <Descriptions.Item label="เบอร์โทร">082-992-1234</Descriptions.Item>
        <Descriptions.Item label="อีเมล">-</Descriptions.Item>
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
          6 พ.ค 2565 16:00 - เหตุยังไม่สิ้นสุด
        </Descriptions.Item>
        <Descriptions.Item label="หมายเลขคำร้อง">SPSRPT202207060068</Descriptions.Item>
        <Descriptions.Item label="ช่องทางการแจ้งเหตุ">แอปพลิเคชัน</Descriptions.Item>
        <Descriptions.Item label="กลุ่มการแจ้งเหตุ">ทะเลาะวิวาท</Descriptions.Item>
        <Descriptions.Item label="ประเภทการแจ้งเหตุ">เหตุทั่วไป</Descriptions.Item>
        <Descriptions.Item label="รายละเอียด">บุคคลต้องสงสัย</Descriptions.Item>
      </Descriptions>
      <Typography.Title
        level={4}
        style={{
          color: '#fff',
        }}
      >
        รายละเอียด
      </Typography.Title>
      <Typography.Paragraph style={{ color: '#fff', marginBottom: 24 }}>
        มีการเห็นคนแปลกหน้าในบริเวณที่ไม่ปกติ บุคคลนั้นอาจใช้แพลตฟอร์มสื่อสังคมหรือแอปพลิเคชันต่างๆ เพื่อแจ้งเตือน
        ผู้ใช้รายอื่นในพื้นที่เพื่อระวังและตรวจสอบสถานการณ์.
      </Typography.Paragraph>
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
            สถานที่เกิดเหตุ
          </Typography.Title>
        }
        style={{ marginBottom: 24 }}
        labelStyle={{ color: '#fff' }}
        contentStyle={{ color: '#fff' }}
      >
        <Descriptions.Item label="รายละเอียดสถานที่" span={2}>
          จอมพล จตุจักร กรุงเทพมหานคร 10900
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
    </Card>
  );
};
