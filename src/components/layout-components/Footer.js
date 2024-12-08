import { Layout, Typography } from 'antd';

import dayjs from 'dayjs';

export default function Footer() {
  const years = dayjs().format('YYYY');

  return (
    <Layout.Footer
      style={{
        backgroundColor: '#1C2536',
        height: 50,
        paddingLeft: 32,
        paddingRight: 32,
        borderTopStyle: 'solid',
        borderTopColor: '#000',
        borderTopWidth: 1,
      }}
    >
      <div style={{ height: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
        <Typography.Text>Copyright ©{years} OneForce All rights reserved.</Typography.Text>

        <img width={9} height={12.5} src="/img/v1/fav-icon.png" alt="edc" />
      </div>
    </Layout.Footer>
  );
}
