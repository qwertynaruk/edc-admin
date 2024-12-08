import _ from 'lodash';

import ReportStore from 'mobx/ReportStore';
import MapSignatureItems from '../../MapSignatureItems';
import { observer } from 'mobx-react';
import SlateEditors from 'components/shared-components/SlateEditors';
import FormPreference from 'utils/FormPreference';
import GenerateAddress from 'components/shared-components/GenerateAddress';
import { renderDateTime } from 'utils/stringRender';
import { ParagraphContainer } from '../..';

const RenderEvidenceType = ({ draftColor }) => {
  const { reportItems = {}, signatureList = [] } = ReportStore;
  const eventSource = _.get(reportItems, 'event', {});
  const contentSource = _.get(reportItems, 'content', null) || null;
  const tx = _.get(eventSource, 'informer', []);
  const current = _.get(tx, '0', {});
  const phoneNumber = _.get(current, 'contact.contact_phone_number', []);

  const defaultValue = [
    'ข้าพเจ้า',
    current?.is_juristic
      ? [current?.juristic_name, 'เลขที่ผู้เสียภาษี', current?.id_juristic].join(' ')
      : [
          FormPreference.ComplexFullname({ payload: current, withInspectData: true }),
          'อาชีพ',
          _.get(current, 'work_history.0.occupation', '-'),
        ].join(' '),
    'อยู่บ้านเลขที่',
    GenerateAddress(_.get(current, 'contact.contact_home_address', ''), true),
    'โทรศัพท์',
    phoneNumber.length > 0 ? _.get(phoneNumber[0], 'phone_number', '-') : '-',
    '\nมาสถานีตำรวจแจ้งว่า เมื่อวันที่',
    renderDateTime(_.get(reportItems, 'basic_information.start_date', null), 'only-day'),
    'เดือน',
    renderDateTime(_.get(reportItems, 'basic_information.start_date', null), 'only-month'),
    'พ.ศ.',
    renderDateTime(_.get(reportItems, 'basic_information.start_date', null), 'only-year'),
    'เวลา',
    renderDateTime(_.get(reportItems, 'basic_information.start_date', null), 'only-time'),
    'น.',
    '\n\n',
    FormPreference.ComplexPersonnel(_.get(reportItems, 'basic_information.recorder', '')),
    'ตำแหน่ง',
    FormPreference.ComplexPersonnel(_.get(reportItems, 'basic_information.recorder', ''), 'position'),
    '\nได้รับแจ้งความตามประสงค์ผู้แจ้งไว้แล้ว จึงบันทึกไว้เป็นหลักฐาน\n\n',
    contentSource || '',
  ].join(' ');

  return (
    <ParagraphContainer color={draftColor}>
      <SlateEditors defaultValue={defaultValue} />
      <br />
      <MapSignatureItems signatureList={signatureList} colPositionNiche={true} />
    </ParagraphContainer>
  );
};

export default observer(RenderEvidenceType);
