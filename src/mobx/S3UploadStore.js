import { task } from 'mobx-task';
import { observable } from 'mobx';
import axios from 'axios';
import fetch from 'axios/FetchMaster';
import UserStore from 'mobx/UserStore';
import DialogNotification from 'components/shared-components/DialogNotification';

const S3UploadStore = observable({
  onProcessing: task(async (reqParams, sourceOrigin) => {
    const { key, signedUrl, url, fields } = reqParams;

    const mergeform = new FormData();
    const o2a = Object.entries(fields);

    o2a.forEach((ex) => mergeform.append(ex[0], ex[1]));
    mergeform.append('file', sourceOrigin.file.originFileObj);

    try {
      const proms = await axios({ method: 'post', url: signedUrl, data: mergeform });

      if (![200, 204].includes(proms.status)) {
        return Promise.reject(proms.status);
      }

      return Promise.resolve({ key, url });
    } catch (error) {
      DialogNotification('error', 'ระบบขัดข้อง', 'ไม่สามารถอัปโหลดไฟล์ได้ กรุณาลองใหม่อีกครั้ง');
      return Promise.reject(error);
    }
  }),
  doUploadS3: task(async (payload) => {
    // eslint-disable-next-line camelcase
    const { auth_id = '' } = UserStore.accessAuthen;

    const newBody = {
      type_id: payload.bucketName,
      file_name: [payload.file.uid, payload.file.name].join('-'),
    };
    if (payload?.objectIDReplaceUserID) {
      // eslint-disable-next-line camelcase
      newBody.object_id = auth_id;
    } else {
      // eslint-disable-next-line camelcase
      newBody.user_id = auth_id;
    }

    try {
      const reqUrl = await fetch.upload({ method: 'post', url: '/upload-get-presign', data: { data: newBody } });

      const finalProcess = await S3UploadStore.onProcessing(reqUrl, payload);
      return Promise.resolve(finalProcess);
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  doDeleteS3: task(async (payload) => {
    const newBody = { url: payload };

    try {
      const resp = await fetch.upload({ method: 'post', url: '/s3/delete-file', data: newBody });
      DialogNotification('success', 'ลบไฟล์สำเร็จ');
      return Promise.resolve(resp);
    } catch (error) {
      DialogNotification('error', 'ขออภัย', 'ไม่สามารถทำรายการได้');
      return Promise.reject(error);
    }
  }),
  doImportSource: task(async (payload = {}) => {
    try {
      const resp = await fetch.upload({ method: 'post', url: '/import', data: { data: payload } });
      const { statusCode = 400, message = '', error = [] } = resp;

      if (statusCode !== 200) {
        const rejectObj = { message, error };
        return Promise.reject(rejectObj);
      }

      DialogNotification('success', 'นำเข้าข้อมูลสำเร็จ');
      return Promise.resolve(resp);
    } catch (error) {
      return Promise.reject(error);
    }
  }),
});

export default S3UploadStore;
