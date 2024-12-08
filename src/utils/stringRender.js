import { ThaiDateTime } from './ThaiDateTime';
import moment from 'moment';
import _ from 'lodash';
import { PROPERTY_DISPLAY_TYPE } from 'constants/ObjectContant';

export const renderDate = (iso) => {
  if (!iso) return '-';
  const date = moment.utc(iso);
  if (!date.isValid()) return iso;
  return ThaiDateTime(date.toDate(), 'short-month');
};

export const renderDateTime = (iso, formatted = 'short-month-full') => {
  if (!iso) return '-';
  const date = moment.utc(iso);
  if (!date.isValid()) return iso;
  return ThaiDateTime(date.toDate(), formatted);
};

export const renderPersonnelName = (personnel) => {
  if (!personnel) return '-';
  return _.compact([
    _.get(personnel, 'dominate_abbreviation', _.get(personnel, 'prefix_name', '')),
    _.get(personnel, 'first_name', ''),
    _.get(personnel, 'last_name', ''),
  ]).join(' ');
};

export const renderPosition = (personnel) => {
  if (!personnel) return '-';
  return `${personnel.position_abbreviation || ''}${personnel.main_agency_abbreviation || ''}` || '-';
};

export const getAssetType = (type) => {
  return PROPERTY_DISPLAY_TYPE[type || 'vehicle'];
};

export const renderPropertyVehicle = (record) => {
  if (!record) return '-';
  return _.compact([record.regis_character, record.regis_number, record.regis_province]).join(' ');
};

export const renderEvidencePropertyDetail = (detail, record = {}) => {
  const type = getAssetType(record.asset_type);
  if (type === 'ยานพาหนะ') {
    return renderPropertyVehicle(record);
  }
  return detail;
};

export const renderEvidencePropertyDetailFromReport = (record = {}) => {
  if (!record) return '-';
  const assetType = getAssetType(record.asset_type);
  if (assetType === 'ยาเสพติด') {
    return record.name;
  }
  if (assetType === 'ยานพาหนะ') {
    return renderPropertyVehicle(record);
  }
  if (assetType === 'อาวุธ') {
    return record.category;
  }
  if (assetType === 'อื่น ๆ') {
    return record.type;
  }
  return assetType;
};

export const renderEvidencePropertyQuantity = (record = {}) => {
  const type = getAssetType(record?.asset_type);
  if (type === 'ยานพาหนะ') {
    return `1 คัน`;
  }
  const quantity = record.quantity;
  return quantity ? `${quantity} ${record.unit}` : '-';
};

export const renderStorageLastStorage = (storages) => {
  if (!storages || storages.length === 0) {
    return '-';
  }
  return _.get(storages, `${storages.length - 1}.storage_name`, '-');
};

export const renderStorageJoin = (storages) => {
  if (!storages || storages.length === 0 || !Array.isArray(storages)) {
    return '-';
  }
  return storages.map((storage) => storage.storage_name).join(' / ');
};

export const renderPropertyOwnerName = (owner) => {
  if (!owner) return '-';
  if (owner.is_juristic) return owner.juristic_name;
  return (
    _.compact([owner.prefix, owner.profile_firstname, owner.profile_middlename, owner.profile_lastname]).join(' ') ||
    '-'
  );
};

export const renderReportType = (data, typesList) => {
  const reportTypeId = data.report_type_id;
  if (!reportTypeId) return '-';
  const reportType = typesList.find((ss) => ss._id === reportTypeId);
  if (!reportType) return '-';
  return reportType.name;
};
