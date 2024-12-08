import { Card, Image, Space, Table, Typography } from 'antd';
import ReportStore from 'mobx/ReportStore';
import { QRCodeSVG } from 'qrcode.react';
import styled from '@emotion/styled';
import { ThaiDateTime } from 'utils/ThaiDateTime';
import RenderCaseType from './RenderCaseType';
import RenderDocsType from './RenderDocsType';
import RenderEvidenceType from './RenderEvidenceType';
import RenderResultOverview from './RenderResultOverview';
import { getEnv } from 'configs/EnvironmentConfig';

const PDFTableTemplate = ({
  reportTypeName = '',
  componentRef,
  draftColor,
  signatureList,
  containerSize,
  bookIndex,
  numberIndex,
  sequenceIndex,
  draftView = true,
}) => {
  const { reportItems } = ReportStore;
  const columns = [
    {
      title: 'ลำดับ',
      dataIndex: 'sequence',
      width: '66px',
    },
    {
      title: 'วัน เดือน ปี เวลา',
      dataIndex: 'datetime',
      width: '87px',
    },
    {
      title: 'รายงาน',
      dataIndex: 'detail',
      width: '608px',
    },
  ];

  const selectRenderDetail = () => {
    const anyProps = {
      draftColor,
      signatureList,
    };

    switch (reportTypeName) {
      case 'ประจำวันรับแจ้งเอกสารหาย':
        return <RenderDocsType {...anyProps} />;

      case 'ประจำวันรับแจ้งเป็นหลักฐาน':
        return <RenderEvidenceType {...anyProps} />;

      case 'ประจำวันเกี่ยวกับคดีอาญา':
        return <RenderCaseType {...anyProps} />;

      case 'ประจำวันเกี่ยวกับคดีจราจร':
        return <RenderCaseType {...anyProps} />;

      default:
        return <RenderResultOverview {...anyProps} reportTypeName={reportTypeName} />;
    }
  };

  const ProvideReportQrCode = () => {
    const refScale = 75;
    // console.log(componentRef.current.clientHeight);
    // if (domClientHeight <= containerSize.height) {
    const { INCIDENT_URL } = getEnv();
    const qrValue = `${INCIDENT_URL}/app/qr_check/${reportItems?.report_record_id}`;
    return (
      <CornerTargetExtendAbsolute containerHeight={containerSize.height} refHeight={refScale}>
        <QRCodeSVG value={qrValue} level="H" width={refScale} height={refScale} />
      </CornerTargetExtendAbsolute>
    );
    // }

    // return null;
  };

  return (
    <Card
      title={reportTypeName}
      bodyStyle={{
        padding: '10px 10px 20px 10px',
        width: '100%',
        height: 500,
        overflowY: 'auto',
      }}
    >
      <div
        ref={(el) => (componentRef.current = el)}
        style={{
          backgroundColor: '#fff',
          padding: '1.25em',
          width: containerSize.width,
          minHeight: containerSize.height,
          margin: 'auto',
        }}
      >
        <Space className="gx-full-width gx-space-between" align="start">
          <Space>
            <Typography.Text style={{ color: '#000' }}>เล่มที่</Typography.Text>
            <Typography.Text style={{ color: '#000' }}>
              {[draftView ? '0000' : bookIndex, ThaiDateTime(null, 'only-year')].join('/')}
            </Typography.Text>
          </Space>

          <div>
            <Space style={{ justifyContent: 'right' }}>
              <Typography.Text style={{ color: '#000' }}>เลขที่</Typography.Text>
              <Typography.Text style={{ color: '#000' }}>{draftView ? '0000' : numberIndex}</Typography.Text>
            </Space>
            <Typography.Text style={{ color: '#000' }}>เอกสารหลักหน้าที่ 1 จาก 1</Typography.Text>
          </div>
        </Space>

        <Space direction="vertical" className="gx-align-center" style={{ marginTop: -5 }}>
          <Image preview={false} src="/img/garuda-symbol-icon.png" height={75} width={71} />
          <Typography.Text style={{ color: '#000' }}>สำนักงานตำรวจแห่งชาติ</Typography.Text>
          <Typography.Text style={{ color: '#000' }}>{reportTypeName}</Typography.Text>
          <Typography.Text style={{ color: '#000', fontSize: 14 }}>
            สถานีตำรวจ สภ.เมืองอุดรธานี กองบังคับการ ตำรวจภูธรจังหวัดอุดรธานี กองบัญชาการ ตำรวจภูธรภาค 4
          </Typography.Text>
        </Space>

        <DeliveredAbsolute>
          <PlaintTable
            columns={columns}
            rowKey="key"
            dataSource={[
              {
                key: '1',
                sequence: draftView ? '' : parseInt(sequenceIndex) + 1,
                datetime: draftView ? '' : ThaiDateTime(null, 'short-month-short-time'),
                detail: selectRenderDetail(),
              },
            ]}
            pagination={false}
            bordered={true}
          />
          <InsideAbsolute>
            <img src={`/img/${draftView ? 'draft-pdf-background.png' : 'police-gov-background.png'}`} />
          </InsideAbsolute>

          <ProvideReportQrCode />
        </DeliveredAbsolute>
      </div>
    </Card>
  );
};

export default PDFTableTemplate;

const DeliveredAbsolute = styled.div`
  margin-top: 1rem;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const InsideAbsolute = styled.div`
  position: absolute;
  opacity: 0.6;
  z-index: 0;
`;

const CornerTargetExtendAbsolute = styled.div`
  position: absolute;
  top: calc(${(prop) => prop.containerHeight}px - 260px - ${(prop) => prop.refHeight}px);
  right: 20px;
`;

const PlaintTable = styled(Table)`
  z-index: 10;
  .ant-table-container {
    border-color: #000 !important;
    border-radius: 0 !important;

    .ant-table-content > {
      table {
        height: 850px;
      }
    }
  }

  .ant-table-thead {
    .ant-table-cell {
      color: #000 !important;
      border-right-color: #000 !important;
      border-top-color: #000 !important;
      border-bottom-color: #000 !important;
      border-radius: 0 !important;

      &:last-child {
        text-align: center;
      }

      &:nth-of-type(2) {
        padding-left: 0;
        padding-right: 0;
        text-align: center;
      }
    }
  }

  .ant-table-tbody {
    .ant-table-row {
      &:hover {
        .ant-table-cell {
          background: unset !important;
        }
      }

      .ant-table-cell {
        color: #000;
        border-right-color: #000 !important;
        border-bottom-color: #000 !important;
        vertical-align: top;

        &:nth-of-type(1) {
          text-align: center;
        }

        &:nth-of-type(2) {
          text-align: center;
          padding-left: 5px;
          padding-right: 5px;
        }
      }
    }
  }
`;
