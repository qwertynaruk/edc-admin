import { Button } from 'antd';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import Guarded from 'components/shared-components/Guarded';
import SettingPermissionModal from 'components/shared-components/Modals/Permission/SettingPermissionModal';
import _ from 'lodash';
import { observer } from 'mobx-react';
import ReportStore from 'mobx/ReportStore';
import { useState } from 'react';
import ChangeOwner from './ModalList/change-owner';
import EmailReport from './ModalList/email-report';
import ReportApproval from './ReportApproval';

const MenuControlPanel = ({
  itemId,
  pdfAccess = true,
  canChageOwner = true,
  expandSeeMore = false,
  appendMenu = null,
  pageLabel = { master: 'รายงาน', subpath: 'แก้ไขรายการ' },
  exportItYet = false,
  approveModalStateControl,
  guardedProps = { query: null, directAccess: true },
}) => {
  const { urlPdf = '', typesItems, reportItems } = ReportStore;
  const reportId = _.get(reportItems, '_id', '-');
  const [visibleChangeOwnerModal, setVisibleChangeOwnerModal] = useState(false);
  const [visibleSendEmailModal, setVisibleSendEmailModal] = useState(false);
  const [visibleSettingPermissionModal, setVisibleSettingPermissionModal] = useState(false);

  const onMenuClick = (e) => {
    switch (e.key) {
      case 'change-owner':
        setVisibleChangeOwnerModal(true);
        break;

      case 'send-email':
        setVisibleSendEmailModal(true);
        break;

      case 'setting-permission':
        setVisibleSettingPermissionModal(true);
        break;

      default:
        break;
    }
  };

  const onSettingPermissionFinish = (values) => {
    ReportStore.updateReport(values, reportId);
    setVisibleSettingPermissionModal(false);
  };

  return (
    <>
      <PageBreadcrumb pageLabel={pageLabel}>
        <Guarded {...guardedProps}>
          {typesItems?.report_type?.is_report_approval && (
            <ReportApproval pdfAccess={pdfAccess} itemId={itemId} controls={approveModalStateControl} />
          )}
          {exportItYet && (
            <Button ghost onClick={() => urlPdf && window.open(urlPdf, '_blank')}>
              รายงานที่ถูกพิมพ์
            </Button>
          )}
          {/* <Button ghost>ประวัติ</Button> */}

          {/* <Dropdown overlay={<ReportOriginCreateList originId={itemId} />} trigger="click">
            <Button ghost>สร้างรายงานที่เกี่ยวข้อง</Button>
          </Dropdown> */}

          {/* {expandSeeMore ? (
            <>
              {appendMenu}
              <Button ghost>
                <Link
                  to={`/app/case-management/case-id-list/case-create/report/${itemId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  สร้างเคสจากรายงานนี้
                </Link>
              </Button>
            </>
          ) : (
            <Dropdown
              overlay={
                <Menu onClick={onMenuClick}>
                  {canChageOwner && <Menu.Item key="change-owner">เปลี่ยนผู้รับผิดชอบ</Menu.Item>}
                  <Menu.Item key="create-case">
                    <Link
                      to={`/app/case-management/case-id-list/case-create/report/${itemId}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      สร้างเคสจากรายงานนี้
                    </Link>
                  </Menu.Item>
                  {exportItYet && <Menu.Item key="send-email">ส่งรายงานผ่านอีเมล</Menu.Item>}
                  <Menu.Item key="setting-permission">ตั้งค่าสิทธิ์การเข้าถึง</Menu.Item>
                </Menu>
              }
              trigger="click"
            >
              <Button ghost>เพิ่มเติม</Button>
            </Dropdown>
          )} */}
        </Guarded>
      </PageBreadcrumb>

      <ChangeOwner visible={visibleChangeOwnerModal} setVisible={setVisibleChangeOwnerModal} />

      <EmailReport visible={visibleSendEmailModal} setVisible={setVisibleSendEmailModal} />

      <SettingPermissionModal
        controls={[visibleSettingPermissionModal, setVisibleSettingPermissionModal]}
        permissions={_.get(reportItems, 'list_permission', [])}
        onFinish={onSettingPermissionFinish}
      />
    </>
  );
};

export default observer(MenuControlPanel);
