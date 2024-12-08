import { Image, Space } from 'antd';

import { last } from 'lodash';

export default function useFileIcons() {
  const mapIcon = (attachment = '') => {
    try {
      const suffix = attachment.split('.');
      const formatted = last(suffix).toUpperCase();

      return `/img/filetypes/${formatted}.png`;
    } catch (error) {
      return `/img/filetypes/OTHER.png`;
    }
  };

  const render = (attachment = '', reactDOM = undefined) => {
    if (!attachment) {
      return null;
    }

    return (
      <Space direction="horizontal" align="center" size={5}>
        <Image src={mapIcon(attachment)} width={30} height={36} preview={false} fallback="/img/filetypes/OTHER.png" />
        {reactDOM && reactDOM?.()}
      </Space>
    );
  };

  return {
    render,
  };
}
