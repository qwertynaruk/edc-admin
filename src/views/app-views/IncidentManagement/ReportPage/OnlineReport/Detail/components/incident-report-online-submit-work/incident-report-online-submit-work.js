import { Button, Card, Typography } from 'antd';

import { SubmitWorkDialog } from './components/submit-work-dialog';
import { useState } from 'react';

export const IncidentReportOnlineSubmitWork = () => {
  const [isOpenSubmitWorkDialog, setOpenSubmitWorkDialog] = useState(false);

  const onToggleSubmitWorkDialog = () => setOpenSubmitWorkDialog((prevState) => !prevState);

  return (
    <>
      <Card
        title="หน่วยงานที่รับผิดชอบ"
        extra={
          <Button type="primary" onClick={onToggleSubmitWorkDialog}>
            ส่งงานต่อ
          </Button>
        }
      >
        <Typography.Text>สน.เมืองอ่างทอง</Typography.Text>
      </Card>
      <SubmitWorkDialog open={isOpenSubmitWorkDialog} onClose={onToggleSubmitWorkDialog} />
    </>
  );
};
