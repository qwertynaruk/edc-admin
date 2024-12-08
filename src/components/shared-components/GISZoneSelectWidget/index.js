import useGISZones from 'hooks/services/useGISZones';
import styled from '@emotion/styled';
import CustomSelect from '../CustomSelect';

const Select = styled(CustomSelect)`
  .ant-select-selection-item {
    color: #fff !important;
  }
`;

const GISZoneSelectWidget = (props) => {
  const { data: zones, loading } = useGISZones({
    params: {
      is_delete: false,
    },
  });
  return (
    <Select
      options={zones?.map((zone) => ({ value: zone._id, label: zone.name }))}
      placeholder="เลือกข้อมูลสารสนเทศภูมิศาสตร์"
      loading={loading}
      {...props}
    />
  );
};

export default GISZoneSelectWidget;
