import { css } from '@emotion/css';
import { Avatar, Space, Typography } from 'antd';
import PositionSelectWidget from 'components/shared-components/PositionSelectWidget';
import _ from 'lodash';
import { useNavigate, useParams } from 'react-router-dom';
import { renderPersonnelName } from 'utils/stringRender';
import OrganizationTreeTitleTooltip from './OrganizationTreeTitleTooltip';

function Position(props) {
  const { person } = props;
  const name = _.get(person, '0.name', _.get(person, 'position.name'));
  if (!name) {
    const id = _.get(person, 'position');
    return <PositionSelectWidget viewMode value={id} />;
  }
  return <Typography.Text>{name}</Typography.Text>;
}

export default function OrganizationTreeTitle(props) {
  const { person = {}, active } = props;
  const navigate = useNavigate();
  const { id } = useParams();

  const onNavigate = () => {
    if (id === person._id) {
      return;
    }
    if (props.navigate) {
      props.navigate();
    }
    navigate(`../${person._id}/edit`);
  };

  return (
    <div
      className={css`
        .ant-avatar {
          ${active ? 'border: 1px solid rgba(255, 55, 68, 1);' : ''}
        }
      `}
      onClick={onNavigate}
    >
      <Space>
        <Avatar size={60} src={_.get(person, 'cover_image_file', '/img/thumb-avatar/personel.png')} />
        <Space direction="vertical" size={0}>
          <Space>
            <Typography.Text
              className={css`
                color: rgba(255, 55, 68, 1);
                white-space: nowrap;
              `}
            >
              {_.isEmpty(person) ? '-' : renderPersonnelName(person)}
            </Typography.Text>
            <OrganizationTreeTitleTooltip
              total={_.get(person, 'total_subordinate_count', 0)}
              direct={_.get(person, 'direct_subordinate_count', 0)}
              indirect={_.get(person, 'indirect_subordinate_count', 0)}
            />
          </Space>
          <Position person={person} />
        </Space>
      </Space>
    </div>
  );
}
