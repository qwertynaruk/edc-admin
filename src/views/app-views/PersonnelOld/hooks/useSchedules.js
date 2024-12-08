import useSWR from 'swr';
import { isSWRLoading } from 'utils/swrHelper';

let schedules = [
  {
    _id: 1,
    name: 'ปฏิบัติหน้าที่หัวหน้าสายตรวจ (ร้อยเวร ๒๐)',
    agency: 'ปราบปราม',
    type: 'ชุดปฏิบัติการ',
    start: '2021-01-01T08:00:00.000Z',
    end: '2021-01-01T16:00:00.000Z',
    updated_at: '2021-01-01T08:00:00.000Z',
  },
  {
    _id: 2,
    name: 'สายตรวจชุดเคลื่อนที่เร็ว',
    agency: 'ปราบปราม',
    type: 'รายบุคคล',
    start: '2021-01-01T08:00:00.000Z',
    end: '2021-01-01T16:00:00.000Z',
    updated_at: '2021-01-01T08:00:00.000Z',
  },
  {
    _id: 3,
    name: 'ปฏิบัติหน้าที่ประจำห้องปฏิบัติการ CCOC',
    agency: 'ปราบปราม',
    type: 'ชุดปฏิบัติการ',
    start: '2021-01-01T08:00:00.000Z',
    end: '2021-01-01T16:00:00.000Z',
    updated_at: '2021-01-01T08:00:00.000Z',
  },
];
const delay = () => new Promise((resolve) => setTimeout(() => resolve(), 1000));

async function getSchedules() {
  await delay();
  return schedules;
}

export async function addSchedule(schedule) {
  await delay();
  if (Math.random() < 0.5) throw new Error('Failed to add new item!');
  schedules = [...schedules, schedule];
  return schedules;
}

const fetcher = (_) => getSchedules();

const useSchedules = () => {
  const { data, error } = useSWR({ method: 'get', url: '/schedules' }, fetcher);

  const loading = isSWRLoading(error, data);

  return { data, error, loading };
};

export default useSchedules;
