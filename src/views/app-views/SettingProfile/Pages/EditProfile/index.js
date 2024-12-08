import { Card, Skeleton } from 'antd';

import EmptyDisplay from 'utils/EmptyDisplay';
import RolesCollapse from 'components/shared-components/RolesCollapse';
import UserBasicInformationCard from 'components/shared-components/UserBasicInformationCard';
import { observer } from 'mobx-react';
import useUser from 'hooks/services/useUser';

const EditProfile = () => {
  const { user, roles, error, fetcher } = useUser();

  return (
    <>
      <Card loading={!user}>
        {error && EmptyDisplay.default}
        {!error && <UserBasicInformationCard user={user} fetcher={fetcher} />}
      </Card>
      {/* <Typography.Paragraph>สิทธิ์การใช้งาน</Typography.Paragraph> */}
      {!roles && <Skeleton active />}
      {roles && <RolesCollapse roles={roles} />}
    </>
  );
};

export default observer(EditProfile);
