import { Button, Card, Input, Table, Typography } from 'antd';

import Flex from 'components/shared-components/Flex';
import { FallbackError } from 'components/util-components/fallback-error';

import { useSearch } from '../../../shared';
import { useGetPersonnelMeta } from '../../api/get-personnel-meta';

import { PersonnelAccessToProvincesSettingDialog } from './components/personnel-access-to-provinces-setting-dialog';
import { useToggle } from '@mantine/hooks';

const EmptyText = () => (
  <Typography.Title
    level={4}
    className="gx-p-4"
    style={{
      fontSize: 40,
      fontWeight: 700,
      color: 'rgba(84, 96, 111, 0.4)',
    }}
  >
    <i>ยังไม่ได้เพิ่มตั้งค่าการเข้าถึงจังหวัด</i>
  </Typography.Title>
);

export const PersonnelAccessToProvincesSetting = ({ selected, onSelectedChange, footer }) => {
  const [isPersonnelAccessToProvincesSettingDialogVisible, togglePersonnelAccessToProvincesSettingDialogVisible] =
    useToggle();
  const { search, debouncedSearch, onSearch } = useSearch({});

  const { data, isLoading, isError } = useGetPersonnelMeta({
    metaType: 'province_info',
  });

  if (isError) {
    return <FallbackError />;
  }

  const columns = [
    {
      title: 'จังหวัด TH',
      dataIndex: 'full_name_th',
      width: 200,
    },
    {
      title: 'ตัวย่อจังหวัด TH',
      dataIndex: 'full_name_th',
      width: 200,
    },
    {
      title: 'จังหวัด EN',
      dataIndex: 'full_name_en',
      width: 200,
    },
    {
      title: 'ตัวย่อจังหวัด EN',
      dataIndex: 'full_name_en',
      width: 200,
    },
  ];

  const handleAddProvince = (provinceId) => {
    togglePersonnelAccessToProvincesSettingDialogVisible();
    onSelectedChange?.([...selected, provinceId]);
  };

  const dataSource = selected
    ?.map((provinceId) => {
      return data?.data?.find((province) => province.id === provinceId);
    })
    ?.filter((province) => !!province)
    ?.filter(
      (province) =>
        province.full_name_th.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        province.full_name_en.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        province.id.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

  return (
    <>
      <Card>
        <Flex justifyContent="between" className="gx-mb-4">
          <Button type="primary" onClick={() => togglePersonnelAccessToProvincesSettingDialogVisible()}>
            ตั้งค่าการเข้าถึงจังหวัด
          </Button>
          <Input.Search
            style={{ width: 250 }}
            placeholder="ค้นหา"
            value={search}
            onChange={(e) => {
              onSearch(e.target.value);
            }}
            allowClear
          />
        </Flex>
        <Table
          rowKey="id"
          loading={isLoading}
          dataSource={dataSource}
          columns={columns}
          tableLayout="fixed"
          scroll={{ x: 800 }}
          locale={{
            emptyText: <EmptyText />,
          }}
        />
        {footer}
      </Card>
      <PersonnelAccessToProvincesSettingDialog
        open={isPersonnelAccessToProvincesSettingDialogVisible}
        onClose={togglePersonnelAccessToProvincesSettingDialogVisible}
        selected={selected}
        onFinish={handleAddProvince}
      />
    </>
  );
};
