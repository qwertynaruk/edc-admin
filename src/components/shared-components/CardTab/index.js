import { Card, Descriptions, Grid } from 'antd';

import CommentOLF from 'components/shared-components/CommentOLF';
import ReportStore from 'mobx/ReportStore';
import _ from 'lodash';
import styled from '@emotion/styled';
import { useState } from 'react';

const { useBreakpoint } = Grid;

const CustomCard = styled(Card)((props) => ({
  '.ant-card-head-title': {
    paddingLeft: 0,
    paddingRight: 0,
  },
  '.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn': {
    color: '#e61414',
  },
  '.ant-card-head': {
    borderBottom: props?.hideborderheader ? 'none' : '1px solid #495762',
  },
  '.ant-tabs-content-holder': {
    ...(props?.hideborderheader ? { padding: '0px' } : {}),
  },
}));
const CustomDescriptions = styled(Descriptions)({
  '.ant-descriptions-title': {
    color: '#ffff',
  },
  '.ant-descriptions-item-label': {
    color: '#9f9f9f',
  },
  '.ant-descriptions-item-content': {
    color: '#ffff',
  },
});
const CardTab = ({
  dataSource = [],
  tabList = [],
  isDesc = false,
  isComment = false,
  isCustom = false,
  canEditebled = false,
  onSubmitComment = () => {},
  onActiveTabKey = () => {},
}) => {
  const screens = useBreakpoint();
  const [activeTabKey2, setActiveTabKey2] = useState(tabList?.[0]?.key);

  return (
    <CustomCard
      tabList={tabList}
      hideborderheader="true"
      onTabChange={(key) => {
        setActiveTabKey2(key);
        onActiveTabKey?.(key);
      }}
    >
      {isDesc && (
        <CustomDescriptions style={{ color: '#ffff' }} column={(screens.xs || screens.sm) && !screens.lg ? 1 : 2}>
          <Descriptions.Item label="กลุ่มการแจ้งเหตุ">{`เหตุทั่วไป`}</Descriptions.Item>
          <Descriptions.Item label="ประเภทการแจ้งเหตุ">{`ทะเลาะวิวาท`}</Descriptions.Item>
          <Descriptions.Item
            label="รายละเอียดที่เกิดเหตุ"
            span={(screens.xs || screens.sm) && !screens.lg ? undefined : 2}
          >{`มีเหตุทะเลาะวิวาทบริเวณหน้าโรงเรียน`}</Descriptions.Item>
        </CustomDescriptions>
      )}
      {isCustom && tabList?.find((item) => item.key === activeTabKey2)?.children}
      {isComment && (
        <CommentOLF
          dataSource={_.get(dataSource, 'comments', [])}
          onSubmitComment={(ss) => ReportStore.sendComment(ss, dataSource)}
        />
      )}
    </CustomCard>
  );
};

export default CardTab;
