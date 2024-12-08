import { Button, Card, Col, Form, Row, Space, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';

import ElementContainer from './ElementContainer';
import PDFArticleTemplate from './PDFArticleTemplate';
import PDFTableTemplate from './PDFTableTemplate';
import ReportStore from 'mobx/ReportStore';
import SignatureContainer from './SignatureContainer';
import Swal from 'sweetalert2';
import _ from 'lodash';
import html2canvas from 'html2canvas';
import jsPdf from 'jspdf';
import styled from '@emotion/styled';
import { useReactToPrint } from 'react-to-print';

export const ParagraphContainer = styled.div`
  color: #000 !important;

  .ant-typography {
    color: #000 !important;

    &.editeble {
      color: ${(props) => props.color} !important;
    }
  }
`;

const ReportCustomPrint = ({
  reportTypeName = 'รายงานประจำวัน',
  stepCurrent,
  approveModalStateControl = [false, () => {}],
}) => {
  const { typesItems = {}, reportItems } = ReportStore;
  const [, setApprovalModalVisible] = approveModalStateControl;
  const containerSize = { width: 796, height: 1100 };
  const [form] = Form.useForm();
  const componentRef = useRef(null);
  const itemsRef = useRef(null);

  const [draftColor, setDraftColor] = useState('#bbb');
  const [preload, setPreload] = useState(false);
  const [bookIndex, setBookIndex] = useState('0000');
  const [numberIndex, setNumberIndex] = useState('0000');
  const [sequenceIndex, setSequenceIndex] = useState('0');
  const [draftView, setDraftView] = useState(true);

  const maxIndexCount = 5;

  useEffect(() => {
    if (stepCurrent === 1) {
      itemsRef.current.scrollIntoView({ behavior: 'smooth' });
      ReportStore.setSignatureList(form.getFieldsValue());
    }
  }, [stepCurrent]);

  const onHandleValuesChange = () => {
    ReportStore.setSignatureList(form.getFieldsValue());
  };

  const onPreview = () => {
    setDraftView(true);
    setDraftColor('#000');
    onUsePrint();
  };

  const onPrint = () => {
    const submitStatus = _.get(reportItems, 'submit_status');
    if (submitStatus !== 'อนุมัติ' && typesItems?.report_type?.is_report_approval) {
      Swal.fire({
        icon: 'warning',
        title: 'รายงานยังไม่ผ่านอนุมัติ',
        text: `กรุณาส่งคำขออนุมัติหากต้องการออกรายงาน`,
        showCancelButton: true,
        confirmButtonText: 'ส่งคำขออนุมัติ',
        confirmButtonColor: '#1b2531',
        cancelButtonText: 'รับทราบ',
      }).then((result) => {
        const { isConfirmed } = result;
        if (!isConfirmed) return;
        setApprovalModalVisible(true);
      });
      return;
    }

    setDraftColor('#000');
    setPreload(true);

    Swal.fire({
      title: 'กรุณารอสักครู่',
      text: `ระบบกำลังจัดเตรียมไฟล์เอกสารสำหรับรายงาน ${_.get(reportItems, 'report_record_id', '')}`,
      timer: 0,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const appendZero = (_unit, count = 1) => {
      const _newStr = (_unit + count).toString();
      let _tx = '';
      for (let index = _newStr.length; index < 4; index++) {
        _tx += '0';
      }

      return _tx + _newStr;
    };

    const bookIndexLogic = (_unit) => {
      const numberIndex = _.get(typesItems, 'report_type.report_number_id', 0);
      return appendZero(_unit, numberIndex >= maxIndexCount ? 1 : 0);
    };

    const numberIndexLogic = (_unit) => {
      const numberIndex = _.get(typesItems, 'report_type.report_number_id', 0);
      return appendZero(numberIndex >= maxIndexCount ? 0 : _unit);
    };

    const generateSubmit = {
      report_book_id: bookIndexLogic(_.get(typesItems, 'report_type.report_book_id', 1)),
      report_number_id: numberIndexLogic(_.get(typesItems, 'report_type.report_number_id', 0)),
      report_sequence_id: _.get(typesItems, 'report_type.report_sequence_id', 0),
    };

    setDraftView(false);
    setBookIndex(generateSubmit.report_book_id);
    setNumberIndex(generateSubmit.report_number_id);
    setSequenceIndex(generateSubmit.report_sequence_id);

    setTimeout(() => {
      onRegisPki(generateSubmit);
    }, 1000);
  };

  const onRegisPki = (generateSubmit) => {
    html2canvas(componentRef.current).then((canvas) => {
      const _img = canvas.toDataURL('image/jpeg');
      // eslint-disable-next-line new-cap
      const pdf = new jsPdf('p', 'in', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      pdf.addImage(_img, 'JPEG', 0, 0, width, height);

      // pdf.save(`${new Date().toISOString()}.pdf`);

      const { reportItems } = ReportStore;
      const _now = new Date();
      const sequenceId = parseInt(generateSubmit.report_sequence_id) + 1;

      ReportStore.createSignPKI(pdf.output('datauristring'))
        .then((url) => {
          const numberParse = {
            report_book_id: generateSubmit.report_book_id,
            report_number_id: generateSubmit.report_number_id,
            report_sequence_id: sequenceId,
          };

          // const { evidence_central_account_number = '', evidence_central_account_year = '' } = reportItems;

          // if (evidence_central_account_number && evidence_central_account_year) {
          //   // ReportStore.updateEvidenceUpsert(0, numberParse);
          // }

          window.open(url, '_blank');
          // for test
          // ReportStore.updateReport(
          //   {
          //     ...numberParse,
          //     is_exported: true,
          //     exported_at: _now,
          //     status: 'เสร็จสิ้น',
          //   },
          //   _.get(reportItems, '_id', '-')
          // )
          //   .then(() => {
          //     window.open(url, '_blank');
          //     window.location.reload();
          //   })
          //   .finally(() => Swal.close());
        })
        .finally(() => {
          setPreload(false);
          setBookIndex('0000');
          setNumberIndex('0000');
          setSequenceIndex('0');
        });
    });
  };

  const eventAfterPrint = (ss) => {
    console.log(ss);
    setDraftColor('#bbb');
    setPreload(false);
    setDraftView(true);
  };

  const onUsePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: eventAfterPrint,
    documentTitle: 'report',
    removeAfterPrint: true,
    pageStyle: '@page { size: 8.3in 11.7in; margin: 0; }',
  });

  return (
    <Row ref={(ss) => (itemsRef.current = ss)}>
      <Col span={17}>
        <Spin spinning={preload}>
          <Form form={form} layout="vertical" onFieldsChange={onHandleValuesChange}>
            {['รายงานการสืบสวน', 'รายงานการจับกุม', 'รายงานการจับกุม (เยาวชน)'].includes(reportTypeName) ? (
              <PDFArticleTemplate
                reportTypeName={reportTypeName}
                componentRef={componentRef}
                draftColor={draftColor}
                containerSize={containerSize}
              />
            ) : (
              <PDFTableTemplate
                reportTypeName={reportTypeName}
                componentRef={componentRef}
                draftColor={draftColor}
                containerSize={containerSize}
                bookIndex={bookIndex}
                numberIndex={numberIndex}
                sequenceIndex={sequenceIndex}
                draftView={draftView}
              />
            )}

            <SignatureContainer form={form} />
          </Form>
        </Spin>
        <Card>
          <Space className="gx-full-width gx-flex-end">
            <Button onClick={onPreview}>ดูตัวอย่างก่อนพิมพ์</Button>
            <Button loading={preload} type="primary" onClick={() => onPrint()}>
              บันทึกและสั่งพิมพ์
            </Button>
          </Space>
        </Card>
      </Col>
      <Col span={7}>
        <ElementContainer />
      </Col>
    </Row>
  );
};

export default ReportCustomPrint;
