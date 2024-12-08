import { css } from '@emotion/css';
import { Card, Empty, Form, Space, Spin, Typography } from 'antd';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import CustomSelect from 'components/shared-components/CustomSelect';
import MasterIndiceAvatar from 'components/shared-components/MasterIndiceAvatar';
import useService from 'hooks/useService';
import _ from 'lodash';
import { useRef } from 'react';
import Tree from 'react-d3-tree';
import PersonnelService from 'services/PersonelService';
import { serviceWrapper } from 'utils/serviceHelper';
import { transform } from './transform';

function findById(obj, id) {
  if (obj.attributes && obj.attributes._id === id) {
    return obj;
  }
  if (obj.children) {
    for (const child of obj.children) {
      const result = findById(child, id);
      if (result) {
        return result;
      }
    }
  }
  return null;
}

const getTranslate = (dimensions, nodeSize) => {
  if (!dimensions || !nodeSize) return { x: 0, y: 0 };
  return {
    x: dimensions.width / 2 - nodeSize.x / 2,
    y: dimensions.height / 2 - nodeSize.y / 2,
  };
};

const renderForeignObjectNode = ({ nodeDatum, toggleNode, foreignObjectProps }) => {
  const { handleNodeClick, ...rest } = foreignObjectProps;
  const onNodeClick = () => {
    handleNodeClick(nodeDatum);
    toggleNode();
  };
  const type = _.get(nodeDatum, 'attributes.object_type');
  const isPersonnel = type === 'personnel';
  const isOrganization = _.get(nodeDatum, 'attributes.type') === 'personnel_organization';
  const person = _.get(nodeDatum, 'attributes', {});
  return (
    <g>
      <foreignObject {...rest}>
        <Space>
          <div onClick={onNodeClick}>
            {isPersonnel ? (
              <MasterIndiceAvatar
                size={56}
                category="person"
                imageSource={_.get(nodeDatum, 'attributes.cover_image_file')}
              />
            ) : null}
            {isOrganization ? (
              <MasterIndiceAvatar
                size={56}
                category="organization"
                imageSource={_.get(nodeDatum, 'attributes.cover_image_file')}
              />
            ) : null}
          </div>
          <Space direction="vertical">
            <Typography.Text>{nodeDatum.name}</Typography.Text>
            {isPersonnel ? <Typography.Text>{person.position_abbreviation}</Typography.Text> : null}
          </Space>
        </Space>
      </foreignObject>
    </g>
  );
};

export default function OrganizeChart(props) {
  const [form] = Form.useForm();
  const treeContainer = useRef(null);
  const { data = [], loading } = useService(serviceWrapper(PersonnelService.getSubordinate), () => {
    return {
      params: {
        hotfix: 'subordinate',
      },
    };
  });

  const selectedOrganization = Form.useWatch('organization_id', form);

  const handleNodeClick = (data) => {
    console.debug('handleNodeClick', data);
  };

  const dimensions = treeContainer?.current?.getBoundingClientRect();
  const nodeSize = { x: 300, y: 100 };
  const foreignObjectProps = { handleNodeClick, width: nodeSize.x, height: nodeSize.y, x: -28, y: -28 };
  const translate = getTranslate(dimensions, nodeSize);

  const treeData = transform(data.find((item) => item.organization._id === selectedOrganization));

  const options = data.map(({ organization }) => {
    return {
      label: organization.name,
      value: organization._id,
    };
  });

  return (
    <Form form={form}>
      <PageBreadcrumb pageLabel={{ master: 'กำลังพล', subpath: 'แผนผังภายในองค์กร' }} />
      <Card
        className={css`
          .ant-card-body {
            min-height: 100vh;
            height: auto;
            width: 100%;
            display: flex;
            align-items: stretch;
            justify-content: center;
          }
        `}
        title={
          <Form.Item name="organization_id" label="เลือกแผนผังภายในองค์กร">
            <CustomSelect placeholder="เลือกองค์กร" options={options} loading={loading} disabled={loading} />
          </Form.Item>
        }
      >
        {selectedOrganization ? (
          <div
            ref={treeContainer}
            className={css`
              width: 100%;
            `}
          >
            {loading ? (
              <Spin
                spinning
                className={css`
                  margin: 0 !important;
                `}
              />
            ) : (
              <Tree
                data={treeData}
                orientation="vertical"
                pathFunc="step"
                translate={translate}
                dimensions={dimensions}
                nodeSize={nodeSize}
                renderCustomNodeElement={(props) => renderForeignObjectNode({ ...props, foreignObjectProps })}
              />
            )}
          </div>
        ) : (
          <Empty
            className={css`
              align-self: center;
            `}
          />
        )}
      </Card>
    </Form>
  );
}
