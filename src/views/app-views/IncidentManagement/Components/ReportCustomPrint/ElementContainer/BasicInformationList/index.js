import { Typography } from 'antd';
import PersonnelSelectWidget from 'components/shared-components/PersonnelSelectWidget';
import _ from 'lodash';
import ReportStore from 'mobx/ReportStore';
import styled from '@emotion/styled';
import { renderDateTime, renderPersonnelName } from 'utils/stringRender';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import FuncStore from 'mobx/FuncStore';
import PersonnelService from 'services/PersonelService';

const ParagraphBlock = styled(Typography.Paragraph)`
  background-color: #1b2531;
  padding: 5px;
  border-radius: 3px;
  line-height: 20px;
  cursor: pointer;
`;

const MapDataSource = {
  online: 'ได้รับแจ้งออนไลน์',
  flagrant: 'เหตุซึ่งหน้า',
  walkin: 'เข้ารับบริการที่สถานี',
  '': '-',
};

const BasicInformationList = () => {
  const { reportItems = {} } = ReportStore;
  const basicInformation = _.get(reportItems, 'basic_information', {});

  useEffect(() => {
    initProcess(basicInformation);
  }, [basicInformation]);

  const initProcess = async (originSource) => {
    const { start_date, end_date, data_source, updated_at, recorder, inquisitor } = originSource;

    const startDate = start_date ? `วันที่และเวลาที่เกิดเหตุ ${renderDateTime(start_date)}` : null;
    const endDate = end_date ? `วันที่และเวลาที่สิ้นสุด ${renderDateTime(end_date)}` : null;
    const dataSource = data_source ? `ที่มาของข้อมูล ${renderDateTime(data_source)}` : null;
    const hasRecorder = recorder ? `ผู้บันทึกรายงาน ${await PlainPersonnelText(recorder)}` : null;
    const updatedAt = updated_at ? `วันที่และเวลาบันทึก ${renderDateTime(updated_at)}` : null;
    const hasInquisitor = inquisitor ? `พนักงานสอบสวน ${await PlainPersonnelText(inquisitor)}` : null;

    const suggestions = [startDate, endDate, dataSource, hasRecorder, updatedAt, hasInquisitor];
    FuncStore.setItemSuggestion(suggestions);
  };

  const PlainPersonnelText = async (_id) => {
    const res = await PersonnelService.getById(_id);
    const { data = null } = res;

    return data ? renderPersonnelName(data) : null;
  };

  return (
    <>
      <ParagraphBlock>
        <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>วันที่และเวลาที่เกิดเหตุ :</Typography.Text>
        <Typography.Text>{renderDateTime(_.get(basicInformation, 'start_date', null))}</Typography.Text>
      </ParagraphBlock>
      <ParagraphBlock>
        <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>วันที่และเวลาที่สิ้นสุด :</Typography.Text>
        <Typography.Text>{renderDateTime(_.get(basicInformation, 'end_date', null))}</Typography.Text>
      </ParagraphBlock>
      <ParagraphBlock>
        <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>ที่มาของข้อมูล :</Typography.Text>
        <Typography.Text>{MapDataSource[_.get(basicInformation, 'data_source', '')]}</Typography.Text>
      </ParagraphBlock>
      <ParagraphBlock>
        <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>ผู้บันทึกรายงาน :</Typography.Text>
        <Typography.Text>
          <PersonnelSelectWidget viewMode={{ enable: true, values: _.get(basicInformation, 'recorder', '') }} />
        </Typography.Text>
      </ParagraphBlock>
      <ParagraphBlock>
        <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>วันที่และเวลาบันทึก :</Typography.Text>
        <Typography.Text>{renderDateTime(_.get(reportItems, 'updated_at', ''))}</Typography.Text>
      </ParagraphBlock>
      <ParagraphBlock>
        <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>พนักงานสอบสวน :</Typography.Text>
        <Typography.Text>
          <PersonnelSelectWidget
            viewMode={{
              enable: true,
              values: _.get(basicInformation, 'inquisitor', _.get(basicInformation, 'recorder', '')),
            }}
          />
        </Typography.Text>
      </ParagraphBlock>
    </>
  );
};

export default observer(BasicInformationList);
