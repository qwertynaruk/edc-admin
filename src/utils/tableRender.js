import _ from 'lodash';
import { ThaiDateTime } from './ThaiDateTime';
import moment from 'moment';

export const renderDash = (array, seperator = ' ', filter = '-') => {
  const count = array.filter((item) => item === filter || !item).length;
  return count > 1 ? '-' : array.filter((item) => item).join(seperator);
};

export const renderSuizeOwner = (owner = {}) => {
  const prefix = _.get(owner, 'prefix_name', '-');
  const firstName = _.get(owner, 'first_name', '-');
  const lastName = _.get(owner, 'last_name', '-');
  const name = [prefix, firstName, lastName];
  return renderDash(name);
};

export const displayEvidence = (evidence) => {
  if (!evidence) return null;
  return {
    ...evidence,
    seizure_document_owner: renderSuizeOwner(evidence.seizure_document_owner, {}),
    report_sequence: renderDash(
      [
        evidence.report_sequence_id,
        evidence.report_exported_time &&
          ThaiDateTime(moment.utc(evidence.report_exported_time).toDate(), 'short-month'),
      ],
      '/',
      '/'
    ),
    created_at: ThaiDateTime(new Date(evidence.created_at), 'short-month-full'),
  };
};
