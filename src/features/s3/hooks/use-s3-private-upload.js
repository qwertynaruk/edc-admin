import dayjs from 'dayjs';
import { omit } from 'lodash';
import useHttpClient from 'hooks/useHttpClient';
import { useMutation } from '@tanstack/react-query';
import { useS3Download } from './use-s3-download';

export function useS3PrivateUpload(props) {
  const { post, directive } = useHttpClient();

  const { mutateAsync } = useS3Download();

  const forceRequest = ({ _, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const dt = dayjs().toDate().toISOString();
      const groupNames = `temp_${dt}`;

      const newPayload = {
        file_name: payload.fileName,
        file_extension: payload.fileExtension,
        module: payload.module,
        group: groupNames,
        bucket_name: 'edc-private',
      };

      const fn = await post({ url: `/file/s3/upload`, payload: newPayload });

      return {
        ...fn,
        payload: {
          ...payload,
          group: groupNames,
        },
      };
    },
    async onSuccess(response) {
      if (response.statusCode !== 200) {
        props?.onError?.();
        return;
      }

      const headers = {
        'Content-Type': 'multipart/form-data',
      };

      const url = response.body.url_upload;

      const formData = new FormData();
      const fields = omit(response.body.fields, 'Content-Type');
      Object.entries(fields).forEach((items) => {
        formData.append(items[0], items[1]);
      });

      const blobFile = await response.payload?.files?.arrayBuffer().then((res) => {
        const blobs = new Blob([res]);
        return blobs;
      });

      formData.append('file', blobFile, response.payload?.fileName);

      try {
        return await directive({
          method: 'post',
          headers,
          url,
          body: formData,
        }).then(() => {
          mutateAsync({
            fileExtension: response.payload?.fileExtension,
            fileName: response.payload?.fileName,
            module: response.payload?.module,
            group: response.payload?.group,
          })
            .then((res) => {
              props?.onSuccess?.({
                ...res.body,
                fileExtension: response.payload?.fileExtension,
                uid: response.payload?.uid,
              });
            })
            .catch(() => {
              throw new Error('');
            });
        });
      } catch (error) {
        props?.onError?.();
      }
    },
    onError() {
      props?.onError?.();
    },
  });

  return {
    ...mutation,
    forceRequest,
  };
}
