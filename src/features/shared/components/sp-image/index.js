import { Image, Spin } from 'antd';
import { useEffect, useState } from 'react';

export function SpImage({ src = undefined, fallbackRender = undefined }) {
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const testFetch = async () => {
    setLoading(true);
    await fetch(src, {
      method: 'get',
    })
      .then((resp) => {
        setFetchSuccess(resp.status === 200);
      })
      .catch(() => setFetchSuccess(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (src) {
      testFetch();
    }
  }, [src]);

  return <Spin spinning={loading}>{fetchSuccess ? <Image src={src} alt="edc" /> : fallbackRender}</Spin>;
}
