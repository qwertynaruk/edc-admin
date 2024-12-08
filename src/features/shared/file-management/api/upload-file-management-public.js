import { API_FILE_MANAGEMENT_ENDPOINT_URL } from 'configs/AppConfig';
import { BUCKETNAME_SOS } from 'constants/SOSConstant';
import { apiClient } from 'lib/api-client';
import { message } from 'antd';
import { postFileManagementUpload } from './post-file-management-upload';
import { useMutation } from '@tanstack/react-query';

export const uploadFileManagementPublic = async ({
  bucketName = 'onelife-public',
  module,
  group,
  fileExtension,
  fileName,
  expiresIn,
}) => {
  return await apiClient.post(
    `/upload-public`,
    {
      bucket_name: bucketName,
      module,
      group,
      file_extension: fileExtension,
      file_name: fileName,
      expires_in: expiresIn,
    },
    {
      baseURL: API_FILE_MANAGEMENT_ENDPOINT_URL,
    }
  );
};

export const uploadFileManagementPrivate = async ({
  bucketName = BUCKETNAME_SOS[1].value,
  module,
  group,
  fileExtension,
  fileName,
  expiresIn,
}) => {
  return await apiClient.post(
    `/upload`,
    {
      bucket_name: bucketName,
      module,
      group,
      file_extension: fileExtension,
      file_name: fileName,
      expires_in: expiresIn,
    },
    {
      baseURL: API_FILE_MANAGEMENT_ENDPOINT_URL,
    }
  );
};

export const useUploadFileManagementPublic = ({
  bucketName = BUCKETNAME_SOS[0].value,
  module,
  group,
  onSuccess,
  onError,
  fileName,
}) => {
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ file, expiresIn }) => {
      try {
        const messageHide = message.loading('Uploading...', 0);
        const fileExtension = file.name.split('.').pop();
        const fileNameFile = fileName || file.name;

        const preUploadResp = await uploadFileManagementPublic({
          bucketName,
          module,
          group,
          fileExtension,
          fileName: fileNameFile,
          expiresIn,
        });

        const uploadResp = await postFileManagementUpload({
          url: preUploadResp.body.url_upload,
          fields: preUploadResp.body.fields,
          file,
        });

        messageHide();

        return {
          ...uploadResp,
          ...preUploadResp,
        };
      } catch (error) {
        console.error(`error`, error);
        throw error;
      }
    },
    onSuccess,
    onError,
  });

  return {
    submit: mutate,
    isLoading: isPending,
  };
};

export const useUploadFileManagementPrivate = ({
  bucketName = BUCKETNAME_SOS[1].value,
  module,
  group,
  onSuccess,
  onError,
}) => {
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ file, expiresIn }) => {
      try {
        const messageHide = message.loading('Uploading...', 0);
        const fileExtension = file.name.split('.').pop();
        const fileName = file.name;

        const preUploadResp = await uploadFileManagementPrivate({
          bucketName,
          module,
          group,
          fileExtension,
          fileName,
          expiresIn,
        });

        console.log('preUploadResp', preUploadResp);

        const uploadResp = await postFileManagementUpload({
          url: preUploadResp.body.url_upload,
          fields: preUploadResp.body.fields,
          file,
        });

        console.log('uploadResp', uploadResp);

        messageHide();

        return {
          ...uploadResp,
          ...preUploadResp,
        };
      } catch (error) {
        console.error(`error`, error);
        throw error;
      }
    },
    onSuccess,
    onError,
  });

  return {
    submit: mutate,
    isLoading: isPending,
  };
};
