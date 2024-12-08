import { Typography } from 'antd';

const spStatus = [
  {
    id: 'returned',
    name: 'Returned',
    color: '#2BA500',
  },
  {
    id: 'claimed',
    name: 'Claimed',
    color: '#008BD5',
  },
  {
    id: 'open',
    name: 'Open',
    color: '#FFBB00',
  },
  {
    id: 'cancelled',
    name: 'Cancelled',
    color: '#FF0000',
  },
];

export function SpStatusTag({ statusName = 'open' }) {
  const pickItems = spStatus.find((ss) => ss.id === statusName.toLowerCase());
  return (
    <div style={{ background: '#111620', width: 'fit-content', padding: '5px 10px', borderRadius: 3 }}>
      <Typography.Text style={{ color: pickItems.color, fontSize: 12, fontWeight: 500 }}>
        {pickItems.name}
      </Typography.Text>
    </div>
  );
}
