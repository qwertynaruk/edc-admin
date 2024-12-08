import { COLOR_NOTIFICATION_HIGHLIGHT, NOTIFICATION_TYPE } from 'constants/NotificationConstant';

import { ThaiDateTime } from './ThaiDateTime';

export const findNotification = (item = null) => {
  const finNoti = NOTIFICATION_TYPE.find((rowData) => rowData.type === item?.notification_type);
  let title = '';
  let detail = '';
  const createTime = (
    <>
      <span>{item?.created_at ? ThaiDateTime(item.created_at, 'short-month-full') : ''}</span>
      <span>{item?.is_read === false ? 'New' : ''}</span>
    </>
  );
  if (item?.notification_type === NOTIFICATION_TYPE[0].type) {
    // รอ api ทำเพิ่ม

    title = (
      <>
        <span>code</span> :
      </>
    );
    detail = (
      <>
        <span>code</span>
      </>
    );
  } else if (item?.notification_type === NOTIFICATION_TYPE[1].type) {
    let countTextLength = item?.message?.comment?.message?.toString();
    if (countTextLength?.length > 100) {
      countTextLength = countTextLength.slice(0, 50) + '...';
    }
    title = (
      <>
        <span>ได้รับข้อความใหม่ </span>:
        <span style={{ color: COLOR_NOTIFICATION_HIGHLIGHT }}>{item?.message?.report_record_id ?? '-'}</span>
      </>
    );
    detail = (
      <>
        <span style={{ color: COLOR_NOTIFICATION_HIGHLIGHT }}>
          {item?.message?.comment?.first_name ?? ''} {item?.message?.comment?.last_name ?? ''}
        </span>
        <span> ได้แสดงความคิดเห็น </span>
        <span
          style={{
            color: COLOR_NOTIFICATION_HIGHLIGHT,
          }}
        >
          {countTextLength}
        </span>
      </>
    );
  } else if (item?.notification_type === NOTIFICATION_TYPE[2].type) {
    title = (
      <>
        <span>การแจ้งเหตุรายการใหม่ </span> :
        <span style={{ color: COLOR_NOTIFICATION_HIGHLIGHT }}> {item?.message?.org_name ?? '-'}</span>
      </>
    );
    detail = (
      <>
        <span>ได้รับแจ้งเหตุ</span>
        <span> - </span>
        <span style={{ color: COLOR_NOTIFICATION_HIGHLIGHT }}> {item?.message?.report_record_id ?? '-'}</span>
        <span style={{ color: COLOR_NOTIFICATION_HIGHLIGHT }}> {item?.message?.group_type_name ?? '-'}</span>
        <span> - </span>
        <span style={{ color: COLOR_NOTIFICATION_HIGHLIGHT }}> {item?.message?.type_name ?? '-'}</span>
      </>
    );
  } else if (item?.notification_type === NOTIFICATION_TYPE[3].type) {
    title = <span>การแจ้งเหตุรายการใหม่ (โอนงาน):</span>;
    detail = (
      <>
        <span style={{ color: COLOR_NOTIFICATION_HIGHLIGHT }}>{item?.message?.from_org?.full_name_th ?? '-'}</span>
        <span> มายัง </span>
        <span style={{ color: COLOR_NOTIFICATION_HIGHLIGHT }}>{item?.message?.to_org?.full_name_th ?? '-'}</span>
        <span> ได้รับแจ้งเหตุ - </span>
        <span style={{ color: COLOR_NOTIFICATION_HIGHLIGHT }}>{item?.message?.report_record_id}</span> {'  '}
        <span style={{ color: COLOR_NOTIFICATION_HIGHLIGHT }}>{item?.message?.group_type_name}</span>
        <span> - </span>
        <span style={{ color: COLOR_NOTIFICATION_HIGHLIGHT }}>{item?.message?.type_name}</span>
      </>
    );
  } else if (item?.notification_type === NOTIFICATION_TYPE[4].type) {
    title = (
      <>
        <span style={{ color: COLOR_NOTIFICATION_HIGHLIGHT }}>{item?.message?.org_info?.full_name_th ?? ''}</span>
        <span> Update Status </span>
        <span style={{ color: COLOR_NOTIFICATION_HIGHLIGHT }}>{item?.message?.report_record_id ?? ''}</span>
      </>
    );
    // response.data[0].message.org_info.full_name_th
    detail = (
      <>
        <span>เปลี่ยนสถานะ </span>
        <span style={{ color: COLOR_NOTIFICATION_HIGHLIGHT }}>{item?.message?.from_status ?? '-'}</span>
        <span> เป็น </span>
        <span style={{ color: COLOR_NOTIFICATION_HIGHLIGHT }}>{item?.message?.current_status ?? '-'}</span>
      </>
    );
  } else if (item?.notification_type === NOTIFICATION_TYPE[5].type) {
    title = 'ขอความช่วยเหลือ SOS';
    detail = (
      <>
        <span style={{ color: COLOR_NOTIFICATION_HIGHLIGHT }}>{item?.message?.name_th ?? 'ไม่ระบุ'}</span> เบอร์โทร :
        {item?.message?.phone_number ?? 'ไม่ระบุ'}
      </>
    );
  } else if (item?.notification_type === NOTIFICATION_TYPE[6].type) {
    title = 'ขอความช่วยเหลือ SOS';
    detail = (
      <>
        <span style={{ color: COLOR_NOTIFICATION_HIGHLIGHT }}>
          {item?.message?.organization_info?.full_name_th ?? 'ไม่ระบุ'}
        </span>
        เชิญประสานงาน หมายเลขการแจ้งเหตุ :{item?.message?.report_record_id ?? '-'}
      </>
    );
  } else if (item?.notification_type === NOTIFICATION_TYPE[7].type) {
    title = (
      <>
        ขอความช่วยเหลือ SOS
        <span style={{ color: COLOR_NOTIFICATION_HIGHLIGHT }}>{item?.message?.report_record_id ?? 'ไม่ระบุ'}</span>
      </>
    );
    detail = (
      <>
        <span style={{ color: COLOR_NOTIFICATION_HIGHLIGHT }}>
          {item?.message?.organization_info?.full_name_th ?? 'ไม่ระบุ'}
        </span>
        เพิ่มคุณเข้าไปในผู้รับผิดชอบ
      </>
    );
  } else if (item?.notification_type === NOTIFICATION_TYPE[8].type) {
    title = <>แจ้งเตือนสถานการณ์ฉุกเฉิน</>;
    detail = (
      <>
        <span style={{ color: COLOR_NOTIFICATION_HIGHLIGHT }}>{item?.message?.event_name || '-'}</span>
        <span> สถานที่เกิดเหตุ : </span>
        <span style={{ color: COLOR_NOTIFICATION_HIGHLIGHT }}>{item?.message?.address || '-'}</span>
        {item?.message?.phone_number && (
          <>
            <span> เบอร์โทร : </span>
            <span style={{ color: COLOR_NOTIFICATION_HIGHLIGHT }}>{item?.message?.phone_number ?? 'ไม่ระบุ'}</span>
          </>
        )}
      </>
    );
  } else if (item?.notification_type === NOTIFICATION_TYPE[9].type) {
    title = (
      <>
        แจ้งเตือนสถานการณ์ฉุกเฉิน
        {/* <span style={{ color: COLOR_NOTIFICATION_HIGHLIGHT }}>{item?.message?.event_name ?? '-'}</span> */}
      </>
    );
    detail = (
      <>
        <span style={{ color: COLOR_NOTIFICATION_HIGHLIGHT }}>{item?.message?.event_name ?? '-'} </span>
        สถานที่เกิดเหตุ : <span style={{ color: COLOR_NOTIFICATION_HIGHLIGHT }}>{item?.message?.address ?? '-'} </span>
        เบอร์โทร : <span style={{ color: COLOR_NOTIFICATION_HIGHLIGHT }}>{item?.message?.phone_number ?? '-'}</span>
      </>
    );
  }

  return { ...finNoti, title, detail, createTime };
};

export const navigatePath = (item = null) => {
  let path = '';
  if (
    item?.notification_type === NOTIFICATION_TYPE[1].type ||
    item?.notification_type === NOTIFICATION_TYPE[2].type ||
    item?.notification_type === NOTIFICATION_TYPE[3].type ||
    item?.notification_type === NOTIFICATION_TYPE[4].type
  ) {
    path = `/app/incident-management/${item?.ref_id}`;
  } else if (
    item?.notification_type === NOTIFICATION_TYPE[5].type ||
    item?.notification_type === NOTIFICATION_TYPE[6].type
  ) {
    path = 'sos';
  } else if (item?.notification_type === NOTIFICATION_TYPE[7].type) {
    path = 'sos-detail';
  } else if (
    item?.notification_type === NOTIFICATION_TYPE[8].type ||
    item?.notification_type === NOTIFICATION_TYPE[9].type
  ) {
    path = '/app/alarm-monitoring';
  }

  return path;
};
