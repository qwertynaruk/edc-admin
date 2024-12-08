import { Avatar, Space } from 'antd';

import { IdcardOutlined } from '@ant-design/icons';
import { ThaiDateTime } from 'utils/ThaiDateTime';
import moment from 'moment';

export const columnDateRender = (isoString, type = 'short-month-full', localTime = false) => {
  if (localTime) {
    return isoString ? moment(isoString).local().add('year', 543).format('DD MMM YYYY HH:mm:ss') : '-';
  } else {
    return isoString ? ThaiDateTime(moment.utc(isoString).toDate(), type || 'short-month-full') : '-';
  }
};

export const columnImageRender = (text) => {
  return (
    <Space align="center">
      <Avatar src={text}>
        <IdcardOutlined />
      </Avatar>
    </Space>
  );
};

export const useTableColumnRender = {
  columnDateRender,
  columnImageRender,
};

export default useTableColumnRender;
