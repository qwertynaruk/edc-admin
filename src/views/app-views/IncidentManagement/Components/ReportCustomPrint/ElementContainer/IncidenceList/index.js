import { Typography } from 'antd';
import GenerateAddress from 'components/shared-components/GenerateAddress';
import _ from 'lodash';
import ReportStore from 'mobx/ReportStore';
import React from 'react';
import styled from '@emotion/styled';
import FormPreference from 'utils/FormPreference';

const ParagraphBlock = styled(Typography.Paragraph)`
  background-color: #1b2531;
  padding: 5px;
  border-radius: 3px;
  line-height: 20px;
`;

const IncidenceList = () => {
  const { reportItems = {} } = ReportStore;
  const eventSource = _.get(reportItems, 'event', {});

  return (
    <>
      {_.get(eventSource, 'venue', []).map((ss, _index) => (
        <React.Fragment key={_index}>
          <ParagraphBlock>
            <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>สถานที่เกิดเหตุ ({_index + 1}):</Typography.Text>
            <Typography.Text>{GenerateAddress(ss)}</Typography.Text>
          </ParagraphBlock>
        </React.Fragment>
      ))}

      {_.get(eventSource, 'informer', []).map((ss, _index) => (
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

      {_.get(eventSource, 'interpreter', []).map((ss, _index) => (
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

      {_.get(eventSource, 'attorney', []).map((ss, _index) => (
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

      {_.get(eventSource, 'victim', []).map((ss, _index) => (
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

      {_.get(eventSource, 'suspect', []).map((ss, _index) => (
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

      {_.get(eventSource, 'witness', []).map((ss, _index) => (
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

      {_.get(eventSource, 'related_third_party', []).map((ss, _index) => (
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

      {_.get(eventSource, 'property', []).map((ss, _index) => (
        <React.Fragment key={_index}>
          <ParagraphBlock>
            <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>ของกลาง ({_index + 1}):</Typography.Text>
            <FormPreference.PropertyContent typeIs={_.get(ss, 'asset_type', '')} payload={ss} />
          </ParagraphBlock>
        </React.Fragment>
      ))}

      {_.get(eventSource, 'vehicle', []).map((ss, _index) => (
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

export default IncidenceList;
