import _ from 'lodash';

import ReportStore from 'mobx/ReportStore';
import FormPreference from 'utils/FormPreference';
import GenerateAddress from 'components/shared-components/GenerateAddress';
import MapSignatureItems from '../../MapSignatureItems';
import { observer } from 'mobx-react';
import { renderDateTime } from 'utils/stringRender';
import SlateEditors from 'components/shared-components/SlateEditors';
import { useMemo } from 'react';
import { ParagraphContainer } from '../..';

const RenderDocsType = ({ draftColor }) => {
  const { reportItems = {}, signatureList = [] } = ReportStore;
  const eventSource = _.get(reportItems, 'event', {});
  const tx = _.get(eventSource, 'informer', []);
  const current = _.get(tx, '0', {});

  const mapItemIs = useMemo(() => {
    const rawSource = reportItems?.event?.property || [];

    if (rawSource?.length <= 0) {
      return '';
    }

    try {
      const tm = [];
      _.forEach(rawSource, (ss, _index) =>
        tm.push(
          [
            _index + 1,
            FormPreference.PropertyContentWithoutDom(_.get(ss, 'asset_type', ''), ss),
            'ปรากฏว่าได้หายไป',
          ].join(' ')
        )
      );

      return tm.join('\n');
    } catch (error) {
      return '';
    }
  }, [reportItems]);

  const defaultValue = [
    current?.is_juristic
      ? [current?.juristic_name, 'เลขที่ผู้เสียภาษี', current?.id_juristic].join(' ')
      : [
          FormPreference.ComplexFullname({ payload: current, withInspectData: true }),
          'อาชีพ',
          _.get(current, 'work_history.0.occupation', '-'),
        ].join(' '),
    'อยู่บ้านเลขที่',
    GenerateAddress(_.get(current, 'contact.contact_home_address', ''), true),
    '\n\nมาสถานีตำรวจแจ้งว่า เมื่อวันที่',
    renderDateTime(_.get(reportItems, 'basic_information.start_date', null), 'only-day'),
    'เดือน',
    renderDateTime(_.get(reportItems, 'basic_information.start_date', null), 'only-month'),
    'พ.ศ.',
    renderDateTime(_.get(reportItems, 'basic_information.start_date', null), 'only-year'),
    'เวลา',
    renderDateTime(_.get(reportItems, 'basic_information.start_date', null), 'only-time'),
    'น.',
    '\n\n',
    'ข้าพเจ้าได้ตรวจสอบเอกสารดังต่อไปนี้\n',
    mapItemIs,
    '\n\nเหตุเกิดที่',
    _.get(eventSource, 'venue', [])
      .map((ss, _key) => ({ plaintAddress: `(${_key + 1}) ${GenerateAddress(ss, true)}` }))
      .map((x) => x.plaintAddress)
      .join(', '),
    '\nข้าพเจ้ารับรองว่าเป็นความจริงทุกประการ\n\n',
    FormPreference.ComplexPersonnel(_.get(reportItems, 'basic_information.recorder', '')),
    'ตำแหน่ง',
    FormPreference.ComplexPersonnel(_.get(reportItems, 'basic_information.recorder', ''), 'position'),
    '\nได้รับแจ้งความตามประสงค์ผู้แจ้งไว้แล้ว จึงบันทึกไว้เป็นหลักฐาน\n\n',
  ].join(' ');

  return (
    <ParagraphContainer color={draftColor}>
      <SlateEditors defaultValue={defaultValue} />
      <br />

      <MapSignatureItems signatureList={signatureList} colPositionNiche={true} />
    </ParagraphContainer>
  );
};

export default observer(RenderDocsType);
