import { makeAutoObservable, runInAction, toJS } from 'mobx';

import { AUTH_PREFIX_PATH } from 'configs/AppConfig';
import { AutoSave } from './AutoSave';
import { Buffer } from 'buffer';
import CoreStore from './CoreStore';
import DetectPersonelCardId from 'utils/DetectPersonelCardId';
import DialogNotification from 'components/shared-components/DialogNotification';
import DialogPopup from 'components/shared-components/DialogPopup';
import { PASSWORD_PATTERN } from 'constants/RegexPattern';
import Swal from 'sweetalert2';
import UserService from 'services/UserService';
import _ from 'lodash';
import produce from 'immer';

export const rules = {
  personCardId: [
    {
      required: true,
      message: 'กรุณากรอกเลขประจำตัวประชาชน',
    },
    {
      validator: (_, value) =>
        DetectPersonelCardId(value || '')
          ? Promise.resolve()
          : Promise.reject(new Error('เลขประจำตัวประชาชนไม่ถูกต้อง')),
    },
  ],
  password: [
    {
      required: true,
      message: 'กรุณากรอกรหัสผ่าน',
    },
    {
      pattern: PASSWORD_PATTERN,
      message: 'รหัสผ่านต้องประกอบด้วยตัวอักษรภาษาอังกฤษตัวเล็กตัวใหญ่ตัวเลขและอักขระพิเศษอย่างน้อย 8 ตัวอักษร',
    },
  ],
  passwordConfirm: [
    {
      required: true,
      message: 'กรุณากรอกรหัสผ่านอีกครั้ง',
    },
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('กรุณากรอกรหัสผ่านให้ตรงกัน'));
      },
    }),
  ],
};
class MainStore {
  users = [];
  content_loading = false;
  actionLoading = false;
  countAll = 0;
  countActive = 0;
  user = {};
  role = [];
  department = {};
  position = {};
  accessAuthen = {};
  faKeyList = [];
  authLog = '';
  organization = {};
  branch = [];
  allBranch = [];
  selectBranch = {};
  isGlobal = false;
  disableChangeBranch = false;

  constructor() {
    makeAutoObservable(this);

    AutoSave(this, 'user-store');
  }

  get usersList() {
    return toJS(this.users);
  }

  async GetUserList(options) {
    runInAction(() => {
      this.content_loading = true;
    });
    try {
      const resp = await UserService.get_users(options);
      runInAction(() => {
        this.countAll = resp.count_all;
        this.countActive = resp.count_active;
        this.users = _.get(resp, 'data', []).map((el) => ({
          ...el,
          is_active: _.get(el, 'is_active', false),
        }));
      });
      return Promise.resolve(resp);
    } catch (error) {
      runInAction(() => {
        this.users = [];
      });
      return Promise.resolve(error);
    } finally {
      runInAction(() => {
        this.content_loading = false;
      });
    }
  }

  async CreateUser(body) {
    runInAction(() => {
      this.actionLoading = true;
    });
    try {
      const data = produce(body, (draft) => {
        draft.role = 'police';
      });
      const resp = await UserService.create({ data });
      return Promise.resolve(resp);
    } catch (error) {
      return Promise.reject(error);
    } finally {
      runInAction(() => {
        this.actionLoading = false;
      });
    }
  }

  async UpdateUser(id, body) {
    runInAction(() => {
      this.actionLoading = true;
    });
    try {
      const resp = await UserService.update(id, body);
      return Promise.resolve(resp);
    } catch (error) {
      return Promise.reject(error);
    } finally {
      runInAction(() => {
        this.actionLoading = false;
      });
    }
  }

  async ChooseBranch(body) {
    runInAction(() => {
      this.actionLoading = true;
      this.content_loading = true;
    });
    try {
      this.selectBranch = body;
      return Promise.resolve(body);
    } catch (error) {
      return Promise.reject(error);
    } finally {
      runInAction(() => {
        this.actionLoading = false;
        this.content_loading = false;
      });
    }
  }

  async GetUser() {
    runInAction(() => {
      this.content_loading = true;
    });
    try {
      // const resp = await UserService.get_user(id);
      const resp = await UserService.get_user();
      runInAction(() => {
        this.user = resp.data.user;
        this.role = resp.data.role;
        this.department = resp.data.department;
        this.position = resp.data.position;
        this.branch = resp.data.branch;
        this.organization = resp.data.organization;
        this.isGlobal = resp.data.is_global;
        const mapBranch = (resp.data.branch || []).map((el) => ({
          label: el.short_name_th,
          value: el.organization,
          id: el._id,
        }));
        mapBranch.unshift({
          label: this.organization.short_name_th,
          value: this.organization.organization,
          id: this.organization._id,
        });
        this.allBranch = mapBranch;
      });
      return Promise.resolve(resp);
    } catch (error) {
      return Promise.reject(error || {});
    } finally {
      runInAction(() => {
        this.content_loading = false;
      });
    }
  }

