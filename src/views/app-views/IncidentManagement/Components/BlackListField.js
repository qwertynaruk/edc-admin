import _ from 'lodash';

export const blackListKey = [
  'IsNotEnd',
  // 'EventType',
  // 'OtherEvent',
  // 'subject-type-system',
  // 'title',
  // 'request-type-system',
  // 'UploadCustom-system',
  // 'OtherPlace',
  // 'UnknowLocation-checkbox',
  'GoogleMap-system',
  // 'latitude-system',
  // 'longitude-system',
  '_id',
  // 'profile',
  // 'first_name',
  // 'first_name_eng',
  // 'first_name_th',
  // 'last_name',
  // 'last_name_eng',
  // 'last_name_th',
  // 'created_at',
  // 'updated_at',
  // 'date_of_birth_time',
  // 'is_active',
  // 'is_deleted',
  // 'is_id_card',
  // 'is_regis_ekyc',
  // 'prefix_eng',
  // 'prefix_th',
  // 'person_card_id',
  // 'date_of_expiry_en',
  // 'date_of_expiry_th',
  // 'date_of_issue_en',
  // 'date_of_issue_th',
  // 'date_of_issue_time',
  // 'date_of_expiry_time',
  // 'type',
  // 'coordinates',
];

export const gainFilter = (component) => {
  return component.filter((item) => {
    if (item.key === 'StartDateTime') {
      const haveData = _.find(component, (ss) => ss.key === 'start_and_end_date') || [];
      return haveData && haveData?.initialValue?.length > 0 ? null : item;
    } else {
      return item;
    }
  });
};
