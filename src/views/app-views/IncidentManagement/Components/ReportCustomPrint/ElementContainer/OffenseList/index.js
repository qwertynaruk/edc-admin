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

const OffenseList = () => {
  const { reportItems = {} } = ReportStore;
  const offenseSource = _.get(reportItems, 'offense', {});

  return (
    <>
      {_.get(offenseSource, 'offense_detail', []).map((ss, _index) => (
        <React.Fragment key={_index}>
          <ParagraphBlock>
            <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>ฐานความผิด ({_index + 1}):</Typography.Text>
            <Typography.Text>{_.get(ss, 'criminal_method', '-')}</Typography.Text>
          </ParagraphBlock>
          <ParagraphBlock>
            <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>
              วันเวลาที่กระทำความผิด ({_index + 1}):
            </Typography.Text>
            <Typography.Text>
              {_.get(ss, 'period_date', []).length > 0 ? renderDateTime(ss.period_date[0]) : 'ไม่ทราบวันที่ทำความผิด'}
            </Typography.Text>
          </ParagraphBlock>

          {_.get(ss, 'period_date', []).length > 0 && (
            <ParagraphBlock>
              <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>
                วันเวลาที่สิ้นสุดกระทำความผิด ({_index + 1}):
              </Typography.Text>
              <Typography.Text>{renderDateTime(ss.period_date[1])}</Typography.Text>
            </ParagraphBlock>
          )}
        </React.Fragment>
      ))}

      {_.get(offenseSource, 'venue', []).map((ss, _index) => (
        <React.Fragment key={_index}>
          <ParagraphBlock>
            <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>สถานที่เกิดเหตุ ({_index + 1}):</Typography.Text>
            <Typography.Text>{GenerateAddress(ss)}</Typography.Text>
          </ParagraphBlock>
        </React.Fragment>
      ))}

      {_.get(offenseSource, 'informer', []).map((ss, _index) => (
        <React.Fragment key={_index}>
          <ParagraphBlock>
            <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>ผู้แจ้ง :</Typography.Text>
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

      {_.get(offenseSource, 'interpreter', []).map((ss, _index) => (
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

      {_.get(offenseSource, 'attorney', []).map((ss, _index) => (
        <React.Fragment key={_index}>
          <ParagraphBlock>
            <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>ผู้มอบอำนาจ :</Typography.Text>
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

      {_.get(offenseSource, 'victim', []).map((ss, _index) => (
        <React.Fragment key={_index}>
          <ParagraphBlock>
            <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>ผู้เสียหาย ({_index + 1}):</Typography.Text>
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

      {_.get(offenseSource, 'suspect', []).map((ss, _index) => (
        <React.Fragment key={_index}>
          <ParagraphBlock>
            <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>ผู้ต้องสงสัย ({_index + 1}):</Typography.Text>
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

      {_.get(offenseSource, 'witness', []).map((ss, _index) => (
        <React.Fragment key={_index}>
          <ParagraphBlock>
            <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>พยาน ({_index + 1}):</Typography.Text>
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

      {_.get(offenseSource, 'related_third_party', []).map((ss, _index) => (
        <React.Fragment key={_index}>
          <ParagraphBlock>
            <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>
              บุคคล หรือนิติบุคคล ที่เกี่ยวข้อง ({_index + 1}):
            </Typography.Text>
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

      {_.get(offenseSource, 'property', []).map((ss, _index) => (
        <React.Fragment key={_index}>
          <ParagraphBlock>
            <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>ของกลาง ({_index + 1}):</Typography.Text>
            <FormPreference.PropertyContent typeIs={_.get(ss, 'asset_type', '')} payload={ss} />
          </ParagraphBlock>
        </React.Fragment>
      ))}

      {_.get(offenseSource, 'vehicle', []).map((ss, _index) => (
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
    </>
  );
};

export default OffenseList;
