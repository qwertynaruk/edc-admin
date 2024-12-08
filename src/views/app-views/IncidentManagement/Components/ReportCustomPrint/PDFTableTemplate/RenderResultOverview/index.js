import _ from 'lodash';

import ReportStore from 'mobx/ReportStore';
import { RenderPersonnelWidget } from 'components/shared-components/AccountSelectWidget';
import UserStore from 'mobx/UserStore';
import { ParagraphContainer } from '../..';
import MapSignatureItems from '../../MapSignatureItems';
import SlateEditors from 'components/shared-components/SlateEditors';

const RenderResultOverview = ({ draftColor, signatureList, reportTypeName = '' }) => {
  const { reportItems = {} } = ReportStore;

  const defaultValue = [
    'เจ้าหน้าที่เสมียน',
    RenderPersonnelWidget(_.get(reportItems, 'report_owner_id', _.get(UserStore, 'user.personnel_id', ''))),
    'ปิดประจำวัน\n',
    'หมายเหตุ วันนี้มีรายงานเกิดเหตุ ดังนี้',
  ].join(' ');

  return (
    <ParagraphContainer color={draftColor}>
      <SlateEditors defaultValue={defaultValue} />
      <br />

      <MapSignatureItems signatureList={signatureList} colPositionNiche={true} />
    </ParagraphContainer>
  );
};

export default RenderResultOverview;
