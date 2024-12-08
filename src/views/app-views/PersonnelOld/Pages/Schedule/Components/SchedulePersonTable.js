import { Space } from 'antd';
import CustomTable from 'components/shared-components/CustomTable';
import usePersonnel from 'hooks/services/usePersonnel';
import { useMemo } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { renderPersonnelName } from 'utils/stringRender';
import { shiftDetailGroupByDate } from 'utils/dataTranformer';

const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
const ThaiDateFormatter = new Intl.DateTimeFormat('th-TH', options);
const format = 'HH:mm';

const SchedulePersonTable = (props) => {
  const { shift, shiftDetail } = props;
  const { data: personnel, loading } = usePersonnel({
    params: {
      _id: _.chain(shiftDetail).values().flatten().compact().value(),
    },
  });
  const columns = useMemo(() => {
    return [
      {
        title: 'วัน เดือน ปี',
        dataIndex: 'date',
      },
      ...shift.map((shift, index) => {
        return {
          title: (
            <Space direction="vertical">
              <span>ผลัด {index + 1}</span>
              <span>
                เวลา {moment.utc(shift.start).utcOffset('+07:00').format(format)} -{' '}
                {moment.utc(shift.end).utcOffset('+07:00').format(format)} น.
              </span>
            </Space>
          ),
          dataIndex: `shift_${index + 1}`,
        };
      }),
    ];
  }, [shift]);

  const dataSource = useMemo(() => {
    if (!shiftDetail) return [];
    if (!personnel) return [];
    const groupedShiftDetail = shiftDetailGroupByDate(shiftDetail);
    return Object.keys(groupedShiftDetail)
      .sort()
      .map((date) => {
        const shiftPerson = groupedShiftDetail[date];
        const item = {
          _id: date,
          date: ThaiDateFormatter.format(new Date(date)),
        };
        shiftPerson.forEach((personId, index) => {
          const person = personnel.find((person) => person._id === personId);
          item[`shift_${index + 1}`] = renderPersonnelName(person);
        });
        return item;
      });
  }, [shiftDetail, personnel]);

  return <CustomTable loading={loading} columns={columns} dataSource={dataSource} pagination={false} />;
};

export default SchedulePersonTable;
