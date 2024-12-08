import produce from 'immer';
import _ from 'lodash';
import moment from 'moment';

export const shiftDetailGroupByDate = (object) => {
  const result = {};
  Object.keys(object).forEach((key) => {
    const date = moment.utc(key, 'YYYY-MM-DDTHH:mm').format('YYYY-MM-DD');
    if (!result[date]) {
      result[date] = [];
    }
    result[date].push(object[key]);
  });
  return _.mapValues(result, (value) => _.chain(value).flatten(value).compact().value());
};

export const transformScheduleFormDutyTeamIntoPayload = (dutyTeams) => {
  if (!dutyTeams) return null;
  return Object.keys(dutyTeams).map((key) => {
    return {
      id: key,
      agents: dutyTeams[key],
    };
  });
};

export const transformScheduleFormIntoPayload = (values, type = 'ชุดปฏิบัติการ') => {
  const shift = values.shift;
  const shiftDetail = values.shift_detail;

  const startTime = moment(_.get(values, 'date.0')).startOf('day');
  const endTime = moment(_.get(values, 'date.1')).endOf('day');

  return _.pickBy(
    {
      // update
      edit_message: values.edit_message,
      duty_id: values.duty_id,
      duty_name: values.duty_name,
      department_ids: values.department_ids,
      type,
      start_time: startTime.toISOString(),
      end_time: endTime.endOf('day').toISOString(),
      shift_count: values.shift_count,
      working_hours: values.working_hours,
      duty_teams: transformScheduleFormDutyTeamIntoPayload(values.duty_teams),
      personnel_duty_infos: Object.keys(shiftDetail).flatMap((key) => {
        return shiftDetail[key].map((agentId, shiftIndex) => {
          const { start, end } = shift[shiftIndex];
          const startDiff = start.diff(startTime);
          const endDiff = end.diff(startTime);
          return {
            turn_number: shiftIndex + 1,
            agent_id: agentId,
            agent_type: type === 'ชุดปฏิบัติการ' ? 'investigation_team' : 'personnel',
            start_time: moment(key).add(startDiff).toISOString(),
            end_time: moment(key).add(endDiff).toISOString(),
          };
        });
      }),
    },
    _.identity
  );
};

export const transformPayloadDutyInfosIntoShiftFormValue = (dutyInfo) => {
  return _.chain(dutyInfo)
    .groupBy('turn_number')
    .mapValues((value) => {
      return {
        start: moment.utc(value[0].start_time),
        end: moment.utc(value[0].end_time),
      };
    })
    .values()
    .value();
};

export const transformPayloadDutyInfosIntoShiftDetailFormValue = (dutyInfo) => {
  return _.chain(dutyInfo)
    .groupBy((value) => {
      return moment.utc(value.start_time).utcOffset('+07:00').toISOString(true).slice(0, 10);
    })
    .mapValues((value) => {
      return value.map((value) => value.agent_id);
    })
    .value();
};

export const transformPayloadDutyTeamsIntoAgenciesFormValue = (dutyTeams) => {
  if (!dutyTeams) return null;
  return dutyTeams.map((team) => team.id);
};

export const transformPayloadDutyTeamsIntoDutyTeamsFormValue = (dutyTeams) => {
  if (!dutyTeams) return null;
  return _.chain(dutyTeams)
    .groupBy('id')
    .mapValues((value) => value.flatMap((value) => value.agents))
    .value();
};

export const transformPayloadIntoScheduleForm = (data) => {
  return _.pickBy(
    {
      duty_id: data._id,
      agencies: transformPayloadDutyTeamsIntoAgenciesFormValue(data.duty_teams),
      duty_name: data.duty_name,
      type: data.type,
      date: [data.start_time, data.end_time],
      department: data.department,
      shift_count: data.shift_count,
      working_hours: data.working_hours,
      duty_teams: transformPayloadDutyTeamsIntoDutyTeamsFormValue(data.duty_teams),
      shift: transformPayloadDutyInfosIntoShiftFormValue(data.personnel_duty_infos),
      shift_detail: transformPayloadDutyInfosIntoShiftDetailFormValue(data.personnel_duty_infos),
    },
    _.identity
  );
};

export const transfromPayloadIntoUpdatePayload = (payload, duty) => {
  return _.pick(
    produce(payload, (draft) => {
      const oldPersonnelDutyInfos = _.groupBy(duty.personnel_duty_infos, (item) =>
        moment.utc(item.start_time).toISOString()
      );
      payload.personnel_duty_infos.forEach((personnelDutyInfo, index) => {
        const key = moment(personnelDutyInfo.start_time).subtract(1, 'day').toISOString();
        const value = oldPersonnelDutyInfos[key];
        if (!value) return;
        const item = value[0];
        draft.personnel_duty_infos[index]._id = item._id;
      });
    }),
    ['duty_id', 'duty_teams', 'personnel_duty_infos', 'edit_message']
  );
};
