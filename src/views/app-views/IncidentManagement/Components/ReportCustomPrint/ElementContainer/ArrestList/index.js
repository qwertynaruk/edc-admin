import { Typography } from 'antd';
import GenerateAddress from 'components/shared-components/GenerateAddress';
import _ from 'lodash';
import ReportStore from 'mobx/ReportStore';
import React from 'react';
import styled from '@emotion/styled';
import FormPreference from 'utils/FormPreference';
import { renderDateTime } from 'utils/stringRender';

const ParagraphBlock = styled(Typography.Paragraph)`
  background-color: #1b2531;
  padding: 5px;
  border-radius: 3px;
  line-height: 20px;
`;

const ArrestList = () => {
  const { reportItems = {} } = ReportStore;
  const aresstSource = _.get(reportItems, 'arrest', {});

  return (
    <>
      <ParagraphBlock>
        <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>วันเวลาที่บันทึกการจับกุม :</Typography.Text>
        <Typography.Text>{renderDateTime(_.get(aresstSource, 'record_at.datetime', null))}</Typography.Text>
      </ParagraphBlock>
      <ParagraphBlock>
        <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>วันเวลาที่จับกุม :</Typography.Text>
        <Typography.Text>{renderDateTime(_.get(aresstSource, 'arresting_date', null))}</Typography.Text>
      </ParagraphBlock>
      <ParagraphBlock>
        <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>สถานที่จับกุม :</Typography.Text>
        <Typography.Text>{GenerateAddress(_.get(aresstSource, 'arresting_location', null))}</Typography.Text>
      </ParagraphBlock>

      <ParagraphBlock>
        <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>อำนวยการโดย :</Typography.Text>

        <Typography.Text>
          {_.get(aresstSource, 'directed_officer', [])
            .map(
              (_troll, _kks) =>
                `(${_kks + 1}) ${[
                  _.get(_troll, 'dominate_abbreviation', ''),
                  _.get(_troll, 'first_name', ''),
                  _.get(_troll, 'last_name', ''),
                ].join(' ')}`
            )
            .join(', ')}
        </Typography.Text>
      </ParagraphBlock>

      <ParagraphBlock>
        <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>เจ้าหน้าที่จับกุมภายใน :</Typography.Text>
        <Typography.Text>
          {_.get(aresstSource, 'internal_arrest_unit.officer', [])
            .map(
              (_troll, _kks) =>
                `(${_kks + 1}) ${[
                  _.get(_troll, 'dominate_abbreviation', ''),
                  _.get(_troll, 'first_name', ''),
                  _.get(_troll, 'last_name', ''),
                ].join(' ')}`
            )
            .join(', ')}
        </Typography.Text>
      </ParagraphBlock>

      {_.get(aresstSource, 'external_arrest_unit', []).map((_unit, _key) => (
        <ParagraphBlock key={_key}>
          <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>
            เจ้าหน้าที่จับกุม {_unit?.organization_name} :
          </Typography.Text>
          <Typography.Text>
            {_.get(_unit, 'officer', [])
              .map((_troll, _kks) => `(${_kks + 1}) ${_troll?.name}`)
              .join(', ')}
          </Typography.Text>
        </ParagraphBlock>
      ))}

      {_.get(aresstSource, 'offender', []).map((ss, _index) => (
        <React.Fragment key={_index}>
          <ParagraphBlock>
            <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>ผู้ต้องหา ({_index + 1}) :</Typography.Text>
            <Typography.Text>
              {ss?.is_juristic ? (
                <FormPreference.ComplexJuristicFullname payload={ss} />
              ) : (
                <FormPreference.ComplexFullname payload={ss} withInspectData={true} />
              )}
            </Typography.Text>
          </ParagraphBlock>
        </React.Fragment>
      ))}

      {_.get(aresstSource, 'interpreter', []).map((ss, _index) => (
        <React.Fragment key={_index}>
          <ParagraphBlock>
            <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>ผู้ทำหน้าที่ล่าม :</Typography.Text>
            <Typography.Text>
              {ss?.is_juristic ? (
                <FormPreference.ComplexJuristicFullname payload={ss} />
              ) : (
                <FormPreference.ComplexFullname payload={ss} withInspectData={true} />
              )}
            </Typography.Text>
          </ParagraphBlock>
        </React.Fragment>
      ))}

      {_.get(aresstSource, 'evidence_property', []).map((ss, _index) => (
        <React.Fragment key={_index}>
          <ParagraphBlock>
            <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>ของกลาง ({_index + 1}):</Typography.Text>
            <FormPreference.PropertyContent typeIs={_.get(ss, 'asset_type', '')} payload={ss} />
          </ParagraphBlock>
        </React.Fragment>
      ))}

      {_.get(aresstSource, 'evidence_vehicle', []).map((ss, _index) => (
        <React.Fragment key={_index}>
          <ParagraphBlock>
            <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>ยานพาหนะ ({_index + 1}):</Typography.Text>
            {[
              _.get(ss, 'type', '-'),
              `ทะเบียน ${[
                _.get(ss, 'regis_character', ''),
                _.get(ss, 'regis_number', ''),
                _.get(ss, 'province', ''),
              ].join(' ')}`,
              _.get(ss, 'brand', ''),
              _.get(ss, 'model', ''),
            ].join(' ')}
          </ParagraphBlock>
        </React.Fragment>
      ))}

      {_.get(aresstSource, 'evidence_location', '') && (
        <ParagraphBlock>
          <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>ตำแหน่งของกลาง :</Typography.Text>
          <Typography.Text>{_.get(aresstSource, 'evidence_location', '')}</Typography.Text>
        </ParagraphBlock>
      )}

      <ParagraphBlock>
        <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>เจ้าพนักงานแจ้งสิทธิผู้ต้องหา :</Typography.Text>
        <Typography.Text>ไม่</Typography.Text>
      </ParagraphBlock>
    </>
  );
};

export default ArrestList;
