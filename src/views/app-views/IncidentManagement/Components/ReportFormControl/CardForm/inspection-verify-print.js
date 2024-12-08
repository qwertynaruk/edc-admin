import { Card, Checkbox, Space, Typography } from 'antd';
import { useState } from 'react';

const { Text } = Typography;

const InspectionVerifyPrint = ({ iRef }) => {
  const [disableVerify, setDisableVerify] = useState(true);

  return (
    <Card ref={(el) => (iRef.current['สิทธิผู้ต้องหา'] = el)}>
      <Text strong>สิทธิผู้ต้องหา</Text>

      <Space direction="vertical" className="gx-mt-4">
        <Typography.Text style={{ paddingLeft: '1.5em' }}>๑. ผู้ถูกจับมีสิทธิที่จะให้การหรือไม่ก็ได้</Typography.Text>
        <Typography.Text style={{ paddingLeft: '1.5em' }}>
          ๒. ถ้อยคำของผู้ถูกจับนี้อาจใช้เป็นพยานหลักฐานในการพิจารณาคดีได้
        </Typography.Text>
        <Typography.Text style={{ paddingLeft: '1.5em' }}>
          ๓. ผู้ถูกจับมีสิทธิจะพบและปรึกษาทนายหรือผู้ซึ่งจะเป็นทนายความ
        </Typography.Text>
        <Typography.Text style={{ paddingLeft: '1.5em' }}>
          ๔. ถ้าผู้ถูกจับประสงค์จะแจ้งให้ญาติ หรือผู้ซึ่งตนไว้วางใจทราบถึงการจับกุมที่สามารถดำเนินการได้
          โดยสะดวกและไม่เป็นการขัดขวางการจับหรือการควบคุมผู้ถูกจับ หรือทำให้เกิดความไม่ปลอดภัยแก่บุคคลหนึ่งบุคคลใด
          เจ้าพนักงานสามารถอนุญาตให้ผู้ถูกจับดำเนินการได้ตามสมควรแก่กรณี
        </Typography.Text>
        <div className="gx-mt-2">
          <Checkbox onChange={(e) => setDisableVerify(!e.target.checked)}>
            เจ้าพนักงานได้แจ้งสิทธิขณะจับกุมให้ผู้ต้องหาทราบ
          </Checkbox>
        </div>
      </Space>
    </Card>
  );
};

export default InspectionVerifyPrint;
