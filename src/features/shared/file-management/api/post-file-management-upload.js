import { apiClient } from 'lib/api-client';

const convertBase64ToBlob = async (base64) => {
  const response = await fetch(base64);
  return await response.blob();
};

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

export const postFileManagementUpload = async ({ url, fields, file }) => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (key === 'Content-Type') return;
    formData.append(key, value);
  });

  const base64 = await getBase64(file);
  const blob = await convertBase64ToBlob(base64);
  formData.append('file', blob, file.name);

  return apiClient.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: null,
    },
  });
};
