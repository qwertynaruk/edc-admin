import { Button, Card, Divider, Space, Typography } from 'antd';

import GenerateAddress from 'components/shared-components/GenerateAddress';
import GisStore from 'mobx/GisStore';
import Guarded from 'components/shared-components/Guarded';
import { InfoWindow } from '@react-google-maps/api';
import { Link } from 'react-router-dom';
import StreamIP from './StreamIP';
import _ from 'lodash';
import { observer } from 'mobx-react';
import { renderDateTime } from 'utils/stringRender';

const IncidentInfoWindow = ({ itemData = {} }) => {
  return (
    <>
      <Space className="gx-full-width gx-space-between">
        <Typography.Text strong>{_.get(itemData, 'reportId', '-')}</Typography.Text>
        <Guarded
          query={{
            group: 'Incident Management',
            name: 'ดูข้อมูลรายงานจากเว็บฟอร์ม',
            type: 'รายงานจากเว็บฟอร์ม',
          }}
        >
          <Button type="primary">
            <Link
              to={`/app/incident-management/report/webform/detail/${_.get(itemData, 'id', '')}`}
              target="_blank"
              rel="noreferrer"
            >
              ดูรายละเอียด
            </Link>
          </Button>
        </Guarded>
      </Space>
      <Divider />
      <div style={{ overflowY: 'scroll', maxHeight: 100, height: '100%' }}>
        <Typography.Paragraph>
          <Typography.Text style={{ color: '#ffffff66' }}>ประเภทเหตุ :</Typography.Text>
          <Typography.Text>รายงานการแจ้งเบาะแสด</Typography.Text>
        </Typography.Paragraph>

        <Typography.Paragraph>
          <Typography.Text style={{ color: '#ffffff66' }}>รายละเอียด :</Typography.Text>
          <Typography.Text>{_.get(itemData, 'detail', '-')}</Typography.Text>
        </Typography.Paragraph>

        <Typography.Paragraph>
          <Typography.Text style={{ color: '#ffffff66' }}>สถานที่เกิดเหตุ :</Typography.Text>
          <Typography.Text>{_.get(itemData, 'address', null)}</Typography.Text>
        </Typography.Paragraph>
      </div>
    </>
  );
};

const OndutyInfoWindow = ({ itemData = {} }) => {
  return (
    <>
      <Space className="gx-full-width gx-space-between">
        <Typography.Text strong>{_.get(itemData, 'reportId', '-')}</Typography.Text>
        <Guarded
          query={{
            group: 'Incident Management',
            name: 'ดูข้อมูลรายงานการปฏิบัติหน้าที่ทั้งหมด',
            type: 'รายงานการปฏิบัติหน้าที่',
          }}
        >
          <Button type="primary">
            <Link
              to={`/app/incident-management/report/onduty/management/${_.get(itemData, 'id', '')}`}
              target="_blank"
              rel="noreferrer"
            >
              ดูรายละเอียด
            </Link>
          </Button>
        </Guarded>
      </Space>
      <Divider />
      <div style={{ overflowY: 'scroll', maxHeight: 100, height: '100%' }}>
        <Typography.Paragraph>
          <Typography.Text style={{ color: '#ffffff66' }}>ประเภทเหตุ :</Typography.Text>
          <Typography.Text>รายงานการปฏิบัติหน้าที่</Typography.Text>
        </Typography.Paragraph>

        <Typography.Paragraph>
          <Typography.Text style={{ color: '#ffffff66' }}>รายละเอียด :</Typography.Text>
          <Typography.Text>{_.get(itemData, 'detail', '-')}</Typography.Text>
        </Typography.Paragraph>

        <Typography.Paragraph>
          <Typography.Text style={{ color: '#ffffff66' }}>สถานที่เกิดเหตุ :</Typography.Text>
          <Typography.Text>{GenerateAddress(_.get(itemData, 'address', null))}</Typography.Text>
        </Typography.Paragraph>
      </div>
    </>
  );
};

