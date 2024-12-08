import { Image, Space, Typography } from 'antd';
import _ from 'lodash';
import 'draft-js/dist/Draft.css';

import ReportStore from 'mobx/ReportStore';
import { observer } from 'mobx-react';
import MapSignatureItems from '../../MapSignatureItems';
import { ParagraphContainer } from '../..';
import SlateEditors from 'components/shared-components/SlateEditors';

const RenderInvestigationType = ({ draftColor }) => {
  const { reportItems = {}, signatureList = [] } = ReportStore;

  const investigationSource = _.get(reportItems, 'investigation', {});

  const beginningSource = _.get(investigationSource, 'beginning', null) || null;
  const conductingSource = _.get(investigationSource, 'conducting', null) || null;
  const investigatorOpinionSource = _.get(investigationSource, 'investigator_opinion', null) || null;
  const keyConsiderationSource = _.get(investigationSource, 'key_consideration', null) || null;

  const primaryDefaultValue = [
    'ส่วนราชการ',
    _.get(investigationSource, 'header.government_sector', '-'),
    'โทร',
    _.get(investigationSource, 'header.government_sector_phone_number', '-'),
    '\n\nที่',
    _.get(investigationSource, 'header.order', '-'),
    'วันที่',
    _.get(investigationSource, 'header.datetime', '-'),
    '\n\nเรื่อง',
    _.get(investigationSource, 'header.topic', '-'),
  ].join(' ');

  return (
    <ParagraphContainer color={draftColor}>
      <Space direction="vertical" style={{ marginTop: 10, fontSize: 16 }}>
        <Space align="end" style={{ marginTop: -5 }}>
          <Image preview={false} src="/img/garuda-symbol-icon.png" height={75} width={71} />
          <Typography.Text style={{ fontSize: 18 }} strong>
            บันทึกข้อความ
          </Typography.Text>
        </Space>

        <SlateEditors defaultValue={primaryDefaultValue} />
      </Space>
      <br />

      <Typography.Text style={{ fontSize: 18 }} strong>
        ๑.จุดเริ่มต้นของการสืบสวน
      </Typography.Text>

      <SlateEditors defaultValue={beginningSource} />

      <Typography.Text style={{ fontSize: 18 }} strong>
        ๒.การดำเนินการการสืบสวน
      </Typography.Text>

      <SlateEditors defaultValue={conductingSource} />

      <Typography.Text style={{ fontSize: 18 }} strong>
        ๓.ความเห็นของผู้สืบสวน
      </Typography.Text>

      <SlateEditors defaultValue={investigatorOpinionSource} />

      <Typography.Text style={{ fontSize: 18 }} strong>
        ๔.ข้อพิจาณา
      </Typography.Text>

      <SlateEditors defaultValue={keyConsiderationSource} />
      <br />
      <br />

      <MapSignatureItems signatureList={signatureList} colSpan={12} colPositionNiche={true} />
    </ParagraphContainer>
  );
};

export default observer(RenderInvestigationType);
