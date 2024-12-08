import { Button, Popover } from 'antd';
import _ from 'lodash';

export default function OrganizationTreeTitleTooltip(props) {
  const { total = 0, direct = 0, indirect = 0 } = props;
  const clamp = (num) => (num > 99 ? '99+' : _.clamp(num, 0, 99));
  return (
    <Popover
      content={
        <div>
          <p>{direct} ผู้ใต้บังคับบัญชาโดยตรง</p>
          <p>{indirect} ผู้ใต้บังคับบัญชาโดยอ้อม</p>
          <p>{total} ทั้งหมด</p>
        </div>
      }
      title="ผู้อยู่ใต้บังคับบัญชา"
    >
      <Button type="primary" shape="circle" icon={<>{clamp(total)}</>} />
    </Popover>
  );
}
