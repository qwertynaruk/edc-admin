import { Col, Modal, Row, Space, Spin, Typography } from 'antd';
import IconCustom from '@ant-design/icons';
import styled from '@emotion/styled';

import { ReactComponent as PersonelIcon } from 'assets/images/personel.svg';
import { ReactComponent as OrganizationIcon } from 'assets/images/organization.svg';
import { ReactComponent as VehicleIcon } from 'assets/images/vehicle.svg';
import { ReactComponent as PropertyDrugIcon } from 'assets/images/property-drug.svg';
import { ReactComponent as PropertyGunIcon } from 'assets/images/property-gun.svg';
import { ReactComponent as PropertyOtherIcon } from 'assets/images/property-other.svg';
import { ReactComponent as ExportCSVIcon } from 'assets/images/CSVOutlined.svg';
import { ReactComponent as ExportExcelIcon } from 'assets/images/excel-icon.svg';
import { ReactComponent as SelectNitiIcon } from 'assets/images/md-niti-icon.svg';
import { ReactComponent as SelectPersonIcon } from 'assets/images/md-person-icon.svg';
import { ReactComponent as PinPointIcon } from 'assets/images/pin-point-icon.svg';
import { ReactComponent as SelectAreaIcon } from 'assets/images/select-area-icon.svg';
import { ReactComponent as TrafficReportIcon } from 'assets/images/traffic-report-icon.svg';
import { ReactComponent as LostReportIcon } from 'assets/images/lost-report-icon.svg';
import { ReactComponent as EvidenceReportIcon } from 'assets/images/evidence-report-icon.svg';
import { ReactComponent as CaseReportIcon } from 'assets/images/case-report-icon.svg';

const { Text } = Typography;

const BoxRoute = styled.div`
  background: #1b2531;
  border: 1px dashed;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 1.5em 5px;
  cursor: pointer;
  transition: 0.5s all ease;

  &:hover {
    opacity: 0.6;
  }

  > .ant-typography {
    margin-top: 2em;
  }
`;

const DataIndicesCategorySelectModal = ({ actionState, visible, onOk, onCancel, category, loading = false }) => {
  const categories = [
    {
      icon: PersonelIcon,
      title: 'บุคคล',
      id: 'personel',
    },
    {
      icon: OrganizationIcon,
      title: 'หน่วยงานหรือองค์กร',
      id: 'organization',
    },
    {
      icon: VehicleIcon,
      title: 'เพิ่มข้อมูลยานพาหนะ',
      id: 'vehicle',
    },
    {
      icon: PropertyDrugIcon,
      title: 'เพิ่มข้อมูลทรัพย์สิน ประเภทยาเสพติด',
      id: 'drug',
    },
    {
      icon: PropertyDrugIcon,
      title: 'ประเภทยาเสพติด',
      id: 'select-drug',
    },
    {
      icon: PropertyGunIcon,
      title: 'เพิ่มข้อมูลทรัพย์สิน ประเภทอาวุธ',
      id: 'weapon',
    },
    {
      icon: PropertyGunIcon,
      title: 'ประเภทอาวุธ',
      id: 'select-weapon',
    },
    {
      icon: PropertyOtherIcon,
      title: 'เพิ่มข้อมูลทรัพย์สิน อื่นๆ',
      id: 'other',
    },
    {
      icon: PropertyOtherIcon,
      title: 'ประเภทอื่นๆ',
      id: 'select-other',
    },
    {
      icon: ExportCSVIcon,
      title: 'ไฟล์ CSV',
      id: 'csv',
    },
    {
      icon: ExportExcelIcon,
      title: 'ไฟล์ Excel',
      id: 'excel',
    },
    {
      icon: SelectPersonIcon,
      title: 'บุคคล',
      id: 'person',
    },
    {
      icon: SelectNitiIcon,
      title: 'นิติบุคคล',
      id: 'juristic',
    },
    {
      icon: PinPointIcon,
      title: 'จุดที่สนใจ',
      id: 'point-of-interest',
    },
    {
      icon: SelectAreaIcon,
      title: 'ซ้อนทับแผนที่',
      id: 'layer-overlay',
    },
    {
      icon: CaseReportIcon,
      title: 'ประจำวัน เกี่ยวกับคดีอาญา',
      id: 'DC',
    },
    {
      icon: EvidenceReportIcon,
      title: 'ประจำวัน รับแจ้งเป็นหลักฐาน',
      id: 'DE',
    },
    {
      icon: LostReportIcon,
      title: 'ประจำวัน รับแจ้งเอกสารหาย',
      id: 'DL',
    },
    {
      icon: TrafficReportIcon,
      title: 'ประจำวัน เกี่ยวกับคดีจราจร',
      id: 'DCT',
    },
  ];

  const stateTitle = {
    informer: 'เพิ่มผู้แจ้ง',
    authorization: 'เพิ่มผู้รับมอบอำนาจ',
    victim: 'ผู้เสียหาย',
    person_module: 'เลือกประเภทการเพิ่ม',
    property: 'เพิ่มรายละเอียดทรัพย์สิน',
    vehicle_property: 'เพิ่มทรัพย์สิน/ยานพาหนะ ที่ถูกประทุษร้าย',
    main_property: 'เพิ่มทรัพย์สิน',
    export_module: 'ส่งออกรายงาน',
    select_property: 'เลือกประเภททรัพย์สิน',
    map_gis: 'เพิ่มข้อมูล',
    close_daily_report: 'เลือกรายงานประจำวันที่ต้องการปิด',
  };

  const vers = categories.filter((e) => category.includes(e.id));

  return (
    <Modal
      visible={visible}
      title={stateTitle[actionState]}
      footer={null}
      onOk={onOk}
      onCancel={onCancel}
      width={vers.length > 3 ? 640 : 173.5 * vers.length}
    >
      <Spin spinning={loading}>
        <Row>
          {vers.map((el) => (
            <Col span={24 / vers.length} key={el.id}>
              <BoxRoute data-testid={el.id} onClick={() => onOk(el.id)}>
                <IconCustom component={el.icon} style={{ fontSize: '42px' }} />
                <Text className="gx-text-center">{el.title}</Text>
              </BoxRoute>
            </Col>
          ))}
        </Row>
      </Spin>

      {actionState === 'close_daily_report' && (
        <Space className="gx-full-width gx-mt-3">
          <Typography.Text style={{ color: 'red' }}>
            *** การกดปิดรายงานจะสามารถทำได้ในช่วงเวลา 23:50 - 00:00 น.
          </Typography.Text>
        </Space>
      )}
    </Modal>
  );
};

export default DataIndicesCategorySelectModal;
