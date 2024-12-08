import { useMemo } from 'react';
import { Space, Typography } from 'antd';
import _ from 'lodash';
import 'draft-js/dist/Draft.css';

import ReportStore from 'mobx/ReportStore';
import { renderDateTime } from 'utils/stringRender';
import GenerateAddress from 'components/shared-components/GenerateAddress';
import FormPreference from 'utils/FormPreference';
import MapSignatureItems from '../../MapSignatureItems';
import { observer } from 'mobx-react';
import { ParagraphContainer } from '../..';
import SlateEditors from 'components/shared-components/SlateEditors';

const RenderArrestingType = ({ draftColor }) => {
  const { reportItems = {}, signatureList = [] } = ReportStore;
  const arrestSource = _.get(reportItems, 'arrest', {});

  const directOfficers = useMemo(() => {
    const isSource = arrestSource?.directed_officer || [];
    if (isSource.length <= 0) {
      return '';
    }

    try {
      return isSource
        .map((ss) =>
          [_.get(ss, 'dominate_abbreviation', ''), _.get(ss, 'first_name', ''), _.get(ss, 'last_name', '')].join(' ')
        )
        .join(', ');
    } catch (error) {
      return '';
    }
  }, [arrestSource]);

  const internalArrests = useMemo(() => {
    const isSource = arrestSource?.internal_arrest_unit?.officer || [];
    if (isSource.length <= 0) {
      return '';
    }

    try {
      return isSource
        .map((ss) =>
          [_.get(ss, 'dominate_abbreviation', ''), _.get(ss, 'first_name', ''), _.get(ss, 'last_name', '')].join(' ')
        )
        .join(', ');
    } catch (error) {
      return '';
    }
  }, [arrestSource]);

  const externalArrests = useMemo(() => {
    const isSource = arrestSource?.external_arrest_unit || [];
    if (isSource.length <= 0) {
      return '';
    }

    try {
      return isSource
        .map((ss, _key) =>
          [
            `${_key > 0 && '\n\n'}เจ้าพนักงานตำรวจชุดจับกุม ${ss?.organization_name} ประกอบด้วย`,
            _.get(ss, 'officer', [])
              .map((_tx) => _.get(_tx, 'name', ''))
              .filter((_txx) => _txx)
              .join(','),
          ].join(' ')
        )
        .join('\n');
    } catch (error) {
      return '';
    }
  }, [arrestSource]);

  const offenderSource = useMemo(() => {
    const isSource = arrestSource?.offender || [];

    if (isSource.length <= 0) {
      return '';
    }

    try {
      return isSource
        .map((ss, _index) =>
          [
            _index + 1,
            ss?.is_juristic
              ? [ss?.juristic_name, 'เลขที่ผู้เสียภาษี', ss?.id_juristic].join(' ')
              : [
                  FormPreference.ComplexFullname({ payload: ss, withInspectData: true }),
                  'อาชีพ',
                  _.get(ss, 'work_history.0.occupation', '-'),
                ].join(' '),
            'อยู่บ้านเลขที่',
            GenerateAddress(_.get(ss, 'contact.contact_home_address', ''), true),
          ].join(' ')
        )
        .join(',');
    } catch (error) {
      return '';
    }
  }, [arrestSource]);

  const evidenceProperty = useMemo(() => {
    const isPropSource = arrestSource?.evidence_property || [];
    const isVehicleSource = arrestSource?.evidence_vehicle || [];

    if (isPropSource.length <= 0 && isVehicleSource.length <= 0) {
      return '';
    }

    try {
      return isPropSource
        ?.concat(isVehicleSource)
        .map((ss, _index) =>
          [_index + 1, FormPreference.PropertyContentWithoutDom(ss?.asset_type?.vehicle, ss)].join('. ')
        );
    } catch (error) {
      return '';
    }
  }, [arrestSource]);

  const primaryDefaultValue = [
    'ปจว.ข้อ',
    _.get(arrestSource, 'related_report.report_record_id', ''),
    'ลงวันที่',
    renderDateTime(_.get(arrestSource, 'related_report.datetime', ''), 'only-day'),
    'เดือน',
    renderDateTime(_.get(arrestSource, 'related_report.datetime', ''), 'only-month'),
    ' พ.ศ',
    renderDateTime(_.get(arrestSource, 'related_report.datetime', ''), 'only-year'),
    'เวลา',
    renderDateTime(_.get(arrestSource, 'related_report.datetime', ''), 'only-time'),
    '\nคดีอาญาที่',
    [
      _.get(arrestSource, 'related_report.case_record_id', ''),
      _.get(arrestSource, 'related_report.case_year', ''),
    ].join('/'),
    '\nบัญชีของกลางลำดับที่',
    [
      _.get(arrestSource, 'related_report.evidence_central_account_number', ''),
      _.get(arrestSource, 'related_report.evidence_central_account_year', ''),
    ].join('/'),
  ].join(' ');

  const defaultValue = [
    'สถานที่บันทึกการจับกุม\n',
    _.get(arrestSource, 'record_at.location', '-'),
    '\n\nวัน / เดือน / ปี เวลา ที่บันทึก\n',
    renderDateTime(_.get(arrestSource, 'record_at.datetime', '')),
    '\n\nวัน / เดือน / ปี เวลา ที่จับกุม\n',
    renderDateTime(_.get(arrestSource, 'arresting_date', '')),
    '\n\nสถานที่จับกุม\n',
    GenerateAddress(_.get(arrestSource, 'arresting_location', ''), true),
    directOfficers ? '\n\nอำนวยการโดย\n' : '',
    directOfficers,
    '\n\nเจ้าพนักงานตำรวจชุดจับกุม สภ.เมืองอุดรธานี ประกอบด้วย\n',
    internalArrests,
    '\n',
    externalArrests,
    '\n\nได้ร่วมกันจับกุมตัวผู้ต้องหา ดังนี้\n',
    offenderSource,
    '\n\nพร้อมด้วยของกลางมี\n',
    evidenceProperty,
    '\nตำแหน่งที่พบของกลาง\n',
    _.get(arrestSource, 'evidence_location', ''),
    '\n\nโดยกล่าวหาว่า\n',
    _.get(arrestSource, 'accusation', ''),
    arrestSource?.is_warrant ? ['โดยการจับกุมตามหมายจับ', _.get(arrestSource, 'warrant_id', '')].join('\n') : '',
  ].join(' ');

  const contentDefaultValue = [
    'เหตุเกิดที่\n',
    GenerateAddress(_.get(arrestSource, 'venue', ''), true),
    '\nเหตุเกิดเมื่อ\n',
    renderDateTime(_.get(arrestSource, 'incident_date', '')),
    '\nการจับกุมครั้งนี้มี\n',
    FormPreference.ComplexPersonnel(_.get(arrestSource, 'accuser._id', '')),
    'เป็นผู้กล่าวหา\n',
    FormPreference.ComplexPersonnel(_.get(arrestSource, 'witness._id', '')),
    'เป็นพยาน',
  ].join(' ');

  return (
    <ParagraphContainer color={draftColor}>
      <Space className="gx-full-width gx-flex-end" align="start">
        <SlateEditors defaultValue={primaryDefaultValue} />
      </Space>

      <Space direction="vertical" style={{ marginTop: 10, fontSize: 14 }}>
        <Space className="gx-full-width" style={{ marginTop: 15, justifyContent: 'center' }}>
          <Typography.Text style={{ fontSize: 16 }} strong>
            บันทึกการจับกุมผู้ต้องหา
          </Typography.Text>
        </Space>

        <br />

        <SlateEditors defaultValue={defaultValue} />

        <Typography.Text strong underline>
          พร้อมทั้งแจ้งให้ผู้ถูกจับทราบด้วยว่า
        </Typography.Text>
        <Typography.Text className="gx-pl-4">๑. ผู้ถูกจับมีสิทธิที่จะไม่ให้การหรือให้การก็ได้</Typography.Text>
        <Typography.Text className="gx-pl-4">
          ๒. ถ้อยคำของผู้ถูกจับนั้นอาจใช้เป็นพยานหลักฐานในการพิจารณาคดีได้
        </Typography.Text>
        <Typography.Text className="gx-pl-4">
          ๓. ผู้ถูกจับมีสิทธิจะพบและปรึกษาทนายหรือผู้ซึ่งจะเป็นทนายความ
        </Typography.Text>
        <Typography.Text className="gx-pl-4">
          ๔. ถ้าผู้ถูกจับประสงค์จะแจ้งให้ญาติ หรือผู้ซึ่งตนไว้วางใจทราบถึงการจับกุมที่สามารถ
          ดำเนินการได้โดยสะดวกและไม่เป็นการขัดขวางการจับหรือการควบคุมถูกจับ หรือทำให้เกิดความไม่ปลอดภัย
          แก่บุคคลหนึ่งบุคคลใด เจ้าพนักงานสามารถอนุญาตให้ผู้ถูกจับดำเนินการได้ตามสมควรแก่กรณี
        </Typography.Text>
        <br />
        <Typography.Text strong underline>
          พฤติการณ์แห่งการจับกุม
        </Typography.Text>
        <div style={{ marginTop: '-1em' }}>
          <SlateEditors defaultValue={_.get(arrestSource, 'behaviour', '')} />
        </div>

        <Typography.Text strong underline>
          ผู้ต้องหาทราบข้อกล่าวหาและทราบสิทธิแล้วให้การ
        </Typography.Text>
        <div style={{ marginTop: '-1em' }}>
          <SlateEditors defaultValue={_.get(arrestSource, 'testimony', '')} />
        </div>

        <br />
        <SlateEditors defaultValue={contentDefaultValue} />
        <MapSignatureItems signatureList={signatureList} acceptField="offender" withoutName={true} />
        <br />

        <Typography.Text className="gx-pl-4">
          อนึ่ง ในการจับกุมในครั้งนี้เจ้าพนักงานผู้จับกุม มิได้บังคับขู่เข็ญ ทรมาน หรือทำร้ายร่างกาย หรือจิตใจ
          ของผู้ถูกจับกุมหรือ ของผู้ใด และมิได้ทำให้ทรัพย์สินของผู้ถูกจับกุม หรือของผู้ใด เสียหาย สูญหาย
          หรือเสื่อมค่าแต่อย่างใด เจ้าหน้าที่ตำรวจผู้จับ ได้อ่านบันทึกให้ผู้ถูกจับฟังแล้ว
          และผู้ถูกจับได้อ่านด้วยตนเองแล้ว รับรองว่าถูกต้องและได้มอบสำเนาบันทึกการจับกุม ให้แก่ผู้ถูกจับ เรียบร้อย
          จึงให้ลงลายมือชื่อไว้เป็นหลักฐาน
        </Typography.Text>
      </Space>
      <br />
      <br />
      <Space className="gx-full-width gx-justify-content-center gx-mb-4">
        <Typography.Title level={5}>ลงลายมือชื่อ เจ้าหน้าที่</Typography.Title>
      </Space>
      <MapSignatureItems signatureList={signatureList} colSpan={12} ignoreField={['offender']} />
    </ParagraphContainer>
  );
};

export default observer(RenderArrestingType);
