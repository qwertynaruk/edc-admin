import { useState } from 'react';
import { Button, Card, Form, Image, Input, Space, Spin, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import TwoFactorAuthenStore from 'mobx/TwoFactorAuthenStore';

const { Title, Text } = Typography;

const TwoFA = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [formLoading, setFormLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [faSecurityKey, setFASecurityKey] = useState('');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
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

  const generateRandomBuffer = (length) => {
    if (!length) length = 32;

    const randomBuff = new Uint8Array(length);
    window.crypto.getRandomValues(randomBuff);
    return randomBuff;
  };

  const FIDO = (values) => {
    const makeCredChallenge = {
      challenge: generateRandomBuffer(32),
      authenticatorSelection: {
        userVerification: 'required',
        authenticatorAttachment: 'cross-platform',
      },
      rp: {
        name: 'Example Inc.',
      },

      user: {
        id: generateRandomBuffer(32),
        name: values.data.email,
        displayName: values.data.email,
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 },
        { type: 'public-key', alg: -35 },
        { type: 'public-key', alg: -36 },
        { type: 'public-key', alg: -257 },
        { type: 'public-key', alg: -258 },
        { type: 'public-key', alg: -259 },
        { type: 'public-key', alg: -37 },
        { type: 'public-key', alg: -38 },
        { type: 'public-key', alg: -39 },
        { type: 'public-key', alg: -8 },
      ],

      status: 'ok',
    };

    makeCredChallenge.authenticatorSelection.authenticatorAttachment = 'cross-platform';
    return navigator.credentials.create({ publicKey: makeCredChallenge });
  };

  const makeCredentialResponse = (payload) => {
    return Promise.resolve({ status: 'ok', payload });
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

  const connectSecurityKey = () => {
    Promise.resolve(FIDO({ data: { email: 'bass' } }))
      .then((newCredentialInfo) => {
        newCredentialInfo = publicKeyCredentialToJSON(newCredentialInfo);
        makeCredentialResponse(newCredentialInfo)
          .then((serverResponse) => {
            if (serverResponse.status === 'ok') {
              setFASecurityKey(serverResponse.payload.id);
              setCurrent(3);
            } else {
              setCurrent(2);
            }
          })
          .catch((error) => {
            setCurrent(2);
            return new Error(error);
          });
      })
      .catch((error) => {
        setCurrent(2);
        return new Error(error);
      });
  };

  const next = () => {
    connectSecurityKey();
    setCurrent(current + 1);
  };

  const onSuccess = async (values) => {
    setFormLoading(true);
    const { name = '' } = values;

    const payload = {
      fa_enabled: true,
      fa_keys: [
        {
          name,
          public_key: faSecurityKey,
        },
      ],
      auth_type: 'police',
    };

    TwoFactorAuthenStore.regisHardware(payload)
      .then(() => (window.location.href = '/app/setting-profile/security'))
      .finally(() => setFormLoading(false));
  };

  const displayOnCurrent = [
    {
      coverImage: '/img/key-2fa.png',
      complexRender: () => (
        <>
          <Title level={4}>หากคุณมีคีย์ความปลอดภัย</Title>
          <div className="gx-my-4">
            <Text>ตรวจสอบว่าคีย์อยู่กับคุณ แต่ไม่ได้เชื่อมต่อกับอุปกรณ์</Text>
          </div>

          <Typography.Paragraph style={{ lineHeight: '1.75rem', letterSpacing: 0.8 }}>
            <Text strong>หมายเหตุ : </Text>
            <Text>
              หากคุณลงชื่อเข้าใช้บัญชี UDONCOP ในโทรศัพท์ที่มีสิทธิ์ คุณจะได้รับ UDONCOP PROMPT
              เป็นวิธีการสำรองสำหรับการยืนยันแบบ 2 ขั้นตอนด้วย หากต้องการใช้คีย์ความปลอดภัยเท่านั้น
              ให้ลงทะเบียนในโปรแกรมการปกป้องขั้นสูงซึ่งไม่มีค่าใช้จ่าย
            </Text>
          </Typography.Paragraph>
        </>
      ),
    },
    {
      coverImage: '/img/key-2fa.png',
      complexRender: () => (
        <>
          <Title level={3}>ลงทะเบียนคีย์ความปลอดภัยของคุณ</Title>
          <Space direction="vertical" className="gx-mt-4" style={{ lineHeight: '1.75rem' }}>
            <Text>1. เสียบกุญแจรักษาความปลอดภัยในพอร์ต USB ของคอมพิวเตอร์ หรือเชือมต่อโดยใช้สาย USB</Text>

            <Text>2. เมือเชื่อมต่อแล้ว หากกุญแจมีปุ่มหรือดิสก์สีทอง ให้แตะทันที</Text>
          </Space>
          <Space className="gx-text-center gx-full-width gx-my-4">
            <Spin />
          </Space>
        </>
      ),
    },
    {
      coverImage: '/img/key-2fa-3-error.png',
      complexRender: () => (
        <>
          <Title level={3}>มีบางอย่างผิดพลาด โปรดลองอีกครั้ง</Title>
          <Space>
            <Text className="gx-py-4">
              นำคีย์ความปลอดภัยออกและเสียบอีกครั้ง หากคีย์มีปุ่มหรือดิสก์สีทอง ให้แตะปุ่มหรือดิสก์ดังกล่าว
            </Text>
          </Space>
        </>
      ),
    },
    {
      coverImage: '/img/key-2fa-3.png',
      complexRender: () => (
        <Form form={form} layout="vertical" onFinish={onSuccess}>
          <Title level={3}>ลงทะเบียนกุญแจรักษาความปลอดภัยแล้ว</Title>
          <Text>
            ลงทะเบียนคีย์ความปลอดภัยของคุณแล้ว จากนี้ไปคุณจะใช้คีย์ดังกล่าวเพื่อลงชื่อเข้าใช้ด้วยการยืนยันแบบ 2 ขั้นตอน
          </Text>

          <div className="gx-mt-4">
            <Form.Item
              name="name"
              label="ชื่อกุญแจรักษาความปลอดภัย"
              rules={[
                {
                  required: true,
                  message: 'กรุณาระบุชื่อกุญแจรักษาความปลอดภัย',
                },
                {
                  pattern: /^\S*$/,
                  message: 'ห้ามมีช่องว่าง',
                },
              ]}
              style={{ marginBottom: 0 }}
            >
              <Input placeholder="ชื่อกุญแจรักษาความปลอดภัย" />
            </Form.Item>
          </div>
        </Form>
      ),
    },
  ];

  return (
    <Spin spinning={formLoading}>
      <Card
        cover={
          <Space className="gx-full-width gx-py-4" style={{ textAlign: 'center', background: '#1B2531' }}>
            <Image
              width={200}
              preview={false}
              alt="f2a"
              src={displayOnCurrent[current].coverImage}
              className="gx-my-4"
            />
          </Space>
        }
        className="gx-mb-4"
        style={{ margin: 'auto', overflow: 'hidden', borderColor: '#1b2531' }}
        bodyStyle={{ background: '#2e384b' }}
      >
        {displayOnCurrent[current].complexRender()}
      </Card>

      {current === 3 && (
        <Space className="gx-full-width gx-flex-end">
          <Button type="primary" onClick={() => form.submit()}>
            เสร็จสิ้น
          </Button>
        </Space>
      )}

      <Space className="gx-flex-end gx-my-4" style={{ margin: 'auto', overflow: 'hidden' }}>
        {current < 3 && (
          <Space>
            <Button onClick={() => navigate('../../')}>ยกเลิก</Button>
            <Button type="primary" onClick={() => (current === 0 ? next() : connectSecurityKey())}>
              {current === 2 ? 'ลองอีกครั้ง' : 'ถัดไป'}
            </Button>
          </Space>
        )}
        {/* {current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Previous
            </Button>
          )} */}
      </Space>
    </Spin>
  );
};

export default TwoFA;
