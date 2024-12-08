import { Button, Card, Col, Image, Row, Space, Spin, Typography } from 'antd';
import { useEffect, useState } from 'react';

import { ArrowLeftOutlined } from '@ant-design/icons';
import { Buffer } from 'buffer';
import DialogNotification from 'components/shared-components/DialogNotification';
import TwoFactorAuthenStore from 'mobx/TwoFactorAuthenStore';
import UserStore from 'mobx/UserStore';

const { Title, Text } = Typography;

const Login2FA = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const [screenLoading, setScreenLoading] = useState(false);

  const lookup = new Uint8Array(256);
  for (let i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
  }

  const decode = function (base64) {
    const bufferLength = base64.length * 0.75;
    const len = base64.length;
    let i;
    let p = 0;
    let encoded1;
    let encoded2;
    let encoded3;
    let encoded4;

    const arraybuffer = new ArrayBuffer(bufferLength);
    const bytes = new Uint8Array(arraybuffer);

    for (i = 0; i < len; i += 4) {
      encoded1 = lookup[base64.charCodeAt(i)];
      encoded2 = lookup[base64.charCodeAt(i + 1)];
      encoded3 = lookup[base64.charCodeAt(i + 2)];
      encoded4 = lookup[base64.charCodeAt(i + 3)];

      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }

    return arraybuffer;
  };

  const encode = function (arraybuffer) {
    const bytes = new Uint8Array(arraybuffer);
    let i;
    const len = bytes.length;
    let base64 = '';

    for (i = 0; i < len; i += 3) {
      base64 += chars[bytes[i] >> 2];
      base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
      base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
      base64 += chars[bytes[i + 2] & 63];
    }

    if (len % 3 === 2) {
      base64 = base64.substring(0, base64.length - 1);
    } else if (len % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2);
    }

    return base64;
  };

  const publicKeyCredentialToJSON = (pubKeyCred) => {
    if (pubKeyCred instanceof Array) {
      const arr = [];
      for (const i of pubKeyCred) arr.push(publicKeyCredentialToJSON(i));

      return arr;
    }

    if (pubKeyCred instanceof ArrayBuffer) {
      return encode(pubKeyCred);
    }

    if (pubKeyCred instanceof Object) {
      const obj = {};

      for (const key in pubKeyCred) {
        obj[key] = publicKeyCredentialToJSON(pubKeyCred[key]);
      }

      return obj;
    }

    return pubKeyCred;
  };

  const generateRandomBuffer = (length) => {
    if (!length) length = 32;

    const randomBuff = new Uint8Array(length);
    window.crypto.getRandomValues(randomBuff);
    return randomBuff;
  };

  useEffect(() => {
    initCredentialConnected();
  }, []);

  const reSign2FA = async (payload = {}) => {
    setScreenLoading(true);
    const { id = '' } = payload;
    const { authLog = '', wgToken = '' } = UserStore;
    const _decode = Buffer.from(authLog, 'base64').toString('ascii') || '';
    const { username = '', password = '', ip = '' } = JSON.parse(_decode);

    TwoFactorAuthenStore.login2FA(
      {
        username,
        password,
        auth_type: 'police',
        fa_signature: id,
        ip,
      },
      wgToken
    ).finally(() => setScreenLoading(false));
  };

  const initCredentialConnected = () => {
    const { faKeyList = [] } = UserStore;
    const valificationSecuritykey = {
      allowCredentials: faKeyList,
      challenge: generateRandomBuffer(32),
      status: 'ok',
      userVerification: 'required',
    };

    valificationSecuritykey.allowCredentials = faKeyList.map((credId) => {
      return { type: 'public-key', id: decode(credId.fa_public_key) };
    });

    Promise.resolve(navigator.credentials.get({ publicKey: valificationSecuritykey }))
      .then((newCredentialInfo) => {
        newCredentialInfo = publicKeyCredentialToJSON(newCredentialInfo);
        reSign2FA(newCredentialInfo);
      })
      .catch((error) => {
        console.log(error);
        DialogNotification('error', 'ขออภัย', 'ไม่สามารถเชื่อมต่อกับอุปกรณ์ได้ กรุณาลองใหม่อีกครั้ง');
      });
  };

  return (
    <Card style={{ width: 380, margin: 'auto' }} bodyStyle={{ padding: 5 }}>
      <Spin spinning={screenLoading}>
        <Row gutter={[16, 32]}>
          <Col span={24}>
            <Space>
              <Button ghost onClick={() => window.history.back()}>
                <ArrowLeftOutlined />
              </Button>
              <Typography.Text>ย้อนกลับ</Typography.Text>
            </Space>
          </Col>
          <Col span={8} style={{ textAlign: 'center' }}>
            <Image src="/img/keytest.png" style={{ height: 120 }} preview={false} />
          </Col>

          <Col span={16} style={{ height: 110 }}>
            <Space direction="vertical">
              <Title level={3}>คีย์ความปลอดภัย</Title>
              <Text>ใช้คีย์ความปลอดภัยของ UDONCOP</Text>
              <Text>โปรดใส่คีย์ความปลอดภัยของคุณแล้ว</Text>
              <Text>ตรวจสอบรายนิ้วมือ</Text>
            </Space>
          </Col>

          <Col lg={24} style={{ padding: 12 }}>
            <Space className="gx-full-width gx-flex-end">
              <Button type="primary" onClick={initCredentialConnected}>
                ลองใหม่อีกครั้ง
              </Button>
            </Space>
          </Col>
        </Row>
      </Spin>
    </Card>
  );
};

export default Login2FA;
