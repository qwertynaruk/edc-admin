import React, { useMemo } from 'react';
import { Space, Typography } from 'antd';
import _ from 'lodash';
import 'draft-js/dist/Draft.css';

import ReportStore from 'mobx/ReportStore';
import { BorderOutlined, CheckSquareOutlined } from '@ant-design/icons';
import { renderDateTime } from 'utils/stringRender';
import GenerateAddress from 'components/shared-components/GenerateAddress';
import FormPreference from 'utils/FormPreference';
import TermList from '../../../ReportFormControl/CardForm/Arresting/TermConditionList.json';
import { observer } from 'mobx-react';
import MapSignatureItems from '../../MapSignatureItems';
import MapParentSignatureItems from '../../MapParentSignatureItems';
import { ParagraphContainer } from '../..';
import SlateEditors from 'components/shared-components/SlateEditors';

const RenderJuvenileArrestingType = ({ draftColor }) => {
  const { reportItems = {}, signatureList = [] } = ReportStore;
  const arrestSource = _.get(reportItems, 'arrest', {});
  const accusationSource = _.get(arrestSource, 'accusation', null) || null;

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
    '\nเจ้าพนักงานตำรวจชุดจับกุม สภ.เมืองอุดรธานี ประกอบด้วย\n',
    internalArrests,
    '\n',
    externalArrests,
    '\n\nได้แจ้งแก่ผู้จับตามรายชื่อข้างล่างว่าเขาต้องถูกจับ\n',
    offenderSource,
    '\n\nพร้อมด้วยของกลางมี\n',
    evidenceProperty,
    '\nตำแหน่งที่พบของกลาง\n',
    _.get(arrestSource, 'evidence_location', ''),
    '\n',
  ].join(' ');

  const warrantDefaultValue = [
    arrestSource?.is_warrant ? ['โดยการจับกุมตามหมายจับ', _.get(arrestSource, 'warrant_id', '')].join('\n') : '',
  ].join(' ');

  return (
    <ParagraphContainer color={draftColor}>
      <Space className="gx-full-width gx-flex-end" align="start">
        <SlateEditors defaultValue={primaryDefaultValue} />
      </Space>
      <Space direction="vertical" style={{ marginTop: 10, fontSize: 14 }}>
        <Space className="gx-full-width" style={{ marginTop: 15, justifyContent: 'center' }}>
          <Typography.Text style={{ fontSize: 16 }} strong>
            บันทึกการจับกุมผู้ต้องหาที่เด็กหรือเยาวชน
          </Typography.Text>
        </Space>

        <br />
        <SlateEditors defaultValue={defaultValue} />

        <Typography.Text strong underline>
          ได้แจ้งให้ผู้ถูกจับ ทราบว่า
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
          เจ้าหน้าที่ตำรวจผู้จับได้แจ้งข้อกล่าวหาให้ผู้ถูกจับทราบว่า
        </Typography.Text>
        <div>
          <SlateEditors defaultValue={accusationSource} />
        </div>

        {_.get(arrestSource, 'is_warrant', false) && <SlateEditors defaultValue={warrantDefaultValue} />}

        {TermList.juvenile_section.map((ss, _key) => (
          <React.Fragment key={_key}>
            <Typography.Text strong>{_.get(ss, 'name', '-')}</Typography.Text>
            <div className="gx-pl-4">
              {_.get(ss, 'child', []).map((s3, _key3) => (
                <React.Fragment key={_key3}>
                  {_.get(arrestSource, 'term_condition_1', [])
                    .concat(_.get(arrestSource, 'term_condition_2', []), _.get(arrestSource, 'term_condition_3', []))
                    .includes(s3) ? (
                    <CheckSquareOutlined />
                  ) : (
                    <BorderOutlined />
                  )}
                  <Typography.Text className="gx-pl-2">{s3}</Typography.Text>
                  <br />
                </React.Fragment>
              ))}
            </div>
          </React.Fragment>
        ))}
        <Typography.Text underline>กรณีอยู่ด้วยในขณะจับกุม / ในโอกาสแรกเท่าที่สามารถทำได้</Typography.Text>

        <Typography.Text className="gx-pl-4">
          ทำบันทึกการจับกุม โดยแจ้งข้อกล่าวหาและรายละเอียดเกี่ยวกับเหตุแห่งการจับให้ผู้ถูกจับทราบ และได้กระทำต่อหน้า
          ผู้ปกครอง บุคคลหรือผู้แทนองค์กรซึ่งเด็กหรือเยาวชนอยู่ด้วย ในกรณีที่ขณะทำบันทึกมีบุคคลดังกล่าวอยู่ด้วย
        </Typography.Text>
        <Typography.Text className="gx-pl-4">
          ในการจับกุมและควบคุมได้กระทำโดยละมุนละม่อม โดยคำนึงถึงศักดิ์ศรีความเป็นมนุษย์
          และไม่เป็นการประจานมิได้ใช้วิธีการเกินกว่าที่จำเป็นเพื่อป้องกันการหลบหนีหรือเพื่อความปลอดภัยของเด็กหรือเยาวชนผู้ถูกจับ
          หรือบุคคลอื่น และมิได้ใช้เครื่องพันธนาการแก่เด็ก
        </Typography.Text>
        <Typography.Text className="gx-pl-4">
          เจ้าหน้าที่ตำรวจผู้จับได้อ่านบันทึกให้ผู้ถูกจับฟังแล้วและผู้ถูกจับได้อ่านด้วยตนเองแล้ว รับว่าถูกต้องและได้มอบ
          สำเนาบันทึก การจับกุมให้แก่ผู้ถูกจับเรียบร้อย จึงให้ลงลายมือชื่อไว้เป็นหลักฐาน
        </Typography.Text>
      </Space>

      <br />
      <br />
      <MapParentSignatureItems signatureList={signatureList} acceptField="offender" withoutName={true} />
      <br />
      <MapSignatureItems signatureList={signatureList} colSpan={12} ignoreField={['offender']} />
    </ParagraphContainer>
  );
};

export default observer(RenderJuvenileArrestingType);