const CCTVInfoWindow = ({ centerBounds = {} }) => {
  const { CCTVItemInfo = {} } = GisStore;
  const cctvId = _.get(CCTVItemInfo, 'camera_id', '');

  return (
    <>
      <Typography.Text strong>{_.get(CCTVItemInfo, 'title', 'Unknow CCTV')}</Typography.Text>
      <Divider />
      <Space direction="vertical">
        <Space>
          <Typography.Text style={{ color: '#ffffff66' }}>สถานที่ตั้ง :</Typography.Text>
          <Typography.Text>-</Typography.Text>
        </Space>

        <Space>
          <Typography.Text style={{ color: '#ffffff66' }}>พิกัด :</Typography.Text>
          <Typography.Text>
            {centerBounds.lat}, {centerBounds.lng}
          </Typography.Text>
        </Space>
      </Space>

      <div className="gx-mt-2">
        <StreamIP cctvId={cctvId} />
      </div>
    </>
  );
};

const SOSInfoWindow = ({ centerBounds = {} }) => {
  const { redboxItemInfo = {} } = GisStore;
  return (
    <>
      <Typography.Text strong>{_.get(redboxItemInfo, 'roomName', 'Unknow SOS')}</Typography.Text>
      <Divider />
      <Space direction="vertical">
        <Space>
          <Typography.Text style={{ color: '#ffffff66' }}>อุณหภูมิ :</Typography.Text>
          <Typography.Text>{_.get(redboxItemInfo, 'temperature', 0)} &#8451;</Typography.Text>
        </Space>

        <Space>
          <Typography.Text style={{ color: '#ffffff66' }}>พิกัด :</Typography.Text>
          <Typography.Text>
            {centerBounds.lat}, {centerBounds.lng}
          </Typography.Text>
        </Space>

        <Space>
          <Typography.Text style={{ color: '#ffffff66' }}>สถานที่ตั้ง :</Typography.Text>
          <Typography.Text>{_.get(redboxItemInfo, 'place', '-')}</Typography.Text>
        </Space>
      </Space>
    </>
  );
};

const PartolInfoWindow = () => {
  const { partolItemInfo = {} } = GisStore;
  return (
    <>
      <Typography.Text strong>{_.get(partolItemInfo, 'id', 'Udon Police')}</Typography.Text>
      <Divider />
      <Space direction="vertical">
        <Space>
          <Typography.Text style={{ color: '#ffffff66' }}>พิกัด :</Typography.Text>
          <Typography.Text>
            {[_.get(partolItemInfo, 'longitude', 0), _.get(partolItemInfo, 'latitude', 0)].join(',')}
          </Typography.Text>
        </Space>

        <Space>
          <Typography.Text style={{ color: '#ffffff66' }}>ออนไลน์ล่าสุด :</Typography.Text>
          <Typography.Text>{renderDateTime(new Date(_.get(partolItemInfo, 'time', null)))}</Typography.Text>
        </Space>

        <Space>
          <Typography.Text style={{ color: '#ffffff66' }}>ความเร็ว :</Typography.Text>
          <Typography.Text>
            {_.get(partolItemInfo, 'speedAccuracyMetersPerSecond', 0)} กิโลเมตร ต่อชั่วโมง
          </Typography.Text>
        </Space>
      </Space>
    </>
  );
};

const RenderInfoWindow = ({ visible, centerBounds, itemData = {}, onInfoWindowClose = () => undefined }) => {
  if (!visible) {
    return null;
  }

  const { markerType = '' } = GisStore;

  const RenderCardContent = () => {
    switch (markerType) {
      case 'incident':
        return <IncidentInfoWindow itemData={itemData} />;

      case 'onduty':
        return <OndutyInfoWindow itemData={itemData} />;

      case 'cctv':
        return <CCTVInfoWindow centerBounds={centerBounds} />;

      case 'sos':
        return <SOSInfoWindow centerBounds={centerBounds} />;

      case 'partol':
        return <PartolInfoWindow />;

      default:
        return null;
    }
  };

  return (
    <InfoWindow position={centerBounds} onCloseClick={onInfoWindowClose}>
      <Card
        style={{ width: 340, height: markerType === 'cctv' ? 300 : 160, marginBottom: 16, marginRight: 16 }}
        bordered={false}
        bodyStyle={{ padding: 5 }}
      >
        <Space direction="vertical" size={0}>
          <RenderCardContent />
        </Space>
      </Card>
    </InfoWindow>
  );
};

export default observer(RenderInfoWindow);
