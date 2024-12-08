import { Collapse } from 'antd';
import styled from '@emotion/styled';

const { Panel } = Collapse;

const CustomCollapse = styled(Collapse)`
  background: transparent !important;
  border: none !important;
  .ant-collapse-header {
    background-color: ${({ nested }) => (nested ? 'rgba(27, 37, 49, 0.4)' : '#1B2531')};
    border-radius: 0 !important;
    display: flex;
    > div {
      display: inline-block;
    }
  }
  .ant-collapse-content {
    border: none;
    background: transparent !important;
    &.ant-collapse-content-active {
      border: none;
    }
  }
  .ant-collapse-content-box {
    background-color: rgba(55, 66, 86, 0.4);
  }
  > .ant-collapse-item {
    border: none !important;
  }
`;

const CollapseFromData = ({ data, forceRender = false, ...props }) => {
  const { defaultActiveKey } = props;
  return data.map((item) => {
    return (
      <CustomCollapse {...props} key={item.key} defaultActiveKey={defaultActiveKey}>
        <Panel forceRender={forceRender} header={item.header} key={item.key}>
          {item.description}
          {item.children && <CollapseFromData {...props} data={item.children} />}
        </Panel>
      </CustomCollapse>
    );
  });
};

export default CollapseFromData;
