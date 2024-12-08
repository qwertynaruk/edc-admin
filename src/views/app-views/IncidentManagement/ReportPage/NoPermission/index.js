import NoPermission from 'components/shared-components/NoPermission';
import { useNavigate } from 'react-router-dom';

function ReportNoPermission() {
  const navigate = useNavigate();
  return (
    <NoPermission
      onOk={() => {
        navigate('../');
      }}
    >
      <span>ไม่มีสิทธิ์การเข้าถึงรายงาน</span>
      <span>หากต้องการสิทธิ์การเข้าถึงกรุณาติดต่อเจ้าหน้าที่ที่เกี่ยวข้อง</span>
    </NoPermission>
  );
}

export default ReportNoPermission;
