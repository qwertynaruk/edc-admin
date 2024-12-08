import ExportButton from 'components/shared-components/ExportButton';
import usePersonnel from 'hooks/services/usePersonnel';
import useTeams from 'hooks/services/useTeams';
import _ from 'lodash';
import moment from 'moment';
import { renderPersonnelName } from 'utils/stringRender';

const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
const ThaiDateFormatter = new Intl.DateTimeFormat('th-TH', options);

const getExportColumnFromShift = (shift) => {
  return [
    'วัน เดือน ปี',
    ...shift.map((item, index) => {
      return `ผลัด ${index + 1}\nเวลา ${moment(item.start).utcOffset('+07:00').format('HH:mm')} - ${moment(item.end)
        .utcOffset('+07:00')
        .format('HH:mm')} น.`;
    }),
  ];
};

const getExportColumnTeamFromShiftDetail = (teams, shiftDetail) => {
  return Object.keys(shiftDetail)
    .sort()
    .map((key) => {
      return [
        ThaiDateFormatter.format(new Date(key)),
        ...shiftDetail[key].map((id) => teams?.find((team) => team._id === id)?.team_name),
      ];
    });
};

const getExportColumnPersonFromShiftDetail = (personnel, shiftDetail) => {
  return Object.keys(shiftDetail)
    .sort()
    .map((key) => {
      return [
        ThaiDateFormatter.format(new Date(key)),
        ...shiftDetail[key].map((id) => {
          const personnal = personnel?.find((personnel) => personnel._id === id);
          return renderPersonnelName(personnal);
        }),
      ];
    });
};

const renderWithDash = (item) => {
  if (!item) {
    return '-';
  }
  return item;
};

const getExportDutyTeams = (teams, personnel, dutyTeams, key) => {
  const team = teams?.find((team) => team._id === key);
  return [
    [`ข้อมูลชุดปฏิบัติการ ${team?.team_name}`],
    ['ลำดับ', 'ยศ ชื่อ สกุล', 'ตำแหน่ง', 'นามเรียกขาน', 'เบอร์โทร'],
    ...dutyTeams.map((id, index) => {
      const personnal = personnel?.find((personnel) => personnel._id === id);
      return [
        index + 1,
        renderPersonnelName(personnal),
        renderWithDash(personnal?.dominate),
        renderWithDash(personnal?.middle_name),
        renderWithDash(personnal?.phone_number),
      ];
    }),
  ];
};

const getPersonnelIdsFromDutyTeams = (dutyTeams) => {
  return _.values(dutyTeams);
};

const ExportTeamScheduleButton = (props) => {
  const { shift, shiftDetail, dutyTeams } = props;
  const { data: personnel } = usePersonnel({
    params: {
      _id: getPersonnelIdsFromDutyTeams(dutyTeams),
    },
  });
  const { data: teams } = useTeams({
    params: {
      _ids: Object.keys(dutyTeams),
    },
  });

  const getExportDataSource = () => {
    return [
      [
        ['ตารางปฏิบัติหน้าที่'],
        getExportColumnFromShift(shift),
        ...getExportColumnTeamFromShiftDetail(teams, shiftDetail),
      ],
      ...Object.keys(dutyTeams).map((key) => {
        return getExportDutyTeams(teams, personnel, dutyTeams[key], key);
      }),
    ];
  };

  return <ExportButton dataSource={getExportDataSource()} fileName="schedule-export" />;
};

const ExportPersonScheduleButton = (props) => {
  const { shift, shiftDetail } = props;
  const { data: personnel } = usePersonnel({
    params: {
      _id: _.values(shiftDetail).flat(),
    },
  });

  const getExportDataSource = () => {
    return [
      [
        ['ตารางปฏิบัติหน้าที่'],
        getExportColumnFromShift(shift),
        ...getExportColumnPersonFromShiftDetail(personnel, shiftDetail),
      ],
    ];
  };

  return <ExportButton dataSource={getExportDataSource()} fileName="schedule-export" />;
};

const ExportScheduleButton = (props) => {
  const { shift, shiftDetail, dutyTeams, person } = props;
  if (!person) {
    return <ExportTeamScheduleButton shift={shift} shiftDetail={shiftDetail} dutyTeams={dutyTeams} />;
  }
  return <ExportPersonScheduleButton shift={shift} shiftDetail={shiftDetail} />;
};

export default ExportScheduleButton;
