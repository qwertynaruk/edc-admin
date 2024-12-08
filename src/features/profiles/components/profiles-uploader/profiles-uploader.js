import { Avatar } from '@files-ui/react';
import { UserOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { pick } from 'lodash';
import { useState } from 'react';
import { useUpdatePersonnel } from 'features/personnel';
import { useUploadFileManagementPublic } from 'features/shared';

const beforeUpload = (file) => {
  try {
    const imageContentTypes = ['image/webp', 'image/jpeg', 'image/jpg', 'image/png'];
    const isJpgOrPng = imageContentTypes.includes(file.type);
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  } catch (error) {
    return false;
  }
};

export function ProfilesUploader({ sources = undefined, self = '' }) {
  const [imageSource, setImageSource] = useState(self?.image_url || '');

  const updatePersonnel = useUpdatePersonnel({
    personnelId: self?.personnel_id,
    onSuccess: () => {
      message.success('อัปโหลดรูปภาพสำเร็จ');
    },
    onError: () => {
      message.error('ไม่สามารถอัปโหลดรูปภาพได้ กรุณาลองใหม่อีกครั้ง');
    },
  });

  const { submit, isLoading } = useUploadFileManagementPublic({
    bucketName: sources?.value,
    module: sources?.profile.module,
    group: sources?.profile.group,
    fileName: self?._id,
    onSuccess: (data) => {
      const payload = {
        ...pick(self, [
          'prefix_name',
          'prefix_name_en',
          'prefix_name_th',
          'first_name',
          'first_name_en',
          'first_name_th',
          'last_name',
          'last_name_en',
          'last_name_th',
          'image_url',
          'phone_number',
          'person_card_id',
          'email',
        ]),
        image_url: data.body.public_url,
      };
      updatePersonnel.submit(payload);
    },
    onError: () => {
      message.error('ไม่สามารถอัปโหลดรูปภาพได้ กรุณาลองใหม่อีกครั้ง');
    },
  });

  const onChange = (selectedFile) => {
    if (beforeUpload(selectedFile)) {
      setImageSource(selectedFile);
      submit({
        file: selectedFile,
      });
    }
  };

  return (
    <Avatar
      src={imageSource}
      variant="circle"
      onChange={onChange}
      isLoading={isLoading || updatePersonnel.isLoading}
      emptyLabel={<UserOutlined style={{ fontSize: 80 }} />}
      changeLabel="Upload"
      style={{ width: 90, height: 90, outline: '2px solid #000', backgroundColor: '#1B2531' }}
    />
  );
}
