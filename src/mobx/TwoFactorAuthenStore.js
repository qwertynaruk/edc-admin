/* eslint-disable camelcase */
import { action, observable } from 'mobx';
import { task } from 'mobx-task';

import fetch from 'axios/FetchMaster';

import DialogNotification from 'components/shared-components/DialogNotification';
import UserStore from './UserStore';

const TwoFactorAuthenStore = observable({
  twoFactorAuthInfo: {},
  login2FA: task(async (payload, idToken) => {
    try {
      const resp = await fetch.authentication({
        method: 'POST',
        url: '/login_2fa',
        data: payload,
        headers: {
          Authorization: idToken,
        },
      });

      const { statusCode = 400, data = {} } = resp;

      if (statusCode !== 200) {
        DialogNotification('error', 'ขออภัย', 'ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่อีกครั้ง');
        return;
      }

      UserStore.SetSignResult(data);
      DialogNotification('success', 'บันทึกข้อมูลเสร็จสิ้น');
      return Promise.resolve(resp);
    } catch (error) {
      DialogNotification('error', 'ขออภัย', 'ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่อีกครั้ง');
      return Promise.reject(error);
    }
  }),
  regisHardware: task(async (payload) => {
    try {
      const { accessAuthen } = UserStore;
      const resp = await fetch.authentication({
        method: 'POST',
        url: '/enable_2fa',
        data: payload,
        headers: {
          Authorization: accessAuthen.id_token,
        },
      });

      const { statusCode = 400 } = resp;

      if (statusCode !== 200) {
        DialogNotification('error', 'ขออภัย', 'ระบบขัดข้อง กรุณาลองใหม่อีกครั้ง');
        return;
      }

      const { fa_keys } = payload;

      UserStore.faKeyList = [
        {
          fa_key_name: fa_keys[0].name,
          fa_public_key: fa_keys[0].public_key,
        },
      ];

      DialogNotification('success', 'บันทึกข้อมูลเสร็จสิ้น');
      return Promise.resolve(resp);
    } catch (error) {
      DialogNotification('error', 'ขออภัย', 'ระบบขัดข้อง กรุณาลองใหม่อีกครั้ง');
      return Promise.reject(error);
    }
  }),
  getTwoFactorAuthInfo: task(async () => {
    try {
      const { accessAuthen } = UserStore;
      const resp = await fetch.authentication({
        method: 'GET',
        url: '/enable_2fa',
        headers: {
          Authorization: accessAuthen.id_token,
        },
      });

      const { statusCode = 400, data = {} } = resp;

      if (statusCode === 200) {
        TwoFactorAuthenStore.setTwoFactorAuthInfo(data);
      }
      return Promise.resolve(resp);
    } catch (error) {
      return Promise.reject(error);
    }
  }),
  setTwoFactorAuthInfo: action((_store) => (TwoFactorAuthenStore.twoFactorAuthInfo = _store)),
  updateTwoFactorAuthInfo: task(async (payload) => {
    try {
      const { accessAuthen } = UserStore;
      const resp = await fetch.authentication({
        method: 'PUT',
        url: '/enable_2fa',
        data: payload,
        headers: {
          Authorization: accessAuthen.id_token,
        },
      });

      const { statusCode = 400 } = resp;

      if (statusCode !== 200) {
        DialogNotification('error', 'ขออภัย', 'ระบบขัดข้อง กรุณาลองใหม่อีกครั้ง');
        return Promise.reject(resp);
      }

      DialogNotification('success', 'บันทึกข้อมูลเสร็จสิ้น');
      TwoFactorAuthenStore.getTwoFactorAuthInfo();
      return Promise.resolve(resp);
    } catch (error) {
      DialogNotification('error', 'ขออภัย', 'ระบบขัดข้อง กรุณาลองใหม่อีกครั้ง');
      return Promise.reject(error);
    }
  }),
  deleteTwoFactorAuthInfo: task(async () => {
    try {
      const { accessAuthen, faKeyList = [] } = UserStore;
      const resp = await fetch.authentication({
        method: 'DELETE',
        url: '/enable_2fa',
        data: faKeyList.length > 0 ? faKeyList[0] : {},
        headers: {
          Authorization: accessAuthen.id_token,
        },
      });

      const { statusCode = 400 } = resp;

      if (statusCode !== 200) {
        DialogNotification('error', 'ขออภัย', 'ระบบขัดข้อง กรุณาลองใหม่อีกครั้ง');
        return Promise.reject(resp);
      }

      UserStore.faKeyList = [];
      DialogNotification('success', 'ลบคีย์ที่ลงทะเบียนสำเร็จ');
      TwoFactorAuthenStore.getTwoFactorAuthInfo();
      return Promise.resolve(resp);
    } catch (error) {
      DialogNotification('error', 'ขออภัย', 'ระบบขัดข้อง กรุณาลองใหม่อีกครั้ง');
      return Promise.reject(error);
    }
  }),
});

export default TwoFactorAuthenStore;
