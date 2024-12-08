import useHttpClient from 'hooks/useHttpClient';
import { useMutation } from '@tanstack/react-query';

export function useS3Download(props) {
  const { post } = useHttpClient();

  return useMutation({
    mutationFn: async (payload) => {
      const newPayload = {
        module: payload.module,
        group: payload.group,
        file_extension: payload.fileExtension,
        file_name: payload.fileName,
        bucket_name: 'edc-private',
        expires_in: 3600,
      };

      return await post({ url: `/file/s3/download`, payload: newPayload });
    },
    onSuccess(response) {
      if (response.statusCode !== 200) {
        props?.onError?.();
        return;
      }

      props?.onSuccess?.(response.body);
      return response.body;
    },
    onError() {
      props?.onError?.();
    },
  });
}
