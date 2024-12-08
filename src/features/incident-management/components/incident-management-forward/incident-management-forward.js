import { Button, Card } from 'antd';

import CloudConstant from 'constants/CloudConstant';
import { GuardHandlesV2 } from 'components/shared-components/Guarded';
import { IncidentManagementForwardDialog } from './components/incident-management-forward-dialog';
import { css } from '@emotion/css';
import { useMemo } from 'react';
import { useToggle } from '@mantine/hooks';

export const IncidentManagementForward = ({ incidentId, data = null }) => {
  const { canUpdate } = GuardHandlesV2({ group: 'Incident Management', type: 'รายงานการแจ้งเหตุออนไลน์' });
  const [isOpenForwardCaseDialog, onToggleForwardCaseDialog] = useToggle();

  const checkAction = useMemo(
    () =>
      CloudConstant.WEBFORM_REQUEST_STATUS[0].value === data?.status ||
      CloudConstant.WEBFORM_REQUEST_STATUS[1].value === data?.status,
    [data]
  );

  return (
    <>
      {checkAction && (
        <>
          <Card
            title="หน่วยงานที่รับผิดชอบ"
            extra={
              canUpdate ? (
                <Button type="primary" onClick={() => onToggleForwardCaseDialog()}>
                  ส่งงานต่อ
                </Button>
              ) : (
                <></>
              )
            }
            className={css`
              .ant-card-body {
                padding: 0 !important;
              }
            `}
          ></Card>
          <IncidentManagementForwardDialog
            incidentId={incidentId}
            data={data}
            open={isOpenForwardCaseDialog}
            onClose={onToggleForwardCaseDialog}
          />
        </>
      )}
    </>
  );
};
