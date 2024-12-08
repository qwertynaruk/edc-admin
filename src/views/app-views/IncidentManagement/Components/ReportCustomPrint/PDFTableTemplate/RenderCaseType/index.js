import _ from 'lodash';

import ReportStore from 'mobx/ReportStore';
import FormPreference from 'utils/FormPreference';
import GenerateAddress from 'components/shared-components/GenerateAddress';
import { renderDateTime } from 'utils/stringRender';
import MapSignatureItems from '../../MapSignatureItems';
import { observer } from 'mobx-react';
import SlateEditors from 'components/shared-components/SlateEditors';
import { ParagraphContainer } from '../..';

const RenderCaseType = ({ draftColor }) => {
  const { reportItems = {}, signatureList = [] } = ReportStore;
  const offenseSource = _.get(reportItems, 'offense', {});
  const contentSource = _.get(reportItems, 'content', null) || null;
  const basicInformation = _.get(reportItems, 'basic_information', {});
  const instantCaseNumber = _.get(offenseSource, 'case.case_id', '');
  const evidenceCaseNumber = _.get(offenseSource, 'evidence_case_number', '');
  const evidenceCaseYear = _.get(offenseSource, 'evidence_case_year', '');
  const current = _.first(_.get(offenseSource, 'informer', []));
  const phoneNumber = _.get(current, 'contact.contact_phone_number', []);
  const cannotHaveCaseNumber = !instantCaseNumber && !evidenceCaseNumber && !evidenceCaseYear;

  const defaultValue = [
    cannotHaveCaseNumber
      ? ['คดีอาญาที่', instantCaseNumber || [evidenceCaseNumber, evidenceCaseYear].join('/')].join(' ')
      : '',
    offenseSource?.offense_detail
      ? [
          'ฐานความผิด',
          _.get(offenseSource, 'offense_detail', [])
            .map((e1) => _.get(e1, 'plaint', ''))
            .join(', '),
        ].join(' ')
      : '',
    offenseSource?.venue
      ? [
          'สถานที่เกิดเหตุ',
          _.get(offenseSource, 'venue', [])
            .map((ss, _key) => ({ plaintAddress: `(${_key + 1}) ${GenerateAddress(ss, true)}` }))
            .map((x) => x.plaintAddress)
            .join(', '),
        ]
      : '',
    'เหตุเกิดเมื่อวันที่',
    renderDateTime(_.get(basicInformation, 'start_date', null)),
    '\n',
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
    '\n\nมาสถานีตำรวจแจ้งว่า',
    '-',
    '\nข้าพเจ้ารับรองว่าเป็นความจริงทุกประการ\n',
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

export default observer(RenderCaseType);