  async SetSignResult(data, redirect = null) {
    const signDate = new Date();
    signDate.setSeconds(signDate.getSeconds() + _.get(data, 'expires_in', 86400));

    this.accessAuthen = {
      ...data,
      expires_at: signDate.getTime(),
    };

    this.selectBranch = {
      chooseBranch: {
        label: 'EDC',
        value: 'edc',
        id: '668519988f8b382de8994b66',
      },
    };

    setTimeout(() => {
      window.location.href = redirect || '/';
    }, 500);

    const bombay = 'general be';

    if (bombay === 'programmer') {
      Swal.fire({
        title: 'รอสักครู่ ระบบกำลังโหลดข้อมูล',
        text: 'เรากำลังจัดเตรียมทรัพยากรสำหรับการเข้าใช้งานระบบ',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      CoreStore.GetAllRelateStore()
        .then(() => {
          DialogNotification('success', 'เข้าสู่ระบบสำเร็จ');

          setTimeout(() => {
            if (_.isEmpty(this.branch)) {
              this.selectBranch = {
                chooseBranch: {
                  label: this.organization.short_name_th,
                  value: this.organization.organization,
                  id: this.organization._id,
                },
              };
              window.location.href = redirect || '/';
            } else {
              window.location.href =
                AUTH_PREFIX_PATH + '/organization' + (redirect ? `?redirect=${encodeURIComponent(redirect)}` : '');
            }
          }, 500);
        })
        .catch((errs) => {
          console.error('load resource has error cause:', errs);
          DialogNotification('error', 'ไม่สามารถเข้าสู่ระบบได้', 'พบปัญการจัดเตรียมทรัพยากร กรุณาลองใหม่อีกครั้ง');
        })
        .finally(() => {
          Swal.close();
        });
    }
  }

  async SignInAccess(payload, redirect) {
    runInAction(() => {
      this.content_loading = true;
    });
    try {
      const resp = await UserService.signIn(payload);
      const { data = {} } = resp;
      if (_.get(data, 'is_enable_2fa', false) || false) {
        const { username = '', password = '', ip = '' } = payload;
        this.faKeyList = _.get(data, 'fa_keys', []);
        this.authLog = Buffer.from(JSON.stringify({ username: username.trim(), password, ip })).toString('base64');
        this.wgToken = data.id_token || '';
        window.location.href = '/auth/login-2fa/';
      } else {
        this.SetSignResult(data, redirect);
      }
    } catch (error) {
      DialogNotification('error', error?.error || 'เข้าสู่ระบบไม่สำเร็จ');
      // return Promise.reject(error);
    } finally {
      runInAction(() => {
        this.content_loading = false;
      });
    }
  }

  async DirectSignOutAccess() {
    try {
      Swal.fire({
        title: 'รอสักครู่ ระบบกำลังออกจากระบบ',
        text: '',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const payload = {
        access_token: _.get(this.accessAuthen, 'access_token', ''),
        ip: localStorage.getItem('app_ip') || '',
      };

      await UserService.signOut(payload);
    } catch (error) {
      console.log(error);
    } finally {
      localStorage.clear();
      window.location.reload();
    }
  }

  SignOutAccess() {
    DialogPopup.confirm({
      title: 'ยืนยันการออกจากระบบ',
      text: 'ท่านต้องการออกจากระบบใช่หรือไม่',
      confirmAction: () => {
        this.DirectSignOutAccess();
      },
    });
  }

  async RefreshToken() {
    const { refresh_token = '' } = this.accessAuthen;
    const { email = '' } = this.user;

    try {
      const payload = {
        // email,
        refresh_token,
      };

      const resp = await UserService.refreshToken(payload);

      const { data = {} } = resp;
      const { access_token = '', id_token = '', refresh_token: refresh_token_new } = data;
      const rawData = this.accessAuthen;

      const signDate = new Date();
      signDate.setSeconds(signDate.getSeconds() + _.get(data, 'expires_in', 86400));

      this.accessAuthen = {
        ...rawData,
        access_token,
        id_token,
        expires_at: signDate.getTime(),
      };

      return Promise.resolve('success');
    } catch (error) {
      this.DirectSignOutAccess();
      return Promise.reject(error);
    }
  }

  async RefreshQueueToken() {
    const { queue_refresh_token = '' } = this.accessAuthen;
    const { email = '' } = this.user;

    try {
      const payload = {
        // username: email,
        // auth_type: 'police',
        refresh_token: queue_refresh_token,
      };

      const resp = await UserService.refreshQueueToken(payload);
      const access_token = _.get(resp, 'body.access_token', '') || '';

      const rawData = this.accessAuthen;

      this.accessAuthen = {
        ...rawData,
        queue_access_token: access_token,
      };

      return Promise.resolve('success');
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async ChangePolicePassword(username, password) {
    runInAction(() => {
      this.actionLoading = true;
    });
    try {
      const resp = await UserService.reset_password_police({
        data: {
          username,
          password,
        },
      });
      return Promise.resolve(resp);
    } catch (error) {
      console.error(error);
      return Promise.reject(error || {});
    } finally {
      runInAction(() => {
        this.actionLoading = false;
      });
    }
  }

  async ChangeDisableChangeBranch(value) {
    console.log('value', value);
    console.log('aaa', this.disableChangeBranch);

    try {
      runInAction(() => {
        this.disableChangeBranch = value;
      });
    } catch (error) {
      console.log('error', error);
    } finally {
      console.log('finally');
    }
  }
}

const UserStore = new MainStore();
export default UserStore;
